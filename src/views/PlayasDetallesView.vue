<template>

  <div class="card-detail min-vh-100 overflow-x-hidden">

    <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary shadow-sm detail-nav">
      <div class="container-fluid px-2 px-sm-3">
        <router-link
          class="navbar-brand text-success text-decoration-none d-inline-flex align-items-center gap-1 py-1 px-1 detail-nav-home-link mb-0"
          :to="{ name: 'home' }"
          aria-label="Ir al Home"
        >
          <i class="bi bi-arrow-left detail-nav-home-icon flex-shrink-0" aria-hidden="true" />
          <span class="detail-nav-home-text small fw-semibold">Ir al Home</span>
        </router-link>

        <button
          class="navbar-toggler flex-shrink-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#detailNavbar"
          aria-controls="detailNavbar"
          aria-expanded="false"
          aria-label="Alternar navegación"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <div id="detailNavbar" class="collapse navbar-collapse flex-lg-grow-1">
          <div
            class="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center w-100 gap-3 mt-3 mt-lg-0 ms-lg-2 py-lg-1 pb-3 pb-lg-0"
          >
            <div class="d-none d-lg-block flex-lg-grow-1" aria-hidden="true" />
            <div
              class="d-flex flex-wrap align-items-center gap-2 justify-content-center flex-shrink-0 ms-0 ms-sm-2 ms-lg-5 ps-lg-2 ps-xl-4"
            >
              <label class="text-light small mb-0 text-nowrap" for="escala-temp-detail">Escala</label>
              <select
                id="escala-temp-detail"
                class="form-select form-select-sm border-success text-success bg-dark flex-shrink-0"
                style="width: auto; min-width: 5rem"
                v-model="escalaTemp"
              >
                <option value="°C">°C</option>
                <option value="°F">°F</option>
              </select>
            </div>
            <div
              class="d-flex flex-wrap align-items-center gap-2 justify-content-center justify-content-lg-end flex-lg-grow-1 w-100 min-w-0 ms-lg-auto"
            >
              <router-link
                :to="{ name: 'mis-favoritos' }"
                class="btn btn-outline-success btn-sm flex-shrink-0"
              >
                Mis favoritos
              </router-link>
              <span class="text-white small mb-0 text-center text-lg-start text-break mw-100 px-1">{{ userLabel }}</span>
              <button
                type="button"
                class="btn btn-outline-success btn-sm flex-shrink-0"
                @click="onLogout"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div
      v-if="registerSuccessBanner"
      class="container-fluid px-2 px-sm-3 pt-3 register-success-wrap"
    >
      <div
        class="app-banner app-banner--success app-banner--dismissible small mb-0"
        role="status"
      >
        <strong>Listo.</strong> Tu cuenta fue creada con éxito. Ya puedes ver el detalle de esta playa.
        <button
          type="button"
          class="btn-close"
          aria-label="Cerrar aviso"
          @click="dismissRegisterBanner"
        />
      </div>
    </div>

    <template v-if="playa">
      <div class="detail-top mt-3 mt-md-4 px-2 px-sm-3">

        <div>

          <div class="d-flex align-items-start justify-content-between gap-2 flex-wrap pt-2 pt-md-3 px-1">
            <h3 class="text-capitalize detail-title mb-0 flex-grow-1">
              {{ playa.name2 }}
            </h3>
            <button
              type="button"
              class="btn btn-link p-1 detail-favorite-btn flex-shrink-0"
              :aria-label="detailFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
              :aria-pressed="detailFavorite"
              @click="onToggleFavoriteDetail"
            >
              <i
                class="bi fs-2"
                :class="detailFavorite ? 'bi-heart-fill text-danger' : 'bi-heart text-success'"
                aria-hidden="true"
              />
            </button>
          </div>

          <div class="row g-3 g-md-4 detail-content-row mx-0">
            <div class="col-12 col-xl-6 px-2 px-xl-0 detail-ipad-pro-pad">
              <img
                :src="playa.img"
                :alt="playa.name || playa.name2"
                class="img-fluid rounded detail-hero-img w-100"
              >
            </div>

            <div class="col-12 col-xl-6 px-2 px-xl-0 d-flex align-items-center detail-text-col detail-ipad-pro-pad">
              <p class="desc mb-0 w-100">{{ playa.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="pronSem px-2 px-sm-3">
        <div
          v-if="pronSem.length"
          :id="carouselId"
          class="carousel slide pronSem-carousel"
          data-bs-ride="false"
          data-bs-touch="true"
          data-bs-wrap="true"
        >
          <div class="carousel-inner">
            <div
              v-for="(slide, index) in pronSemSlides"
              :key="`slide-${index}`"
              class="carousel-item"
              :class="{ active: index === 0 }"
            >
              <div class="row g-2 g-md-3 px-1 px-md-0">
                <div
                  v-for="(dia, cardIdx) in slide"
                  :key="`${dia.dia}-${index}-${cardIdx}`"
                  :class="cardColClass"
                >
                  <div class="pronSem-item-wrap">
                    <PlayaCardDetalle :detalle="dia" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="pronSemSlides.length > 1"
            class="carousel-control-prev pronSem-carousel-control"
            type="button"
            :data-bs-target="`#${carouselId}`"
            data-bs-slide="prev"
          >
            <span class="pronSem-carousel-arrow text-success" aria-hidden="true">
              <i class="bi bi-chevron-left" />
            </span>
            <span class="visually-hidden">Anterior</span>
          </button>
          <button
            v-if="pronSemSlides.length > 1"
            class="carousel-control-next pronSem-carousel-control"
            type="button"
            :data-bs-target="`#${carouselId}`"
            data-bs-slide="next"
          >
            <span class="pronSem-carousel-arrow text-success" aria-hidden="true">
              <i class="bi bi-chevron-right" />
            </span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>

      <div
        v-if="weatherRuleAlertView"
        class="weather-rule-alert-wrap px-2 px-sm-3"
        role="alert"
      >
        <div
          class="app-weather-alert mb-0 small"
          :class="weatherRuleAlertView.variant === 'danger' ? 'app-weather-alert--heat' : 'app-weather-alert--wet'"
        >
          <i
            class="bi app-weather-alert__icon"
            :class="weatherRuleAlertView.variant === 'danger' ? 'bi-thermometer-half' : 'bi-cloud-rain'"
            aria-hidden="true"
          />
          <span class="app-weather-alert__text">{{ weatherRuleAlertView.message }}</span>
        </div>
      </div>

      <section
        v-if="weeklyStatsView"
        class="weekly-stats px-2 px-sm-3"
        aria-label="Estadísticas del pronóstico semanal"
      >
        <div class="weekly-stats-inner shadow-sm border border-success">
          <h2 class="weekly-stats-title h5 fw-bold text-black mb-2">
            Resumen semanal
          </h2>
          <p class="weekly-stats-sub small text-secondary mb-3 mb-md-4">
            Calculado con los {{ weeklyStatsView.dayCount }} días mostrados en el pronóstico
            (escala actual: {{ escalaTemp }}).
          </p>

          <div>
            <h3 class="weekly-stats-h6 h6 fw-semibold text-dark mb-2">
              Temperaturas
            </h3>
            <ul class="weekly-stats-list list-unstyled small mb-0 text-start">
              <li>
                <span class="weekly-stats-k">Mínimo de la semana</span>
                <span class="weekly-stats-v">{{ weeklyStatsView.weekMin }}</span>
              </li>
              <li>
                <span class="weekly-stats-k">Máximo de la semana</span>
                <span class="weekly-stats-v">{{ weeklyStatsView.weekMax }}</span>
              </li>
              <li>
                <span class="weekly-stats-k">Promedio semanal</span>
                <span class="weekly-stats-v">{{ weeklyStatsView.avgWeekly }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </template>

    <div v-else class="container px-3 py-5 text-center text-dark">
      <p class="mb-3">No encontramos esta playa.</p>
      <router-link :to="{ name: 'home' }" class="btn btn-success">
        Ir al inicio
      </router-link>
    </div>
  </div>

</template>

<script setup>

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Allplayas from '../data/playas.json'
import PlayaCardDetalle from '../components/PlayaCardDetalle.vue'
import {
  FORECAST_STORAGE_KEY,
  FORECAST_CACHE_SCHEMA_VERSION
} from '../utils/forecastCacheConstants'
import { computeWeeklyStatsFromPronSem } from '../utils/weeklyWeatherStats'
import { getWeatherRuleAlert } from '../utils/weatherAlertRules'

const playas = ref(Allplayas)

const route = useRoute()
const store = useStore()

const userLabel = computed(() => store.getters.userNavLabel)

const registerSuccessBanner = computed(
  () => store.state.flashAuthBanner === 'registered'
)

function dismissRegisterBanner () {
  store.commit('SET_FLASH_AUTH_BANNER', null)
}

const escalaTemp = computed({
  get: () => store.getters.tempScale,
  set: (v) => store.dispatch('updateTempScale', v)
})

async function onLogout () {
  await store.dispatch('logout')
}

const playa = computed(() => playas.value.find(playa => playa.id === route.params.id))

const detailFavorite = computed(
  () =>
    !!(playa.value?.id && store.state.favoritesById[playa.value.id])
)

function onToggleFavoriteDetail () {
  if (playa.value) store.dispatch('toggleFavorite', playa.value)
}

function readForecastCache () {
  try {
    const raw = localStorage.getItem(FORECAST_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (parsed.cacheVersion !== FORECAST_CACHE_SCHEMA_VERSION) {
      localStorage.removeItem(FORECAST_STORAGE_KEY)
      return null
    }
    if (!parsed.byId) parsed.byId = {}
    return parsed
  } catch {
    return null
  }
}

const pronSem = computed(() => {
  if (!playa.value) return []

  const cache = readForecastCache()
  const entry = cache?.byId?.[playa.value.id]
  if (entry?.pronSemC?.length) return entry.pronSemC

  return playa.value.pronSem || []
})

const carouselId = computed(() => `pronSemCarousel-${playa.value?.id || 'default'}`)
const viewportWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
const cardsPerSlide = computed(() => {
  const width = viewportWidth.value
  const coarse =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches

  if (width < 768) return 1
  if (coarse && width >= 900 && width <= 1400) return 2
  if (width >= 1200) return 4
  return 3
})

const cardColClass = computed(() => {
  if (cardsPerSlide.value === 1) return 'col-12'
  if (cardsPerSlide.value === 2) return 'col-12 col-md-6'
  if (cardsPerSlide.value === 4) return 'col-12 col-md-6 col-xl-3'
  return 'col-12 col-md-4'
})

function handleResize () {
  viewportWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

const pronSemSlides = computed(() => {
  const source = pronSem.value
  const total = source.length
  if (!total) return []

  const k = Math.max(1, cardsPerSlide.value)
  if (k >= total) {
    return [source.slice()]
  }

  const slides = []
  for (let start = 0; start <= total - k; start++) {
    slides.push(source.slice(start, start + k))
  }
  return slides
})

/** Misma conversión °C→°F que en PlayaCardDetalle (enteros con techo). */
function tempCtoFDisplay (c) {
  return Math.ceil((c * 9) / 5 + 32)
}

const weatherRuleAlertView = computed(() => getWeatherRuleAlert(pronSem.value))

const weeklyStatsView = computed(() => {
  const raw = computeWeeklyStatsFromPronSem(pronSem.value)
  if (!raw) return null
  const useF = store.getters.tempScale === '°F'
  const fmtPoint = (c) => {
    if (useF) return `${tempCtoFDisplay(c)} °F`
    return `${Math.round(c)} °C`
  }
  const fmtWeeklyAvg = (c) => {
    if (useF) return `${tempCtoFDisplay(c)} °F`
    return `${Math.ceil(c)} °C`
  }
  return {
    dayCount: raw.dayCount,
    weekMin: fmtPoint(raw.weekMinC),
    weekMax: fmtPoint(raw.weekMaxC),
    avgWeekly: fmtWeeklyAvg(raw.avgWeeklyMeanC)
  }
})

</script>

<style scoped>

.detail-favorite-btn {
  line-height: 1;
  text-decoration: none;
}

.detail-favorite-btn:hover .bi-heart.text-success {
  color: #157347 !important;
}

.detail-nav-home-link {
  line-height: 1;
}

/* Misma barra que home: evitar el tamaño grande por defecto de .navbar-brand */
.detail-nav .navbar-brand.detail-nav-home-link {
  font-size: 1rem;
  font-weight: inherit;
}

.detail-nav-home-link .detail-nav-home-icon {
  font-size: clamp(1.85rem, 5.5vw, 2.6rem);
}

/* Mismo criterio que .footer-home-text en FooterFooter.vue */
.detail-nav-home-text {
  display: inline-block;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: middle;
  line-height: 1.2;
  letter-spacing: 0.02em;
  transition:
    max-width 0.22s ease,
    opacity 0.18s ease;
}

.detail-nav-home-link:hover .detail-nav-home-text,
.detail-nav-home-link:focus-visible .detail-nav-home-text {
  max-width: 11rem;
  opacity: 1;
  text-decoration: underline;
}

@media (prefers-reduced-motion: reduce) {
  .detail-nav-home-text {
    transition: none;
  }
}

.detail-hero-img {
  width: 100%;
  height: auto;
  min-height: 200px;
  max-height: 40vh;
  object-fit: cover;
  object-position: center;
}

.desc {
  margin-top: 0;
  text-align: start;
  overflow-wrap: anywhere;
  hyphens: auto;
  font-size: 0.88rem;
  line-height: 1.45;
}

@media (min-width: 768px) {
  .desc {
    text-align: justify;
    font-size: 0.85rem;
  }

  .detail-hero-img {
    max-height: 270px;
  }
}

.detail-top {
  width: min(100%, 1100px);
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}

.detail-title {
  text-align: left;
  line-height: 1.25;
  margin-bottom: 1.4rem;
}

.detail-content-row {
  max-width: 100%;
}

.detail-text-col {
  margin-top: 0.35rem;
}

/* iPad Pro: padding lateral bastante mayor sin cambiar tamaño de texto */
@media (pointer: coarse) and (min-width: 900px) and (max-width: 1400px) {
  .detail-ipad-pro-pad {
    padding-left: 2.25rem !important;
    padding-right: 2.25rem !important;
  }

  /* Concentrar foto y texto hacia el centro */
  .detail-hero-img {
    width: auto !important;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  .desc {
    width: auto !important; /* le gana a w-100 */
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Más aire vertical entre bloques principales en eje Y */
  .detail-top {
    margin-top: 2.5rem;
  }

  .detail-content-row {
    row-gap: 2rem;
  }

  .pronSem {
    margin-top: 2.25rem;
  }

  .weather-rule-alert-wrap {
    margin-top: 1.75rem;
  }

  .weekly-stats {
    margin-top: 2.25rem;
    margin-bottom: 2.5rem;
  }

  /* Mantener el tamaño visual de las tarjetas (como antes: 3 por slide) */
  .pronSem-carousel .carousel-item .row {
    justify-content: center;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }

  .pronSem-item-wrap {
    max-width: 100%;
  }
}

.pronSem {
  margin: 1.5rem auto 0;
  max-width: 1100px;
  width: min(100%, 1100px);
}

/* Móvil (< sm): ancho completo con el padding del bloque. Desde sm: columna acotada y centrada. */
.weather-rule-alert-wrap {
  margin: 1rem auto 0;
  width: 100%;
}

.weekly-stats {
  margin: 1.75rem auto 2rem;
  width: 100%;
}

@media (min-width: 576px) {
  .weather-rule-alert-wrap {
    max-width: 36rem;
  }

  .weekly-stats {
    max-width: 28rem;
  }
}

.weekly-stats-inner {
  background: #fff;
  border-radius: 1.25rem;
  padding: 1rem 1.25rem 1.35rem;
  color: #2c3e50;
  border-color: var(--bs-success);
}

.weekly-stats-title {
  text-align: left;
  letter-spacing: 0.02em;
}

.weekly-stats-sub {
  text-align: left;
  line-height: 1.4;
}

.weekly-stats-list li {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.35rem 1rem;
  padding: 0.4rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
}

.weekly-stats-list li:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.weekly-stats-k {
  color: #495057;
}

.weekly-stats-v {
  font-weight: 600;
  color: #198754;
}

.pronSem-carousel .carousel-inner {
  padding: 0 2.25rem;
}

.pronSem-item-wrap {
  max-width: 100%;
  margin: 0 auto;
}

.pronSem-carousel .pronSem-carousel-control.carousel-control-prev,
.pronSem-carousel .pronSem-carousel-control.carousel-control-next {
  width: 2.75rem;
  opacity: 1;
  color: var(--bs-success);
}

.pronSem-carousel .pronSem-carousel-control:hover,
.pronSem-carousel .pronSem-carousel-control:focus {
  color: var(--bs-success);
  opacity: 1;
}

.pronSem-carousel .pronSem-carousel-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  line-height: 1;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.12));
}

.card-detail {
  padding-bottom: 0.5rem;
  background-color: var(--app-success-surface);
  color: #2c3e50;
}

@media (max-width: 767.98px) {
  .pronSem {
    margin-top: 1rem;
  }

  .pronSem-carousel .carousel-inner {
    padding: 0 1.8rem;
  }

  .pronSem-item-wrap {
    max-width: 100%;
  }

  .detail-title {
    text-align: center;
  }
}

@media (min-width: 1200px) {
  .detail-text-col {
    margin-top: 0;
    padding-left: 1rem !important;
  }
}

@media (max-width: 380px) {
  .pronSem-carousel .carousel-inner {
    padding: 0 1.5rem;
  }
}

</style>

