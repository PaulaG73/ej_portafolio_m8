# Portafolio playas (Vue 3 + Firebase)

SPA que muestra playas de América con clima en vivo (**Open-Meteo** vía **Axios**), registro e inicio de sesión con **Firebase Auth**, recuperación de contraseña y **favoritos** sincronizados con **Cloud Firestore**.

## Stack

- **Vue 3** (Composition API / `<script setup>` en vistas y componentes clave)
- **Vue Router 4** — rutas públicas (`guestOnly`) y protegidas (`requiresAuth`); redirección con `?redirect=` tras login
- **Vuex 4** — sesión, escala °C/°F persistente, listener de favoritos, alternar favorito por playa
- **Bootstrap 5** + **Bootstrap Icons**
- **Estilos de avisos propios** — `src/styles/app-alerts.css` (import en `main.js`): bloques tipo banner (`app-banner`) y alertas meteorológicas (`app-weather-alert`), alineados con el verde del proyecto
- **Firebase** (Auth + Firestore)
- **Open-Meteo** + **Axios** (`src/services/openMeteo.js`) — pronóstico actualizado; caché en `localStorage` (TTL ~30 min, clave y versión en `src/utils/forecastCacheConstants.js`)

## Requisitos

- **Node.js** (recomendado LTS) y **npm**
- Proyecto **Firebase** con:
  - **Authentication** → correo/contraseña habilitado
  - **Cloud Firestore** creado (puede requerir facturación en Google Cloud)
  - **Reglas** publicadas (`firestore.rules` en la raíz o consola → Firestore → Reglas)

## Variables de entorno

Crea **`.env.local`** en la raíz (no debe subirse a git) con las claves de la app web de Firebase:

```env
VUE_APP_FIREBASE_API_KEY=
VUE_APP_FIREBASE_AUTH_DOMAIN=
VUE_APP_FIREBASE_PROJECT_ID=
VUE_APP_FIREBASE_STORAGE_BUCKET=
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=
VUE_APP_FIREBASE_APP_ID=
```

Tras modificarlas, reinicia `npm run serve`.

## Instalación y scripts

```bash
npm install
npm run serve    # desarrollo
npm run build    # compilación → /dist
npm run lint     # ESLint
```

**Reglas de Firestore** (con [Firebase CLI](https://firebase.google.com/docs/cli) tras `firebase login` y proyecto vinculado):

```bash
npm run deploy:firestore-rules
```

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Home: rejilla de playas y datos de clima |
| `/login` | Inicio de sesión (solo invitados) |
| `/register` | Registro con validación de contraseña (`src/utils/registerPassword.js`) (solo invitados) |
| `/forgot-password` | Enlace de recuperación por email (solo invitados) |
| `/detalle_playas/:id` | Detalle de una playa (**requiere sesión**) |
| `/mis-favoritos` | Listado de favoritos (**requiere sesión**) |

## Funcionalidad destacada

### Home

- Título de marca **«Playas soñadas de América»** en la barra: contorno fino color success (`-webkit-text-stroke`) sobre fondo oscuro.
- Selector **°C / °F** (Vuex + `localStorage`) dentro de la barra colapsable (misma lógica que el detalle).
- Datos meteorológicos desde **Open-Meteo** cuando no hay caché válida: mensaje **«Cargando datos del clima…»** con spinner (`app-banner--info`). Si la petición falla, aviso tipo advertencia (`app-banner--warn`). Si existe caché anterior, puede usarse como respaldo.
- **Reglas meteorológicas** (`src/utils/weatherAlertRules.js`) en cada tarjeta: si en la semana se cumplen criterios de **ola de calor** o **semana lluviosa**, se muestra un aviso compacto con icono (`app-weather-alert`).
- Invitados no ven el botón de corazón / favoritos en las tarjetas.

### Detalle de playa

- Barra **navbar-expand-lg** alineada con el patrón del home (selector de escala, Mis favoritos, usuario, Salir).
- Carrusel de pronóstico diario; corazón para añadir o quitar **favorito** (misma colección Firestore que el home).
- **Alerta de reglas** bajo el carrusel cuando corresponda (misma prioridad que en tarjeta: si aplica ola de calor y semana lluviosa, se prioriza ola de calor).
- **Resumen semanal** (`src/utils/weeklyWeatherStats.js`): temperatura **mínima** y **máxima** de la semana según los días mostrados; **promedio semanal** (media de las medias diarias (mín+máx)/2); en °C el promedio se muestra con **techo** (`Math.ceil`). En vista no móvil el bloque tiene ancho máximo acotado (~`28rem`) y centrado.
- Escala °C/°F coherente con el resto de la app (incl. resumen).

### Reglas de alerta (implementación)

| Regla | Criterio (sobre `pronSem` en caché / API) |
|--------|-------------------------------------------|
| **Ola de calor** | Al menos **3 días seguidos** con máxima **≥ 30 °C** (mensaje con símbolo ≥). |
| **Semana lluviosa** | Al menos **4 días** cuyo texto de estado contiene **lluvia**, **llovizna** o **chubasco** (sin distinguir mayúsculas). |

Solo se muestra **una** alerta a la vez; si encajan ambas, gana la de ola de calor.

### Favoritos

- Firestore: colección **`users/{uid}/favorites/{playaId}`** — cada documento con datos útiles para listar (nombre, país, miniatura, etc.).
- **Mis favoritos**: lista desde el listener Vuex; barra con botón **Home** a la derecha (junto a usuario y Salir), sin marca duplicada a la izquierda.
- Reglas: solo el usuario autenticado puede leer/escribir su documento de usuario y subcolección `favorites` (ver `firestore.rules`).

### Flujo de auth

- Tras **registro** correcto puede mostrarse un aviso de bienvenida (banner flash) en home o detalle según redirección.
- Errores de login/registro se limpian al navegar entre vistas de auth.

## Comprobar carga y error del clima (manual)

1. **Cargando**: ventana de incógnito o borrar en DevTools → *Application* → *Local Storage* la clave **`forecastById_v1`**, luego recargar el home → debería verse el banner de carga.
2. **Error**: sin caché fresca, en DevTools → *Red* activar **Sin conexión** y recargar → debería mostrarse el banner de error.

## Estructura (resumida)

```
src/
  components/          # PlayaCard, PlayaCardDetalle, rejilla, footer…
  data/                  # playas.json, coordsById.js…
  firebase/              # Inicialización Firebase
  router/
  services/              # Open-Meteo (Axios)
  store/                 # Vuex (auth, favoritos, escala)
  styles/
    app-alerts.css       # app-banner, app-weather-alert
  views/                 # Home, Detalle, Login, Register, ForgotPassword, MisFavoritos
  utils/
    forecastCacheConstants.js  # clave y versión de caché de pronóstico
    weatherAlertRules.js       # alertas ola de calor / lluvia
    weatherMapper.js           # mapeo API → UI
    weeklyWeatherStats.js      # stats para resumen semanal en detalle
    registerPassword.js        # reglas de contraseña en registro
```

## Licencia / uso

Proyecto académico. Ajusta si publicas con otra licencia.

---

## Autor

**Paula Gajardo** — *Estudiante de Front End*  
📧 paulagajardosch@gmail.com  
🐙 [PaulaG73](https://github.com/PaulaG73)

---

*Proyecto académico — 2026*
