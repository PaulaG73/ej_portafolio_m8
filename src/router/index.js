import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'
import HomeView from '../views/HomeView.vue'
import DetallePlayas from '../views/PlayasDetallesView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ForgotPasswordView from '../views/ForgotPasswordView.vue'
import MisFavoritosView from '../views/MisFavoritosView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { guestOnly: true }
  },
  {
    path: '/forgot-password',
    name: 'forgot-password',
    component: ForgotPasswordView,
    meta: { guestOnly: true }
  },
  {
    path: '/detalle_playas/:id',
    name: 'detalle_playas',
    component: DetallePlayas,
    meta: { requiresAuth: true }
  },
  {
    path: '/mis-favoritos',
    name: 'mis-favoritos',
    component: MisFavoritosView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

const AUTH_FLOW_NAMES = new Set(['login', 'register', 'forgot-password'])

router.beforeEach((to, from) => {
  if (
    AUTH_FLOW_NAMES.has(to.name) &&
    from.name &&
    from.name !== to.name
  ) {
    store.commit('SET_AUTH_ERROR', null)
  }

  if (
    from.name &&
    AUTH_FLOW_NAMES.has(from.name) &&
    !AUTH_FLOW_NAMES.has(to.name)
  ) {
    store.commit('SET_AUTH_ERROR', null)
  }

  if (to.meta.requiresAuth && !store.getters.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && store.getters.isAuthenticated) {
    return { name: 'home' }
  }
  return true
})

export default router
