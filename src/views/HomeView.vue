<template>
  <nav class ="navbar bg-dark">
  <div class="container-fluid">
    <a id="inicio" class="navbar-brand text-light fs-1">Playas soñadas de América</a>


<select class="btn btn-outline-success" v-model="escalaTemp">
<option value="°C">°C</option>
<option value="°F">°F</option>
</select>
</div>
</nav>
  <div class="home">

    <PlayaGrid :playas="playas"
    :escalaTemp="escalaTemp"/>

    <FooterFooter/>


  </div>

</template>

<script setup>
import FooterFooter from '../components/FooterFooter.vue';
import PlayaGrid from '../components/PlayaGrid.vue';
import playasData from '../data/playas.json';
import { ref, onMounted, watch } from 'vue'
import { coordsById } from '../data/coordsById'
import { fetchOpenMeteoForecast } from '../services/openMeteo'
import { mapWeatherCodeToEstadoIcon } from '../utils/weatherMapper'

const FORECAST_KEY = 'forecastById_v1'
// La UI espera `pronSem` con "Mañana" + 6 días = 7 items,
// así que pedimos 8 días para cubrir mañana..día+6 con margen.
const FORECAST_DAYS = 8
const CACHE_TTL_MS = 30 * 60 * 1000 // 30 min

const playas = ref(playasData.map((p) => ({ ...p })))

const escalaTemp = ref(localStorage.getItem('escalaTemp') || '°C')

watch(escalaTemp, (v) => {
  localStorage.setItem('escalaTemp', v)
})

function readForecastCache () {
  try {
    const raw = localStorage.getItem(FORECAST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
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

    const date = new Date(daily.time[idx])
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

  localStorage.setItem(FORECAST_KEY, JSON.stringify(nextCache))
})


</script>

<style>
.card-derechos{

  display: flex;
  justify-content: center;
  gap: 5px;
}



</style>
