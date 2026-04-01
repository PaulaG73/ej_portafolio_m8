import { createStore } from 'vuex'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'
import { auth, db } from '../firebase'
import {
  isRegisterPasswordValid,
  REGISTER_PASSWORD_POLICY_MESSAGE
} from '../utils/registerPassword'

// Misma clave que ya usan HomeView y PlayaCardDetalle
const TEMP_SCALE_KEY = 'escalaTemp'

function loadTempScale () {
  try {
    return localStorage.getItem(TEMP_SCALE_KEY) || '°C'
  } catch {
    return '°C'
  }
}

function saveTempScale (value) {
  try {
    localStorage.setItem(TEMP_SCALE_KEY, value)
  } catch {
    // ignore localStorage errors
  }
}

/** @type {null | (() => void)} */
let favoritesUnsubscribe = null

function stopFavoritesListener () {
  if (favoritesUnsubscribe) {
    favoritesUnsubscribe()
    favoritesUnsubscribe = null
  }
}

function playaPais (playa) {
  if (!playa || typeof playa !== 'object') return ''
  return typeof playa.país === 'string'
    ? playa.país
    : (typeof playa.pais === 'string' ? playa.pais : '')
}

function favoriteSortMs (updatedAt) {
  if (!updatedAt) return 0
  if (typeof updatedAt.toMillis === 'function') return updatedAt.toMillis()
  if (typeof updatedAt.seconds === 'number') return updatedAt.seconds * 1000
  return 0
}

