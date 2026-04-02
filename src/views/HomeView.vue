<template>
  <div class="home-page min-vh-100 overflow-x-hidden">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark home-nav">
      <div class="container-fluid px-2 px-sm-3">
        <a
          id="inicio"
          class="navbar-brand text-light fs-5 fs-md-4 fs-lg-3 mb-0 text-truncate text-uppercase home-nav-brand"
        >
          Playas soñadas de América
        </a>

        <button
          class="navbar-toggler flex-shrink-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#homeNavbar"
          aria-controls="homeNavbar"
          aria-expanded="false"
          aria-label="Alternar navegación"
        >
          <span class="navbar-toggler-icon" />
        </button>

        <div id="homeNavbar" class="collapse navbar-collapse flex-lg-grow-1">
          <div
            class="d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center w-100 gap-3 mt-3 mt-lg-0 ms-lg-2 py-lg-1 pb-3 pb-lg-0"
          >
            <div class="d-none d-lg-block flex-lg-grow-1" aria-hidden="true" />
            <div
              class="d-flex flex-wrap align-items-center gap-2 justify-content-center flex-shrink-0 ms-0 ms-sm-2 ms-lg-5 ps-lg-2 ps-xl-4"
            >
              <label class="text-light small mb-0 text-nowrap" for="escala-temp-home">Escala</label>
              <select
                id="escala-temp-home"
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
              <template v-if="isAuthenticated">
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
              </template>
              <template v-else>
                <router-link
                  :to="{ name: 'register' }"
                  class="btn btn-outline-success btn-sm flex-shrink-0"
                >
                  Registrarse
                </router-link>
                <router-link
                  :to="{ name: 'login' }"
                  class="btn btn-success btn-sm flex-shrink-0"
                >
                  Entrar
                </router-link>
              </template>
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
        <strong>Listo.</strong> Tu cuenta fue creada con éxito. Ya puedes ver el detalle de cada playa.
        <button
          type="button"
          class="btn-close"
          aria-label="Cerrar aviso"
          @click="dismissRegisterBanner"
        />
      </div>
    </div>

    <div
      v-if="weatherLoading"
      class="container-fluid px-2 px-sm-3 pt-2"
      role="status"
      aria-live="polite"
    >
      <div class="app-banner app-banner--info app-banner--inline-flex small mb-0">
        <span
          class="spinner-border spinner-border-sm text-primary"
          aria-hidden="true"
        />
        <span>Cargando datos del clima…</span>
      </div>
    </div>

    <div
      v-else-if="weatherError"
      class="container-fluid px-2 px-sm-3 pt-2"
    >
      <div class="app-banner app-banner--warn small mb-0" role="alert">
        {{ weatherError }}
      </div>
    </div>

    <div class="home pb-2">
      <section class="home-playas-section py-2 pb-3 pb-md-4">
        <PlayaGrid
          :playas="playas"
          :escala-temp="escalaTemp"
        />
      </section>

      <FooterFooter />
    </div>
  </div>
</template>

<script setup>
import FooterFooter from '../components/FooterFooter.vue'
import PlayaGrid from '../components/PlayaGrid.vue'
import playasData from '../data/playas.json'
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { coordsById } from '../data/coordsById'
import { fetchOpenMeteoForecast } from '../services/openMeteo'
import { mapWeatherCodeToEstadoIcon } from '../utils/weatherMapper'
import {
  FORECAST_STORAGE_KEY,
  FORECAST_CACHE_SCHEMA_VERSION
} from '../utils/forecastCacheConstants'

const FORECAST_DAYS = 8
const CACHE_TTL_MS = 30 * 60 * 1000

const playas = ref(playasData.map((p) => ({ ...p })))

const weatherLoading = ref(false)
const weatherError = ref(null)

const store = useStore()

const registerSuccessBanner = computed(
  () => store.state.flashAuthBanner === 'registered'
)

function dismissRegisterBanner () {
  store.commit('SET_FLASH_AUTH_BANNER', null)
}

const isAuthenticated = computed(() => store.getters.isAuthenticated)
const userLabel = computed(() => store.getters.userNavLabel)

const escalaTemp = computed({
  get: () => store.getters.tempScale,
  set: (v) => store.dispatch('updateTempScale', v)
})

