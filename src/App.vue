<template>
  <router-view/>
</template>

<style>
/* Superficie muy clara en la gama Bootstrap success (tinte, no el verde pleno). */
:root {
  --app-success-surface: color-mix(in srgb, var(--bs-success) 16%, white 84%);
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
#app .home-nav .navbar-brand.home-nav-brand,
#app .login-nav .navbar-brand.login-brand {
  letter-spacing: 0.06em;
}
</style>
