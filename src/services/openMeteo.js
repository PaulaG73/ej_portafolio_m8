import axios from 'axios'

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export async function fetchOpenMeteoForecast ({ latitude, longitude, forecastDays = 7 }) {
  const params = {
    latitude,
    longitude,
    hourly: 'temperature_2m,relative_humidity_2m,weather_code',
    daily: 'temperature_2m_min,temperature_2m_max,weather_code',
    timezone: 'auto',
    forecast_days: forecastDays
  }

  const { data } = await axios.get(OPEN_METEO_BASE_URL, { params })
  return data
}

