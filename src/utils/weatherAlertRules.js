/** U+2265 MAYOR O IGUAL (tipográficamente > sobre =). */
const GTE_SYMBOL = '\u2265'

const HEAT_MAX_THRESHOLD_C = 30
const HEAT_CONSECUTIVE_DAYS = 3
const RAINY_MIN_DAYS = 4

function hasHeatWave (pronSem) {
  if (!Array.isArray(pronSem)) return false
  let streak = 0
  for (const d of pronSem) {
    const max = Number(d?.max)
    if (Number.isNaN(max)) {
      streak = 0
      continue
    }
    if (max >= HEAT_MAX_THRESHOLD_C) {
      streak++
      if (streak >= HEAT_CONSECUTIVE_DAYS) return true
    } else {
      streak = 0
    }
  }
  return false
}

function isRainRelatedEstado (estado) {
  const s = String(estado || '').toLowerCase()
  return (
    s.includes('lluvia') ||
    s.includes('llovizna') ||
    s.includes('chubasco')
  )
}

function hasRainyWeek (pronSem) {
  if (!Array.isArray(pronSem)) return false
  let count = 0
  for (const d of pronSem) {
    if (isRainRelatedEstado(d?.estado)) count++
  }
  return count >= RAINY_MIN_DAYS
}

/**
 * Una sola alerta. Si aplican ola de calor y semana lluviosa, prioriza ola de calor.
 * @param {Array<{ max?: number, estado?: string }>} pronSem
 * @returns { null | { message: string, variant: 'danger' | 'warning' } }
 */
export function getWeatherRuleAlert (pronSem) {
  if (hasHeatWave(pronSem)) {
    return {
      message: `Ola de calor: al menos ${HEAT_CONSECUTIVE_DAYS} días seguidos con máximas ${GTE_SYMBOL} ${HEAT_MAX_THRESHOLD_C} °C.`,
      variant: 'danger'
    }
  }
  if (hasRainyWeek(pronSem)) {
    return {
      message:
        'Semana lluviosa: al menos 4 días con lluvia, llovizna o chubascos.',
      variant: 'warning'
    }
  }
  return null
}
