import { createStore } from 'vuex'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../firebase'

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

export default createStore({
  state: {
    user: null,
    authLoading: false,
    authError: null,
    authReady: false,
    preferences: {
      tempScale: loadTempScale()
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    userEmail: (state) => state.user?.email || '',
    userName: (state) => state.user?.displayName || state.user?.email || '',
    tempScale: (state) => state.preferences.tempScale
  },
  mutations: {
    SET_USER (state, payload) {
      state.user = payload
    },
    SET_AUTH_LOADING (state, payload) {
      state.authLoading = payload
    },
    SET_AUTH_ERROR (state, payload) {
      state.authError = payload
    },
    SET_AUTH_READY (state, payload) {
      state.authReady = payload
    },
    SET_TEMP_SCALE (state, payload) {
      state.preferences.tempScale = payload
    }
  },
  actions: {
    initAuthListener ({ commit }) {
      return new Promise((resolve) => {
        let firstEvent = true
        onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            commit('SET_USER', {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName
            })
          } else {
            commit('SET_USER', null)
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
        return true
      } catch (err) {
        const code = err?.code || ''
        // Ayuda a depurar en DevTools sin exponer datos sensibles
        if (process.env.NODE_ENV === 'development') {
          console.warn('[Firebase Auth]', code, err?.message)
        }

        const byCode = {
          'auth/invalid-credential': 'Email o contraseña incorrectos.',
          'auth/wrong-password': 'Email o contraseña incorrectos.',
          'auth/user-not-found': 'No existe una cuenta con ese email.',
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
    async logout ({ commit }) {
      await signOut(auth)
      commit('SET_USER', null)
    },
    updateTempScale ({ commit }, value) {
      commit('SET_TEMP_SCALE', value)
      saveTempScale(value)
    }
  }
})

