<template>
  <router-view/>
</template>

<style>
/* Superficie muy clara en la gama Bootstrap success (tinte, no el verde pleno). */
:root {
  --app-success-surface: color-mix(in srgb, var(--bs-success) 16%, white 84%);
  /* Success un poco apagado (iconos de clima en círculo) */
  --app-success-soft: color-mix(in srgb, var(--bs-success) 68%, white 32%);
  --app-font-family: 'Fredoka', system-ui, sans-serif;
  /* Reboot y componentes Bootstrap heredan la misma familia. */
  --bs-body-font-family: var(--app-font-family);
  --bs-font-sans-serif: var(--app-font-family);
}

html {
  scroll-behavior: smooth;
  font-family: var(--app-font-family);
}

body {
  font-family: var(--app-font-family);
}

#app {
  font-family: var(--app-font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* Navbar y footer (Bootstrap puede fijar otra fuente en el body). */
#app :is(.navbar, .footer) {
  font-family: var(--app-font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Letter-spacing como el título del pie (.footer-kicker). */
#app .home-nav .navbar-brand.home-nav-brand {
  letter-spacing: 0.06em;
}

/* Flecha “Ir al Home” (formularios auth + Mis favoritos) */
.login-nav-home-link {
  line-height: 1;
}

.login-nav-home-icon {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
}

.login-nav-home-link:hover,
.login-nav-home-link:focus-visible {
  color: #d2f4e8 !important;
}

/* Icono de clima (emoji) en círculo: fondo success suave, sin borde */
.clima-estado-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.125rem;
  height: 2.125rem;
  border-radius: 50%;
  border: none;
  background: var(--app-success-soft);
  line-height: 1;
  flex-shrink: 0;
  box-sizing: border-box;
}

.clima-estado-icon-inner {
  font-size: 1.12rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
