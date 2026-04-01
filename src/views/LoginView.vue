<template>
  <div class="login-page">
    <nav class="login-nav navbar navbar-dark bg-dark border-bottom border-secondary shadow-sm">
      <div class="container-fluid px-3 px-md-4">
        <router-link
          class="login-nav-home-link text-success text-decoration-none d-inline-flex align-items-center py-2 px-1"
          :to="{ name: 'home' }"
          aria-label="Ir al Home"
        >
          <i class="bi bi-arrow-left login-nav-home-icon" aria-hidden="true" />
        </router-link>
      </div>
    </nav>

    <main class="login-main">
      <div class="container px-3 px-md-4">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-11 col-md-8 col-lg-5 col-xl-4">
            <div
              v-if="redirectNotice"
              class="app-banner app-banner--info small mb-3"
              role="status"
            >
              Inicia sesión para continuar hacia la página que intentaste abrir.
            </div>

            <div class="card login-card border-0 shadow">
              <div class="card-body p-4 p-md-5">
                <h1 class="h4 mb-2 text-start login-title">Iniciar sesión</h1>
                <p class="text-muted small mb-4 text-start login-lead">
                  Ingresa para acceder al detalle de playas.
                </p>

                <form
                  ref="loginFormEl"
                  :key="'login-form-' + loginFormResetNonce"
                  class="login-form"
                  autocomplete="off"
                  @submit.prevent="onSubmit"
                >
                  <div class="mb-3 text-start">
                    <label class="form-label fw-semibold" for="login-email">Email</label>
                    <input
                      id="login-email"
                      v-model="email"
                      type="email"
                      class="form-control form-control-lg login-input"
                      placeholder="tuemail@dominio.com"
                      autocomplete="username"
                      :readonly="loginFieldsLocked"
                      @focus="unlockLoginFields"
                    >
                  </div>

                  <div class="mb-2 text-start">
                    <label class="form-label fw-semibold" for="login-password">Contraseña</label>
                    <input
                      id="login-password"
                      v-model="password"
                      type="password"
                      class="form-control form-control-lg login-input"
                      placeholder="Tu contraseña"
                      autocomplete="current-password"
                      :readonly="loginFieldsLocked"
                      @focus="unlockLoginFields"
                    >
                  </div>

                  <div class="text-start mb-3">
                    <router-link :to="forgotPasswordTo" class="small login-forgot-link">
                      ¿Olvidaste tu contraseña?
                    </router-link>
                  </div>

                  <p
                    v-if="authError"
                    class="text-danger small text-start mb-3 login-error"
                    role="alert"
                  >
                    {{ authError }}
                  </p>

                  <button
                    type="submit"
                    class="btn btn-success w-100 py-2 fw-semibold login-submit"
                    :disabled="authLoading"
                  >
                    {{ authLoading ? 'Entrando…' : 'Entrar' }}
                  </button>
                </form>

                <router-link
                  :to="registerTo"
                  class="btn btn-outline-success w-100 py-2 fw-semibold mt-3 login-register-cta"
                >
                  Registrarse
                </router-link>

                <router-link
                  :to="{ name: 'home' }"
                  class="btn btn-outline-secondary w-100 mt-3 login-back"
                >
                  Volver al inicio
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const route = useRoute()

const loginFormEl = ref(null)
const email = ref('')
const password = ref('')
const loginFieldsLocked = ref(true)

const loginFormResetNonce = computed(() => store.state.loginFormResetNonce)

function unlockLoginFields () {
  loginFieldsLocked.value = false
}

async function clearLoginForm () {
  email.value = ''
  password.value = ''
  loginFieldsLocked.value = true
  await nextTick()
  loginFormEl.value?.reset()
}

watch(
  () => store.state.loginFormResetNonce,
  () => {
    void clearLoginForm()
  },
  { immediate: true }
)

const authLoading = computed(() => store.state.authLoading)
const authError = computed(() => store.state.authError)

const redirectNotice = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/')
})

const registerTo = computed(() => {
  const q = {}
  const r = route.query.redirect
  if (typeof r === 'string' && r.startsWith('/')) {
    q.redirect = r
  }
  return { name: 'register', query: q }
})

const forgotPasswordTo = computed(() => {
  const q = {}
  const r = route.query.redirect
  if (typeof r === 'string' && r.startsWith('/')) {
    q.redirect = r
  }
  return { name: 'forgot-password', query: q }
})

async function onSubmit () {
  const ok = await store.dispatch('login', {
    email: email.value.trim(),
    password: password.value
  })

  if (ok) {
    clearLoginForm()
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.startsWith('/')) {
      await router.replace(redirect)
    } else {
      await router.replace({ name: 'home' })
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--app-success-surface);
  color: #2c3e50;
}

.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 2rem 0 3rem;
}

.login-card {
  border-radius: 1.2rem;
  border-top: 3px solid #198754;
  background: #fff;
}

.login-title {
  color: #2c3e50;
  font-weight: 700;
}

.login-lead {
  line-height: 1.5;
}

.login-input {
  border-radius: 0.85rem;
  border-color: #ced4da;
}

.login-form .login-input {
  background-color: var(--app-success-surface);
}

.login-input:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.18);
}

.login-form .login-input::placeholder {
  font-size: 0.68rem;
  font-weight: 400;
  line-height: 1.35;
  color: #868e96;
  opacity: 1;
}

.login-form .login-input::-moz-placeholder {
  font-size: 0.68rem;
  font-weight: 400;
  line-height: 1.35;
  color: #868e96;
  opacity: 1;
}

.login-form .login-input:-ms-input-placeholder {
  font-size: 0.68rem;
  font-weight: 400;
  color: #868e96;
}

.login-error {
  padding: 0.35rem 0.5rem;
  border-radius: 0.375rem;
  background: rgba(220, 53, 69, 0.08);
}

.login-submit {
  border-radius: 0.75rem;
}

.login-submit:disabled {
  opacity: 0.75;
}

.login-back {
  border-radius: 0.75rem;
}

.login-register-cta {
  border-radius: 0.75rem;
}

.login-forgot-link {
  font-weight: 600;
  color: #198754;
  text-decoration: none;
}

.login-forgot-link:hover,
.login-forgot-link:focus-visible {
  color: #146c43;
  text-decoration: underline;
}

@media (max-width: 576px) {
  .login-main {
    padding: 1.25rem 0 2rem;
    align-items: flex-start;
  }
}
</style>