async function onLogout () {
  await store.dispatch('logout')
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

function getClosestHourlyIndex (times, nowMs) {
  let bestIndex = 0
  let bestDiff = Number.POSITIVE_INFINITY

  for (let i = 0; i < times.length; i++) {
    const tMs = new Date(times[i]).getTime()
    if (Number.isNaN(tMs)) continue
    const diff = Math.abs(tMs - nowMs)
    if (diff < bestDiff) {
      bestDiff = diff
      bestIndex = i
    }
  }
  return bestIndex
}

function buildPronSemFromDaily (daily) {
  const pronSem = []
  if (!daily?.time || !daily?.temperature_2m_min || !daily?.temperature_2m_max || !daily?.weather_code) return pronSem

  for (let j = 0; j < 7; j++) {
    const idx = 1 + j
    if (idx >= daily.time.length) break

    const iso = daily.time[idx]
    const s = typeof iso === 'string' ? iso.slice(0, 10) : ''
    const parts = s.split('-').map((x) => parseInt(x, 10))
    const date = (parts.length === 3 && !parts.some((n) => Number.isNaN(n)))
      ? new Date(parts[0], parts[1] - 1, parts[2])
      : new Date(NaN)
    const dia = j === 0
      ? 'Mañana'
      : new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(date)

    const minC = daily.temperature_2m_min[idx]
    const maxC = daily.temperature_2m_max[idx]
    const code = daily.weather_code[idx]
    const { estado, icon } = mapWeatherCodeToEstadoIcon(code)

    pronSem.push({
      dia,
      min: Math.round(minC),
      max: Math.round(maxC),
      icon,
      estado
    })
  }

  return pronSem
}

onMounted(async () => {
  const cache = readForecastCache()
  const nowMs = Date.now()
  const cacheIsFresh = cache?.updatedAt && (nowMs - cache.updatedAt) < CACHE_TTL_MS

  const needsNetwork = playas.value.some((p) => {
    const coords = coordsById[p.id]
    if (!coords) return false
    const ce = cache?.byId?.[p.id]
    return !(ce && cacheIsFresh)
  })

  weatherError.value = null
  weatherLoading.value = needsNetwork

  const resultsById = {}
  let apiAttempts = 0
  let apiSuccess = 0
  let apiFail = 0

  try {
  await Promise.all(playas.value.map(async (playa) => {
    const coords = coordsById[playa.id]
    if (!coords) return

    const cachedEntry = cache?.byId?.[playa.id]
    if (cachedEntry && cacheIsFresh) {
      resultsById[playa.id] = cachedEntry
      return
    }

    apiAttempts++
    let data
    try {
      data = await fetchOpenMeteoForecast({
        latitude: coords.latitude,
        longitude: coords.longitude,
        forecastDays: FORECAST_DAYS
      })
    } catch {
      apiFail++
      if (cachedEntry) {
        resultsById[playa.id] = cachedEntry
      }
      return
    }

    const hourly = data?.hourly
    const daily = data?.daily
    if (!hourly || !daily) {
      apiFail++
      if (cachedEntry) resultsById[playa.id] = cachedEntry
      return
    }

    const times = hourly.time || []
    if (!times.length) {
      apiFail++
      if (cachedEntry) resultsById[playa.id] = cachedEntry
      return
    }

    const iNow = getClosestHourlyIndex(times, nowMs)
    const tempC = hourly.temperature_2m?.[iNow]
    const humPct = hourly.relative_humidity_2m?.[iNow]
    const codeNow = hourly.weather_code?.[iNow]

    if (typeof tempC !== 'number' || Number.isNaN(tempC)) {
      apiFail++
      if (cachedEntry) resultsById[playa.id] = cachedEntry
      return
    }
    if (typeof humPct !== 'number' || Number.isNaN(humPct)) {
      apiFail++
      if (cachedEntry) resultsById[playa.id] = cachedEntry
      return
    }

    const { estado, icon } = mapWeatherCodeToEstadoIcon(codeNow)

    const pronSem = buildPronSemFromDaily(daily)

    apiSuccess++
    resultsById[playa.id] = {
      current: {
        tempTextC: `🌡️ ${Math.round(tempC)}°C`,
        humText: `HR ${Math.round(humPct)}%`,
        estado,
        icon
      },
      pronSemC: pronSem
    }
  }))

  if (apiAttempts > 0) {
    if (apiSuccess === 0) {
      weatherError.value =
        'No se pudo consultar el clima (API). Comprueba tu conexión a internet o inténtalo más tarde.'
    } else if (apiFail > 0) {
      weatherError.value =
        'El clima de una o más playas no pudo cargarse. El resto muestra datos actualizados o en caché.'
    }
  }

  const nextCache = cache && typeof cache === 'object'
    ? cache
    : { updatedAt: nowMs, byId: {} }

  nextCache.updatedAt = nowMs
  nextCache.byId = nextCache.byId || {}
  nextCache.cacheVersion = FORECAST_CACHE_SCHEMA_VERSION

  for (const playa of playas.value) {
    const entry = resultsById[playa.id]
    if (!entry) continue

    playa.temp = entry.current.tempTextC
    playa.hum = entry.current.humText
    playa.estado = entry.current.estado
    playa['íconoEst'] = entry.current.icon
    playa.pronSem = entry.pronSemC

    nextCache.byId[playa.id] = entry
  }

  localStorage.setItem(FORECAST_STORAGE_KEY, JSON.stringify(nextCache))
  } finally {
    weatherLoading.value = false
  }
})

</script>

<style>
.home-playas-section {
  background-color: var(--app-success-surface);
}

.home-nav .home-nav-brand {
  -webkit-text-stroke: 1px var(--bs-success);
  paint-order: stroke fill;
}

@media (max-width: 991.98px) {
  .home-nav .home-nav-brand {
    max-width: calc(100vw - 4.5rem);
  }
}

@media (min-width: 992px) {
  .home-nav .home-nav-brand {
    max-width: none;
    white-space: normal;
  }
}
</style>
