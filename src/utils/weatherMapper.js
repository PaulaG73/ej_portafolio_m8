// Mapeo desde `weather_code` de Open-Meteo (WMO) hacia el texto + ícono que usa tu UI.
export function mapWeatherCodeToEstadoIcon (code) {
  const c = Number(code)

  // Código no válido: fallback
  if (Number.isNaN(c)) {
    return { estado: 'Estado no disponible', icon: '🌡️' }
  }

  switch (c) {
    // Cielo despejado / nubes
    case 0:
      return { estado: 'Soleado', icon: '☀️' }
    case 1:
      return { estado: 'Mayormente despejado', icon: '🌤️' }
    case 2:
      return { estado: 'Parcialmente nublado', icon: '🌤️' }
    case 3:
      return { estado: 'Nublado', icon: '☁️' }

    // Neblina
    case 45:
      return { estado: 'Niebla', icon: '🌫️' }
    case 48:
      return { estado: 'Niebla helada', icon: '🌫️' }

    // Llovizna
    case 51:
      return { estado: 'Llovizna ligera', icon: '🌦️' }
    case 53:
      return { estado: 'Llovizna moderada', icon: '🌦️' }
    case 55:
      return { estado: 'Llovizna intensa', icon: '🌧️' }
    case 56:
      return { estado: 'Llovizna helada', icon: '🌧️❄️' }
    case 57:
      return { estado: 'Llovizna helada intensa', icon: '🌧️❄️' }

    // Lluvia
    case 61:
      return { estado: 'Lluvia débil', icon: '🌧️' }
    case 63:
      return { estado: 'Lluvia moderada', icon: '🌧️' }
    case 65:
      return { estado: 'Lluvia intensa', icon: '🌧️' }
    case 66:
      return { estado: 'Lluvia helada', icon: '🌧️❄️' }
    case 67:
      return { estado: 'Lluvia helada intensa', icon: '🌧️❄️' }

    // Nieve
    case 71:
      return { estado: 'Nieve ligera', icon: '❄️' }
    case 73:
      return { estado: 'Nieve moderada', icon: '❄️' }
    case 75:
      return { estado: 'Nieve intensa', icon: '❄️' }
    case 77:
      return { estado: 'Granos de nieve', icon: '🌨️' }

    // Chubascos de lluvia
    case 80:
      return { estado: 'Chubascos de lluvia', icon: '🌦️' }
    case 81:
      return { estado: 'Chubascos moderados', icon: '🌧️' }
    case 82:
      return { estado: 'Chubascos intensos', icon: '🌧️' }

    // Chubascos de nieve
    case 85:
      return { estado: 'Chubascos de nieve ligera', icon: '❄️' }
    case 86:
      return { estado: 'Chubascos de nieve intensa', icon: '🌨️' }

    // Tormentas
    case 95:
      return { estado: 'Tormenta', icon: '⛈️' }
    case 96:
      return { estado: 'Tormenta con granizo ligero', icon: '⛈️' }
    case 99:
      return { estado: 'Tormenta con granizo intenso', icon: '⛈️' }

    default:
      return { estado: 'Estado no disponible', icon: '🌡️' }
  }
}

