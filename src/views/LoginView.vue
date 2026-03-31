<template>
  <div class="login-page">
    <nav class="login-nav navbar navbar-dark bg-dark border-bottom border-secondary shadow-sm">
      <div class="container-fluid px-3 px-md-4">
        <router-link
          class="navbar-brand text-light login-brand mb-0"
          :to="{ name: 'home' }"
        >
          Playas soñadas de América
        </router-link>
      </div>
    </nav>

    <main class="login-main">
      <div class="container px-3 px-md-4">
        <div class="row justify-content-center">
          <div class="col-12 col-sm-11 col-md-8 col-lg-5 col-xl-4">
            <div
              v-if="redirectNotice"
              class="alert alert-info alert-login small mb-3 text-start border-0 shadow-sm"
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

                <form @submit.prevent="onSubmit" class="login-form">
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
                      placeholder="Tu contraseña"
                      autocomplete="current-password"
                    >
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
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')

const authLoading = computed(() => store.state.authLoading)
const authError = computed(() => store.state.authError)

const redirectNotice = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/')
})

async function onSubmit () {
  const ok = await store.dispatch('login', {
    email: email.value.trim(),
    password: password.value
  })

  if (ok) {
    const redirect = route.query.redirect
    if (typeof redirect === 'string' && redirect.startsWith('/')) {
      router.push(redirect)
    } else {
      router.push({ name: 'home' })
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #dfe8e5 0%, #f4f7f6 45%, #f8faf9 100%);
  color: #2c3e50;
}

.login-nav :deep(.navbar-brand) {
  font-weight: 600;
  letter-spacing: 0.02em;
}

.login-brand {
  font-size: clamp(1rem, 2.5vw, 1.35rem);
  text-decoration: none;
}

.login-brand:hover,
.login-brand:focus-visible {
  color: #d2f4e8 !important;
}

.login-main {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 2rem 0 3rem;
}

.login-card {
  border-radius: 0.75rem;
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
  border-radius: 0.5rem;
  border-color: #ced4da;
}

.login-input:focus {
  border-color: #198754;
  box-shadow: 0 0 0 0.2rem rgba(25, 135, 84, 0.18);
}

.alert-login {
  border-radius: 0.5rem;
  color: #055160;
  background: #cff4fc;
}

.login-error {
  padding: 0.35rem 0.5rem;
  border-radius: 0.375rem;
  background: rgba(220, 53, 69, 0.08);
}

.login-submit:disabled {
  opacity: 0.75;
}

.login-back {
  border-radius: 0.5rem;
}

@media (max-width: 576px) {
  .login-main {
    padding: 1.25rem 0 2rem;
    align-items: flex-start;
  }
}
</style>

