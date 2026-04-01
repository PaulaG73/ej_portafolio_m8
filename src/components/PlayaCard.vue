<template>
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
      <div class="card home-playa-card flex-fill w-100 shadow-sm border border-success">
        <div class="position-relative">
          <img :src="playa.img" class="card-img-top card-img-fixed" :alt="playa.name1 || 'Playa'">
          <button
            v-if="isAuthenticated"
            type="button"
            class="btn playa-favorite-btn"
            :aria-label="cardFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
            :aria-pressed="cardFavorite"
            @click.stop="onToggleFavorite"
          >
            <i
              class="bi fs-5"
              :class="cardFavorite ? 'bi-heart-fill text-danger' : 'bi-heart text-white'"
              aria-hidden="true"
            />
          </button>
        </div>

        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold small text-break">
            {{ playa.name1 }}
            <img :src="playa.flag" height="20" class="align-text-top ms-1" alt="">
          </h5>

          <div class="card__temp__hum flex-wrap">
            <p class="mb-0 text-center">{{ cambiotemperatura }}</p>
            <span class="d-none d-sm-inline" aria-hidden="true">/</span>
            <p class="mb-0 text-center">{{ playa.hum }}</p>
          </div>
          <div class="card__estado flex-wrap">
            <span class="clima-estado-icon-wrap" aria-hidden="true">
              <span class="clima-estado-icon-inner">{{ playa.íconoEst }}</span>
            </span>
            <p class="mb-0 text-center text-break card-estado-text">{{ playa.estado }}</p>
          </div>

          <div class="playa-card-alert-slot">
            <button
              v-if="weatherRuleAlert"
              type="button"
              class="btn btn-sm playa-weather-popup-btn rounded-pill"
              :class="weatherRuleAlert.variant === 'danger' ? 'btn-outline-danger' : 'btn-outline-warning'"
              data-bs-toggle="modal"
              :data-bs-target="'#playaWeatherModal-' + playa.id"
              :aria-label="'Abrir alerta meteorológica: ' + weatherRuleAlert.message"
            >
              <i
                class="bi bi-exclamation-triangle-fill fs-5"
                :class="weatherRuleAlert.variant === 'danger' ? 'text-danger' : 'text-warning'"
                aria-hidden="true"
              />
            </button>
          </div>

          <router-link
            class="btn btn-outline-success btn-sm mt-auto align-self-center"
            :to="`/detalle_playas/${playa.id}`"
          >
            Ver detalle
          </router-link>
        </div>

        <Teleport to="body">
          <div
            v-if="weatherRuleAlert"
            :id="'playaWeatherModal-' + playa.id"
            class="modal fade"
            tabindex="-1"
            :aria-labelledby="'playaWeatherModalLabel-' + playa.id"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content border-success">
                <div
                  class="modal-header py-2"
                  :class="weatherRuleAlert.variant === 'danger' ? 'bg-danger bg-opacity-10' : 'app-meteo-modal-header--rain'"
                >
                  <h5
                    :id="'playaWeatherModalLabel-' + playa.id"
                    class="modal-title mb-0 text-dark"
                  >
                    Alerta meteorológica
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Cerrar"
                  />
                </div>
                <div class="modal-body text-start small text-dark">
                  {{ weatherRuleAlert.message }}
                </div>
              </div>
            </div>
          </div>
        </Teleport>
      </div>
    </div>

</template>

<script setup>

import { defineProps, computed } from 'vue'
import { useStore } from 'vuex'
import { getWeatherRuleAlert } from '../utils/weatherAlertRules'

const prop = defineProps({
    playa: {
        type: Object,
        required: true
    },

    escalaTemp: {

        type: String,
        default: "°C"
    }

})

const store = useStore()

const isAuthenticated = computed(() => store.getters.isAuthenticated)

const cardFavorite = computed(
  () => !!(prop.playa?.id && store.state.favoritesById[prop.playa.id])
)

const weatherRuleAlert = computed(() =>
  getWeatherRuleAlert(prop.playa?.pronSem)
)

function onToggleFavorite () {
  store.dispatch('toggleFavorite', prop.playa)
}

const cambiotemperatura = computed(() => {

  if (prop.escalaTemp === '°C') return prop.playa.temp

  const tempText = String(prop.playa.temp ?? '')
  const match = tempText.match(/-?\d+(\.\d+)?/)
  const c = match ? Number(match[0]) : NaN
  const f = Number.isFinite(c) ? Math.ceil((c * 9 / 5) + 32) : ''

  return `🌡️${f}°F`
})

</script>

<style scoped>

.home-playa-card.card {
  border-radius: 1rem;
  overflow: hidden;
  border-color: var(--bs-success);
}

.playa-favorite-btn {
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  z-index: 2;
  line-height: 1;
  padding: 0.2rem 0.45rem;
  border: none;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 999px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.playa-favorite-btn:hover {
  background: rgba(0, 0, 0, 0.55);
}

.playa-favorite-btn:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.card-img-fixed{

    height: 200px;
    object-fit: cover;
}
.card__estado {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.1rem;
    text-align: center;
    margin-bottom: 0.65rem;
}

.card-estado-text {
  font-size: 0.72rem;
  line-height: 1.3;
}

.card__temp__hum {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem 1rem;
}

.playa-card-alert-slot {
  min-height: 2.35rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.playa-weather-popup-btn {
  line-height: 1;
  padding: 0.28rem 0.55rem;
}

</style>