export default createStore({
  state: {
    user: null,
    authLoading: false,
    authError: null,
    /** 'registered' | null — aviso puntual tras crear cuenta (home o detalle). */
    flashAuthBanner: null,
    authReady: false,
    /** Se incrementa en cada logout para que LoginView vacíe el formulario al reentrar. */
    loginFormResetNonce: 0,
    preferences: {
      tempScale: loadTempScale()
    },
    /** Firestore: `users/{uid}/favorites/{playaId}` */
    favoritesById: {}
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email || '',
    userName: (state) => state.user?.displayName || state.user?.email || '',
    /** Texto para navbar: nombre + apellido (Firestore), si no displayName de Auth; no usa el correo. */
    userNavLabel: (state) => {
      const u = state.user
      if (!u) return ''
      const n = (u.nombre || '').trim()
      const a = (u.apellido || '').trim()
      const fromDoc = [n, a].filter(Boolean).join(' ').trim()
      if (fromDoc) return fromDoc
      const dn = (u.displayName || '').trim()
      if (dn) return dn
      return 'Usuario'
    },
    tempScale: (state) => state.preferences.tempScale,
    favoritesList: (state) =>
      Object.entries(state.favoritesById)
        .map(([playaId, data]) => ({ playaId, ...data }))
        .sort(
          (a, b) => favoriteSortMs(b.updatedAt) - favoriteSortMs(a.updatedAt)
        )
  },
  mutations: {
    SET_USER (state, payload) {
      state.user = payload
    },
    MERGE_USER (state, partial) {
      if (!state.user || !partial) return
      state.user = { ...state.user, ...partial }
    },
    SET_AUTH_LOADING (state, payload) {
      state.authLoading = payload
    },
    SET_AUTH_ERROR (state, payload) {
      state.authError = payload
    },
    SET_FLASH_AUTH_BANNER (state, payload) {
      state.flashAuthBanner = payload
    },
    SET_AUTH_READY (state, payload) {
      state.authReady = payload
    },
    SET_TEMP_SCALE (state, payload) {
      state.preferences.tempScale = payload
    },
    BUMP_LOGIN_FORM_RESET (state) {
      state.loginFormResetNonce += 1
    },
    SET_FAVORITES_BY_ID (state, payload) {
      state.favoritesById =
        payload && typeof payload === 'object' ? { ...payload } : {}
    },
    CLEAR_FAVORITES (state) {
      state.favoritesById = {}
    }
  },
  actions: {
    initAuthListener ({ commit }) {
      return new Promise((resolve) => {
        let firstEvent = true
        onAuthStateChanged(auth, (firebaseUser) => {
          stopFavoritesListener()
          if (firebaseUser) {
            commit('SET_USER', {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              nombre: null,
              apellido: null
            })
            commit('CLEAR_FAVORITES')
            const favCol = collection(db, 'users', firebaseUser.uid, 'favorites')
            favoritesUnsubscribe = onSnapshot(
              favCol,
              (snap) => {
                const map = {}
                snap.forEach((d) => {
                  map[d.id] = d.data()
                })
                commit('SET_FAVORITES_BY_ID', map)
              },
              (e) => {
                if (process.env.NODE_ENV === 'development') {
                  console.warn('[Firestore favoritos]', e?.code, e?.message)
                }
              }
            )
            void (async () => {
              try {
                const snap = await getDoc(doc(db, 'users', firebaseUser.uid))
                if (snap.exists()) {
                  const d = snap.data()
                  commit('MERGE_USER', {
                    nombre: typeof d.nombre === 'string' ? d.nombre : null,
                    apellido: typeof d.apellido === 'string' ? d.apellido : null
                  })
                }
              } catch (e) {
                if (process.env.NODE_ENV === 'development') {
                  console.warn('[Firestore perfil lectura]', e?.code, e?.message)
                }
              }
            })()
          } else {
            commit('SET_USER', null)
            commit('CLEAR_FAVORITES')
          }
          commit('SET_AUTH_READY', true)
          if (firstEvent) {
            firstEvent = false
            resolve()
          }
        })
      })
    },
    async login ({ commit }, { email, password }) {
      commit('SET_AUTH_ERROR', null)

      if (!email || !password) {
        commit('SET_AUTH_ERROR', 'Completa email y contraseña.')
        return false
      }

      commit('SET_AUTH_LOADING', true)
      try {
        await signInWithEmailAndPassword(auth, email, password)
        commit('BUMP_LOGIN_FORM_RESET')
        return true
      } catch (err) {
        const code = err?.code || ''
        // Ayuda a depurar en DevTools sin exponer datos sensibles
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Firebase Auth]', code, err?.message)
        }

        const credencialMsg =
          'No encontramos una cuenta con ese email o la contraseña no es correcta. Comprueba los datos o crea una cuenta nueva desde Registrarse.'

        const byCode = {
          'auth/invalid-credential': credencialMsg,
          'auth/invalid-login-credentials': credencialMsg,
          'auth/wrong-password': credencialMsg,
          'auth/user-not-found':
            'No hay una cuenta registrada con ese email. Puedes crear una en Registrarse.',
          'auth/invalid-email': 'El email no tiene un formato válido.',
          'auth/user-disabled': 'Esta cuenta fue deshabilitada.',
          'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
          'auth/network-request-failed': 'Sin conexión o error de red. Revisa tu internet.',
          'auth/operation-not-allowed': 'El inicio por email/contraseña no está habilitado en Firebase (Authentication → Sign-in method).',
          'auth/invalid-api-key': 'API key de Firebase inválida. Revisa las variables VUE_APP_FIREBASE_* y reinicia npm run serve.'
        }

        commit(
          'SET_AUTH_ERROR',
          byCode[code] || `No se pudo iniciar sesión${code ? ` (${code})` : ''}.`
        )
        return false
      } finally {
        commit('SET_AUTH_LOADING', false)
      }
    },
    async sendPasswordReset ({ commit }, { email }) {
      commit('SET_AUTH_ERROR', null)

      const e = email?.trim() || ''
      if (!e) {
        commit('SET_AUTH_ERROR', 'Ingresa tu email.')
        return false
      }

      commit('SET_AUTH_LOADING', true)
      try {
        await sendPasswordResetEmail(auth, e)
        return true
      } catch (err) {
        const code = err?.code || ''
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Firebase Auth recuperar]', code, err?.message)
        }

        // Evita filtrar si el email existe o no (comportamiento habitual en Firebase).
        if (code === 'auth/user-not-found') {
          return true
        }

        const byCode = {
          'auth/invalid-email': 'El email no tiene un formato válido.',
          'auth/missing-email': 'Ingresa tu email.',
          'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos.',
          'auth/network-request-failed': 'Sin conexión o error de red. Revisa tu internet.',
          'auth/operation-not-allowed': 'La recuperación por email no está disponible. Revisa Authentication en Firebase.',
          'auth/invalid-api-key': 'API key de Firebase inválida. Revisa las variables VUE_APP_FIREBASE_* y reinicia npm run serve.'
        }

        commit(
          'SET_AUTH_ERROR',
          byCode[code] || `No se pudo enviar el correo${code ? ` (${code})` : ''}.`
        )
        return false
      } finally {
        commit('SET_AUTH_LOADING', false)
      }
    },
    async register (
      { commit },
      { nombre, apellido, telefono, email, password }
    ) {
      commit('SET_AUTH_ERROR', null)

      const n = nombre?.trim() || ''
      const a = apellido?.trim() || ''
      const t = telefono?.trim() || ''
      const e = email?.trim() || ''

      if (!n || !a || !t || !e || !password) {
        commit('SET_AUTH_ERROR', 'Completa todos los campos.')
        return false
      }

      if (!isRegisterPasswordValid(password)) {
        commit('SET_AUTH_ERROR', REGISTER_PASSWORD_POLICY_MESSAGE)
        return false
      }

      commit('SET_AUTH_LOADING', true)
      try {
        const cred = await createUserWithEmailAndPassword(auth, e, password)
        const displayName = `${n} ${a}`.trim()
        await updateProfile(cred.user, { displayName })
        commit('MERGE_USER', { displayName, nombre: n, apellido: a })
        // No esperamos Firestore: si el proyecto o la red van lentos, no bloquea el registro.
        setDoc(doc(db, 'users', cred.user.uid), {
          nombre: n,
          apellido: a,
          telefono: t,
          email: e,
          updatedAt: serverTimestamp()
        }).catch((fireErr) => {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[Firestore perfil]', fireErr?.code, fireErr?.message)
          }
        })
        commit('SET_FLASH_AUTH_BANNER', 'registered')
        return true
      } catch (err) {
        const code = err?.code || ''
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Firebase Auth registro]', code, err?.message)
        }

        const byCode = {
          'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
          'auth/invalid-email': 'El email no tiene un formato válido.',
          'auth/weak-password': REGISTER_PASSWORD_POLICY_MESSAGE,
          'auth/operation-not-allowed': 'El registro por email/contraseña no está habilitado en Firebase (Authentication → Sign-in method).',
          'auth/network-request-failed': 'Sin conexión o error de red. Revisa tu internet.',
          'auth/invalid-api-key': 'API key de Firebase inválida. Revisa las variables VUE_APP_FIREBASE_* y reinicia npm run serve.'
        }

        commit(
          'SET_AUTH_ERROR',
          byCode[code] || `No se pudo crear la cuenta${code ? ` (${code})` : ''}.`
        )
        return false
      } finally {
        commit('SET_AUTH_LOADING', false)
      }
    },
    async toggleFavorite ({ state }, playa) {
      const uid = state.user?.uid
      const id = playa?.id
      if (!uid || !id) return

      const favRef = doc(db, 'users', uid, 'favorites', id)
      try {
        if (state.favoritesById[id]) {
          await deleteDoc(favRef)
        } else {
          await setDoc(favRef, {
            nombrePlaya: typeof playa.name1 === 'string' ? playa.name1 : '',
            pais: playaPais(playa),
            fotoThumbUrl: typeof playa.img === 'string' ? playa.img : '',
            updatedAt: serverTimestamp()
          })
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Firestore favorito toggle]', e?.code, e?.message)
        }
      }
    },
    async logout ({ commit }) {
      stopFavoritesListener()
      commit('SET_AUTH_LOADING', false)
      commit('SET_AUTH_ERROR', null)
      commit('SET_FLASH_AUTH_BANNER', null)
      commit('CLEAR_FAVORITES')
      commit('SET_USER', null)
      try {
        await signOut(auth)
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Firebase Auth logout]', err?.code, err?.message)
        }
      }
      commit('SET_USER', null)
      commit('BUMP_LOGIN_FORM_RESET')
      const { default: router } = await import('../router')
      await router.push({ name: 'home' }).catch(() => {})
    },
    updateTempScale ({ commit }, value) {
      commit('SET_TEMP_SCALE', value)
      saveTempScale(value)
    }
  }
})

