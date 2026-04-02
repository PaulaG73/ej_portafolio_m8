# Portafolio playas (Vue 3 + Firebase)

SPA que muestra playas de América con clima en vivo (**Open-Meteo** vía **Axios**), registro e inicio de sesión con **Firebase Auth**, recuperación de contraseña y **favoritos** sincronizados con **Cloud Firestore**.

## Stack

- **Vue 3** (Composition API / `<script setup>` en vistas y componentes clave)
- **Vue Router 4** — history mode; rutas públicas (`guestOnly`) y protegidas (`requiresAuth`); redirección con `?redirect=` tras login
- **Vuex 4** — sesión, escala °C/°F persistente, listener de favoritos, alternar favorito por playa
- **Bootstrap 5** + **Bootstrap Icons**
- **Estilos de avisos propios** — `src/styles/app-alerts.css` (import en `main.js`): `app-banner`, `app-weather-alert`
- **Firebase** (Auth + Firestore)
- **Open-Meteo** + **Axios** (`src/services/openMeteo.js`) — pronóstico; caché en `localStorage` (TTL ~30 min; clave y versión en `src/utils/forecastCacheConstants.js`)

## Requisitos

- **Node.js** (recomendado LTS) y **npm**
- Proyecto **Firebase** con:
  - **Authentication** → correo/contraseña habilitado
  - **Authentication** → **Settings** → **Authorized domains**: debe incluir el host donde se sirve la app (p. ej. `localhost`, dominio **Netlify** `*.netlify.app`, dominio propio). Necesario para enlaces de **recuperación de contraseña**.
  - **Cloud Firestore** (puede requerir facturación en Google Cloud)
  - **Reglas** publicadas: `firestore.rules` en la raíz (ver script `deploy:firestore-rules`)

## Variables de entorno

En la raíz del repo, **`.env.local`** (ignorado por git) con la app web de Firebase:

```env
VUE_APP_FIREBASE_API_KEY=
VUE_APP_FIREBASE_AUTH_DOMAIN=
VUE_APP_FIREBASE_PROJECT_ID=
VUE_APP_FIREBASE_STORAGE_BUCKET=
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=
VUE_APP_FIREBASE_APP_ID=
```

**Recuperación de contraseña** — si aparece `auth/unauthorized-continue-uri`, Firebase rechaza la URL de retorno del correo. Sin variable fija, se usa el **origen del navegador** al enviar el formulario (p. ej. IP local `192.168…` desde el móvil suele fallar).

- **Desarrollo** (`npm run serve`): opcional en `.env.local`: `VUE_APP_PASSWORD_RESET_CONTINUE_URL`. En código, `127.0.0.1` se normaliza a `localhost` al armar la URL por defecto.
- **Producción** (`npm run build`): conviene fijar la URL pública de login (mismo host que en *Authorized domains*):

```env
VUE_APP_PASSWORD_RESET_CONTINUE_URL=https://tu-sitio.netlify.app/login
```

(También válido: dominio Firebase Hosting, dominio propio, siempre con `https` y ruta `/login`.)

Plantilla: **`.env.production.example`**. Cópiala a **`.env.production`** o **`.env.production.local`** (este último está en `.gitignore`, como `.env.local`). Si el build lo hace **Netlify** (u otro CI), define las mismas variables `VUE_APP_*` en el panel del servicio.

Tras cambiar `.env.local`, reinicia `npm run serve`. Tras cambiar variables de producción, vuelve a ejecutar `npm run build` (o dispara un deploy con caché limpia en el hosting).

## Instalación y scripts

```bash
npm install
npm run serve                 # desarrollo
npm run build                 # salida en /dist
npm run lint                  # ESLint
npm run deploy:firestore-rules   # publicar reglas (Firebase CLI, proyecto vinculado)
```

