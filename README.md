# Portafolio playas (Vue 3 + Firebase)

SPA que muestra playas de América con clima (Open-Meteo vía **Axios**), registro/inicio de sesión con **Firebase Auth**, perfil y **favoritos** guardados en **Cloud Firestore**.

## Stack

- **Vue 3** (Composition API / `<script setup>` en varias vistas)
- **Vue Router 4** con rutas públicas y protegidas
- **Vuex 4** (auth, preferencias de escala °C/°F, favoritos en tiempo real)
- **Bootstrap 5** + **Bootstrap Icons**
- **Firebase** (Auth + Firestore)
- **Open-Meteo** + **Axios** (`src/services/openMeteo.js`): pronóstico en vivo, caché en `localStorage` (~30 min)

## Requisitos

- **Node.js** (recomendado LTS) y **npm**
- Proyecto **Firebase** con:
  - Authentication → Email/contraseña habilitado
  - **Cloud Firestore** creado (puede requerir cuenta de facturación en Google Cloud)
  - Reglas de seguridad publicadas (`firestore.rules` o consola → Firestore → Reglas)

## Variables de entorno

Crea un archivo **`.env.local`** en la raíz (no se sube a git) con las claves de tu app web en Firebase:

```env
VUE_APP_FIREBASE_API_KEY=
VUE_APP_FIREBASE_AUTH_DOMAIN=
VUE_APP_FIREBASE_PROJECT_ID=
VUE_APP_FIREBASE_STORAGE_BUCKET=
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=
VUE_APP_FIREBASE_APP_ID=
```

Tras cambiarlas, reinicia `npm run serve`.

## Instalación y scripts

```bash
npm install
npm run serve    # desarrollo
npm run build    # compilación → /dist
npm run lint     # ESLint
```

**Reglas de Firestore** (con [Firebase CLI](https://firebase.google.com/docs/cli) tras `firebase login`):

```bash
npm run deploy:firestore-rules
```

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Home con rejilla de playas y clima |
| `/login` | Inicio de sesión (solo invitados) |
| `/register` | Registro (solo invitados) |
| `/forgot-password` | Recuperar contraseña (solo invitados) |
| `/detalle_playas/:id` | Detalle de una playa (requiere sesión) |
| `/mis-favoritos` | Favoritos del usuario (requiere sesión) |

## Funcionalidad destacada

- **Home**: selector °C / °F (persistente en `localStorage`); datos meteorológicos desde la **API Open-Meteo** (no solo el JSON estático). Mientras se obtiene el clima —cuando hace falta salir a red y no hay caché reciente— se muestra **«Cargando datos del clima…»** (spinner). Si la API falla, se muestra un **aviso** al usuario (fallo total o parcial); cuando hay caché anterior, puede usarse como respaldo.
- **Detalle**: pronóstico en carrusel; favorito con corazón (usuario autenticado).
- **Favoritos**: Firestore `users/{uid}/favorites/{playaId}` (nombre, país, imagen).
- Invitados no ven favoritos en las tarjetas del home.

### Comprobar carga y error del clima (manual)

- **Cargando**: ventana de incógnito o borrar en DevTools → *Application* → *Local Storage* la clave `forecastById_v1` (definida en `src/utils/forecastCacheConstants.js`), luego recargar el home: debería verse brevemente el aviso azul de carga.
- **Error**: con la misma base (sin caché fresca), en DevTools → *Red* activar **Sin conexión** y recargar: debería aparecer el aviso de error al no poder consultar la API.

## Estructura (resumida)

```
src/
  components/     # Tarjetas, footer, rejilla…
  data/             # playas.json, coordsById…
  firebase/         # Inicialización Firebase
  router/
  services/         # Open-Meteo
  store/            # Vuex
  views/
  utils/
```

## Licencia / uso

Proyecto académico. Ajusta si publicas con otra licencia.

---

## 👨‍💻 Autor

**[Paula Gajardo]** — *Estudiante de [Front End]*  
📧 paulagajardosch@gmail.com  
🐙 [PaulaG73](https://github.com/PaulaG73)

---

*Proyecto académico — [2026]*
