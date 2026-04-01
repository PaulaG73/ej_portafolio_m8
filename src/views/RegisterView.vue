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
          <div class="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7">
            <div
              v-if="redirectNotice"
              class="app-banner app-banner--info small mb-3"
              role="status"
            >
              Tras registrarte irás a la página que intentaste abrir.
            </div>

            <div class="card login-card border-0 shadow">
              <div class="card-body p-4 p-md-5">
                <h1 class="h4 mb-2 text-start login-title">Crear cuenta</h1>
                <p class="text-muted small mb-4 text-start login-lead">
                  Regístrate para acceder al detalle de playas.
                </p>

                <form @submit.prevent="onSubmit" class="login-form register-form">
                  <div class="mb-3 text-start">
                    <label class="form-label fw-semibold" for="nombre">Nombre</label>
                    <input
                      id="nombre"
                      v-model="nombre"
                      type="text"
                      class="form-control form-control-lg login-input"
                      placeholder="Tu nombre"
                      autocomplete="given-name"
                    >
                  </div>

                  <div class="mb-3 text-start">
                    <label class="form-label fw-semibold" for="apellido">Apellido</label>
                    <input
                      id="apellido"
                      v-model="apellido"
                      type="text"
                      class="form-control form-control-lg login-input"
                      placeholder="Tu apellido"
                      autocomplete="family-name"
                    >
                  </div>

                  <div class="mb-3 text-start">
                    <label class="form-label fw-semibold" for="telefono">Celular</label>
                    <input
                      id="telefono"
                      v-model="telefono"
                      type="tel"
                      class="form-control form-control-lg login-input"
                      placeholder="Ej. 9 1234 5678"
                      autocomplete="tel"
                    >
                  </div>

                  <div class="mb-3 text-start">
                    <label class="form-label fw-semibold" for="email">Email</label>
                    <input
                      id="email"
                      v-model="email"
                      type="email"
                      class="form-control form-control-lg login-input"
                      placeholder="tuemail@dominio.com"
                      autocomplete="email"
                    >
                  </div>

                  <div class="mb-3 text-start">
                    <label class="form-label fw-semibold" for="password">Contraseña</label>
                    <input
                      id="password"
                      v-model="password"
                      type="password"
                      class="form-control form-control-lg login-input"
                      placeholder="Elige una contraseña segura"
                      autocomplete="new-password"
                    >
                    <ul class="password-rules small text-muted mt-2 mb-0 ps-3 text-start">
                      <li>Mínimo 6 caracteres, con letras y números.</li>
                      <li>Al menos una mayúscula y al menos un número.</li>
                    </ul>
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
                    {{ authLoading ? 'Creando cuenta…' : 'Registrarse' }}
                  </button>
                </form>

                <p class="small text-muted text-center mt-3 mb-2 login-secondary-text">
                  ¿Ya tienes cuenta?
                  <router-link :to="loginTo" class="login-inline-link">
                    Iniciar sesión
                  </router-link>
                </p>

                <router-link
                  :to="{ name: 'home' }"
                  class="btn btn-outline-secondary w-100 mt-2 login-back"
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const route = useRoute()

const nombre = ref('')
const apellido = ref('')
const telefono = ref('')
const email = ref('')
const password = ref('')

const authLoading = computed(() => store.state.authLoading)
const authError = computed(() => store.state.authError)

const redirectNotice = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/')
})

const loginTo = computed(() => {
  const q = {}
  const r = route.query.redirect
  if (typeof r === 'string' && r.startsWith('/')) {
    q.redirect = r
  }
  return { name: 'login', query: q }
})

async function onSubmit () {
  const ok = await store.dispatch('register', {
    nombre: nombre.value,
    apellido: apellido.value,
    telefono: telefono.value,
    email: email.value.trim(),
    password: password.value
  })

  if (ok) {
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

.register-form .login-input {
  background-color: var(--app-success-surface);
}

.login-input:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.18);
}

.register-form .login-input::placeholder {
  font-size: 0.68rem;
  font-weight: 400;
  line-height: 1.35;
  color: #868e96;
  opacity: 1;
}

.register-form .login-input::-moz-placeholder {
  font-size: 0.68rem;
  font-weight: 400;
  line-height: 1.35;
  color: #868e96;
  opacity: 1;
}

.register-form .login-input:-ms-input-placeholder {
  font-size: 0.68rem;
  font-weight: 400;
  color: #868e96;
}

.password-rules {
  line-height: 1.45;
}

.login-inline-link {
  font-weight: 600;
  color: #198754;
  text-decoration: none;
}

.login-inline-link:hover,
.login-inline-link:focus-visible {
  color: #146c43;
  text-decoration: underline;
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

@media (max-width: 576px) {
  .login-main {
    padding: 1.25rem 0 2rem;
    align-items: flex-start;
  }
}
</style>