## Despliegue (Netlify u hosting estático)

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Variables de entorno** en el panel: mismas `VUE_APP_*` que en local, incluida `VUE_APP_PASSWORD_RESET_CONTINUE_URL` con la URL real de `/login`.
- **SPA (Vue Router):** en `public/_redirects` hay la regla `/* /index.html 200` para que Netlify sirva `index.html` en rutas profundas (`/login`, `/detalle_playas/...`, etc.); el archivo se copia a `dist` al compilar.

El `firebase.json` del repo está orientado a **reglas de Firestore**; el front puede hospedarse donde prefieras (Netlify, Firebase Hosting, etc.).

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Home: rejilla de playas y datos de clima |
| `/login` | Inicio de sesión (solo invitados) |
| `/register` | Registro con validación (`src/utils/registerPassword.js`) (solo invitados) |
| `/forgot-password` | Recuperación por email (solo invitados) |
| `/detalle_playas/:id` | Detalle de una playa (**requiere sesión**) |
| `/mis-favoritos` | Favoritos (**requiere sesión**) |

## Funcionalidad destacada

### Home

- Marca **«Playas soñadas de América»** en la barra con contorno fino color success (`-webkit-text-stroke`).
- Selector **°C / °F** (Vuex + `localStorage`) en la barra colapsable.
- Clima desde **Open-Meteo** si no hay caché válida: banner de carga (`app-banner--info`); si falla la red, advertencia (`app-banner--warn`); caché anterior como respaldo.
- **Reglas meteorológicas** (`src/utils/weatherAlertRules.js`): si aplica ola de calor o semana lluviosa, un botón con icono de **alerta** abre un **modal**. En **detalle**, la misma lógica se muestra en bloque `app-weather-alert` bajo el carrusel.
- Invitados no ven el botón de favoritos en las tarjetas.

### Detalle de playa

- Navbar alineada con el home (escala, Mis favoritos, usuario, Salir).
- Carrusel de pronóstico diario; favorito con corazón.
- **Resumen semanal** (`src/utils/weeklyWeatherStats.js`): mín/máx de la semana y promedio; °C con techo en el promedio mostrado; bloque acotado en escritorio.
- Tras el resumen, botón para **volver arriba** con scroll suave (respetando `prefers-reduced-motion`).

### Reglas de alerta (implementación)

| Regla | Criterio (sobre `pronSem` en caché / API) |
|--------|-------------------------------------------|
| **Ola de calor** | Al menos **3 días seguidos** con máxima **≥ 30 °C**. |
| **Semana lluviosa** | Al menos **4 días** cuyo estado contiene **lluvia**, **llovizna** o **chubasco** (sin mayúsculas). |

Solo una alerta a la vez; si aplican ambas, gana **semana lluviosa**.

### Favoritos

- Firestore: **`users/{uid}/favorites/{playaId}`** con datos para listar.
- **Mis favoritos**: lista vía listener Vuex; barra con enlace al home (flecha) y Salir.
- Reglas en `firestore.rules`.

### Auth

- Tras **registro** puede mostrarse banner flash en home o detalle según redirección.
- Errores entre vistas de auth se limpian en el router.

## Comprobar carga y error del clima (manual)

1. **Cargando:** incógnito o borrar en DevTools → *Application* → *Local Storage* la clave **`forecastById_v1`**, recargar el home.
2. **Error:** sin caché fresca, *Red* en **Sin conexión** y recargar.

## Estructura (resumida)

```
public/
  _redirects              # SPA fallback (p. ej. Netlify)
src/
  components/             # PlayaCard, PlayaCardDetalle, PlayaGrid, FooterFooter…
  data/                   # playas.json, coordsById.js
  firebase/
  router/
  services/               # openMeteo.js
  store/
  styles/
    app-alerts.css
  views/
  utils/
    forecastCacheConstants.js
    weatherAlertRules.js
    weatherMapper.js
    weeklyWeatherStats.js
    registerPassword.js
firestore.rules
firebase.json             # despliegue de reglas Firestore
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
