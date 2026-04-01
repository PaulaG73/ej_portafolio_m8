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
        class="alert alert-success alert-dismissible text-start mb-0 py-2 small shadow-sm border-0"
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
import FooterFooter from '../components/FooterFooter.vue';
import PlayaGrid from '../components/PlayaGrid.vue';
import playasData from '../data/playas.json';
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { coordsById } from '../data/coordsById'
import { fetchOpenMeteoForecast } from '../services/openMeteo'
import { mapWeatherCodeToEstadoIcon } from '../utils/weatherMapper'
import {
  FORECAST_STORAGE_KEY,
  FORECAST_CACHE_SCHEMA_VERSION
} from '../utils/forecastCacheConstants'
// La UI espera `pronSem` con "Mañana" + 6 días = 7 items,
// así que pedimos 8 días para cubrir mañana..día+6 con margen.
const FORECAST_DAYS = 8
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 min

const playas = ref(playasData.map((p) => ({ ...p })))

const store = useStore()
const router = useRouter()

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
  router.push({ name: 'home' })
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

  // Queremos: Mañana + 6 días => índices 1..7 inclusive
  for (let j = 0; j < 7; j++) {
    const idx = 1 + j
    if (idx >= daily.time.length) break

    // Open-Meteo `daily.time` es "YYYY-MM-DD"; `new Date(iso)` en UTC desfasa el día de la semana.
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

  const resultsById = {}

  // 1) Para cada playa: o usamos caché, o pedimos a Open-Meteo.
  await Promise.all(playas.value.map(async (playa) => {
    const coords = coordsById[playa.id]
    if (!coords) return

    const cachedEntry = cache?.byId?.[playa.id]
    if (cachedEntry && cacheIsFresh) {
      resultsById[playa.id] = cachedEntry
      return
    }

    let data
    try {
      data = await fetchOpenMeteoForecast({
        latitude: coords.latitude,
        longitude: coords.longitude,
        forecastDays: FORECAST_DAYS
      })
    } catch {
      return
    }

    const hourly = data?.hourly
    const daily = data?.daily
    if (!hourly || !daily) return

    const times = hourly.time || []
    if (!times.length) return

    const iNow = getClosestHourlyIndex(times, nowMs)
    const tempC = hourly.temperature_2m?.[iNow]
    const humPct = hourly.relative_humidity_2m?.[iNow]
    const codeNow = hourly.weather_code?.[iNow]

    if (typeof tempC !== 'number' || Number.isNaN(tempC)) return
    if (typeof humPct !== 'number' || Number.isNaN(humPct)) return

    const { estado, icon } = mapWeatherCodeToEstadoIcon(codeNow)

    const pronSem = buildPronSemFromDaily(daily)

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

  // 2) Volcamos los resultados a `playas` (para que el grid se actualice) + guardamos caché.
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

    // También actualizamos por si el detalle llegara sin caché.
    playa.pronSem = entry.pronSemC

    nextCache.byId[playa.id] = entry
  }

  localStorage.setItem(FORECAST_STORAGE_KEY, JSON.stringify(nextCache))
})


</script>

<style>
.home-playas-section {
  background-color: var(--app-success-surface);
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
