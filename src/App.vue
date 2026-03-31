<template>
  <router-view/>
</template>

<style>
/* Superficie muy clara en la gama Bootstrap success (tinte, no el verde pleno). */
:root {
  --app-success-surface: color-mix(in srgb, var(--bs-success) 16%, white 84%);
}

html {
  scroll-behavior: smooth;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

/* Misma pila tipográfica en navbar y footer (Bootstrap puede usar otra fuente en el body). */
#app :is(.navbar, .footer) {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Letter-spacing como el título del pie (.footer-kicker). */
#app .home-nav .navbar-brand.home-nav-brand,
#app .login-nav .navbar-brand.login-brand {
  letter-spacing: 0.06em;
}
</style>
