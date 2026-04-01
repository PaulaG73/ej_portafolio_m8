<template>
  <div class="favoritos-page min-vh-100 overflow-x-hidden bg-light">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark favoritos-nav">
      <div class="container-fluid px-2 px-sm-3">
        <router-link
          class="login-nav-home-link text-success text-decoration-none d-inline-flex align-items-center py-2 px-1"
          :to="{ name: 'home' }"
          aria-label="Ir al Home"
        >
          <i class="bi bi-arrow-left login-nav-home-icon" aria-hidden="true" />
        </router-link>
        <button
          class="navbar-toggler flex-shrink-0 ms-auto"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#favNavbar"
          aria-controls="favNavbar"
          aria-expanded="false"
          aria-label="Alternar navegación"
        >
          <span class="navbar-toggler-icon" />
        </button>
        <div id="favNavbar" class="collapse navbar-collapse">
          <div class="d-flex flex-wrap align-items-center gap-2 ms-lg-auto mt-3 mt-lg-0 py-2 py-lg-0 justify-content-lg-end w-100">
            <span class="text-white small mb-0 text-break">{{ userLabel }}</span>
            <button
              type="button"
              class="btn btn-outline-success btn-sm"
              @click="onLogout"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="container px-2 px-sm-3 py-4 pb-5">
      <h1 class="h4 fw-bold text-dark mb-1">
        Mis favoritos
      </h1>
      <p class="text-secondary small mb-4">
        Playas que marcaste con el corazón. Pulsa el corazón otra vez para quitarlas.
      </p>

      <div v-if="!items.length" class="app-banner app-banner--muted">
        Aún no tienes favoritos. Explora el home o una ficha de detalle y pulsa el corazón rojo.
      </div>

      <ul v-else class="list-group list-group-flush shadow-sm rounded-3 overflow-hidden border">
        <li
          v-for="item in items"
          :key="item.playaId"
          class="list-group-item d-flex flex-column flex-sm-row align-items-stretch gap-3 py-3 px-3"
        >
          <div class="flex-shrink-0 mx-auto mx-sm-0">
            <img
              :src="item.fotoThumbUrl || placeholderImg"
              :alt="item.nombrePlaya || 'Playa'"
              class="fav-thumb rounded-2 object-fit-cover bg-secondary bg-opacity-10"
              width="96"
              height="72"
            >
          </div>
          <div class="flex-grow-1 min-w-0 text-center text-sm-start">
            <p class="fw-semibold mb-1 text-break">
              {{ item.nombrePlaya || 'Playa' }}
            </p>
            <p class="small text-secondary mb-2 mb-sm-3">
              {{ item.pais || '—' }}
            </p>
            <div class="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-start">
              <router-link
                :to="{ name: 'detalle_playas', params: { id: item.playaId } }"
                class="btn btn-outline-success btn-sm"
              >
                Ver detalle
              </router-link>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger d-inline-flex align-items-center gap-1"
                @click="removeFavorite(item)"
              >
                <i class="bi bi-heart-fill" aria-hidden="true" />
                Quitar
              </button>
            </div>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const userLabel = computed(() => store.getters.userNavLabel)
const items = computed(() => store.getters.favoritesList)

const placeholderImg =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="72" viewBox="0 0 96 72"><rect fill="#e9ecef" width="96" height="72"/><text x="48" y="40" text-anchor="middle" fill="#adb5bd" font-size="10">Sin imagen</text></svg>'
  )

async function onLogout () {
  await store.dispatch('logout')
}

function removeFavorite (item) {
  store.dispatch('toggleFavorite', {
    id: item.playaId,
    name1: item.nombrePlaya,
    img: item.fotoThumbUrl,
    país: item.pais
  })
}
</script>

<style scoped>
.fav-thumb {
  width: 96px;
  height: 72px;
  object-fit: cover;
  display: block;
}
</style>
