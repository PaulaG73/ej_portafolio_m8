<template>
  <router-view/>
</template>

<style>
:root {
  --app-success-surface: color-mix(in srgb, var(--bs-success) 16%, white 84%);
  --app-success-soft: color-mix(in srgb, var(--bs-success) 68%, white 32%);
  --app-font-family: 'Fredoka', system-ui, sans-serif;
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

#app :is(.navbar, .footer) {
  font-family: var(--app-font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app .home-nav .navbar-brand.home-nav-brand {
  letter-spacing: 0.06em;
}

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
