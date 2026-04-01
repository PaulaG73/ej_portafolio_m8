/**
 * Estadísticas sobre `pronSem`: valores en °C (como vienen de Open-Meteo / caché).
 * @param {Array<{ min?: number, max?: number }>} pronSem
 * @returns {null | {
 *   weekMinC: number,
 *   weekMaxC: number,
 *   avgWeeklyMeanC: number,
 *   dayCount: number
 * }}
 */
export function computeWeeklyStatsFromPronSem (pronSem) {
  if (!Array.isArray(pronSem) || pronSem.length === 0) return null

  const days = []

  for (const d of pronSem) {
    const min = Number(d?.min)
    const max = Number(d?.max)
    if (Number.isNaN(min) || Number.isNaN(max)) continue

    days.push({ min, max })
  }

  if (days.length === 0) return null

  const mins = days.map((x) => x.min)
  const maxs = days.map((x) => x.max)
  const dailyMeans = days.map((x) => (x.min + x.max) / 2)

  const weekMinC = Math.min(...mins)
  const weekMaxC = Math.max(...maxs)
  const avgWeeklyMeanC =
    dailyMeans.reduce((a, b) => a + b, 0) / dailyMeans.length

  return {
    weekMinC,
    weekMaxC,
    avgWeeklyMeanC,
    dayCount: days.length
  }
}
