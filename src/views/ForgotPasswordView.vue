<template>
  <div class="login-page">
    <nav class="login-nav navbar navbar-dark bg-dark border-bottom border-secondary shadow-sm">
      <div class="container-fluid px-3 px-md-4">
        <router-link
          class="navbar-brand text-light text-uppercase login-brand mb-0"
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
            <div class="card login-card border-0 shadow">
              <div class="card-body p-4 p-md-5">
                <h1 class="h4 mb-2 text-start login-title">Recuperar contraseña</h1>
                <p class="text-muted small mb-4 text-start login-lead">
                  Te enviaremos un correo con un enlace para elegir una contraseña nueva.
                </p>

                <div v-if="sent" class="mb-4 text-start">
                  <div
                    class="alert alert-success small mb-3 border-0 shadow-sm forgot-success"
                    role="status"
                  >
                    Si hay una cuenta asociada a ese email, recibirás un mensaje en unos minutos.
                    Revisa también la carpeta de spam.
                  </div>
                  <button
                    type="button"
                    class="btn btn-link btn-sm text-success text-decoration-none p-0 forgot-again"
                    @click="onSendAnother"
                  >
                    Enviar a otro email
                  </button>
                </div>

                <form v-else @submit.prevent="onSubmit" class="login-form">
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
                    {{ authLoading ? 'Enviando…' : 'Enviar enlace' }}
                  </button>
                </form>

                <router-link
                  :to="loginTo"
                  class="btn btn-outline-secondary w-100 mt-3 login-back"
                >
                  Volver a iniciar sesión
                </router-link>

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
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const route = useRoute()

const email = ref('')
const sent = ref(false)

const authLoading = computed(() => store.state.authLoading)
const authError = computed(() => store.state.authError)

const loginTo = computed(() => {
  const q = {}
  const r = route.query.redirect
  if (typeof r === 'string' && r.startsWith('/')) {
    q.redirect = r
  }
  return { name: 'login', query: q }
})

async function onSubmit () {
  sent.value = false
  const ok = await store.dispatch('sendPasswordReset', {
    email: email.value.trim()
  })
  if (ok) {
    sent.value = true
  }
}

function onSendAnother () {
  sent.value = false
  store.commit('SET_AUTH_ERROR', null)
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

.forgot-success {
  border-radius: 0.5rem;
  color: #0f5132;
  background: #d1e7dd;
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

.forgot-again {
  font-weight: 600;
}

@media (max-width: 576px) {
  .login-main {
    padding: 1.25rem 0 2rem;
    align-items: flex-start;
  }
}
</style>
