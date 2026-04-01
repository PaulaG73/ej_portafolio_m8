<template>
  <footer id="Footer" class="footer navbar-dark bg-dark border-top border-secondary shadow-sm mt-2">
    <div class="container-fluid px-2 px-sm-3 py-3 text-light">
      <div class="d-flex flex-column align-items-center">
        <p
          class="mb-2 mb-lg-3 fw-semibold small text-uppercase footer-kicker footer-agency-title text-center text-light"
        >
          Agencia de Turismo Vinóloga SpA
        </p>

        <span class="footer-wa-tooltip-wrap d-inline-flex mb-2 mb-lg-3">
          <a
            href="https://wa.me/56996450950"
            class="btn btn-outline-success rounded-circle p-2 footer-wa-btn d-inline-flex align-items-center justify-content-center"
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby="footer-wa-tip"
            aria-label="Consulta y cotiza. Abrir WhatsApp"
          >
            <i class="bi bi-whatsapp fs-4" aria-hidden="true" />
          </a>
          <span
            id="footer-wa-tip"
            class="footer-wa-tooltip"
            role="tooltip"
          >
            Consulta y cotiza!
          </span>
        </span>

        <div
          class="footer-bottom-row position-relative w-100 d-flex justify-content-center align-items-center"
        >
          <div
            class="footer-rights d-flex align-items-center justify-content-center gap-2 small text-light-emphasis px-4 px-sm-3 px-md-2 ps-5 ps-sm-5 ps-md-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-c-circle-fill flex-shrink-0"
              viewBox="0 0 16 16"
              aria-hidden="true"
            >
              <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.146 4.992c.961 0 1.641.633 1.729 1.512h1.295v-.088c-.094-1.518-1.348-2.572-3.03-2.572-2.068 0-3.269 1.377-3.269 3.638v1.073c0 2.267 1.178 3.603 3.27 3.603 1.675 0 2.93-1.02 3.029-2.467v-.093H9.875c-.088.832-.75 1.418-1.729 1.418-1.224 0-1.927-.891-1.927-2.461v-1.06c0-1.583.715-2.503 1.927-2.503"
              />
            </svg>
            <span>Todos los derechos reservados</span>
          </div>

          <a
            href="#inicio"
            class="footer-home-link text-success position-absolute top-50 translate-middle-y start-0 ps-1 ps-sm-2 text-decoration-none d-inline-flex align-items-center gap-1"
            aria-label="Ir al inicio de la página"
          >
            <i class="bi bi-house-door-fill fs-3 flex-shrink-0" aria-hidden="true" />
            <span class="footer-home-text small fw-semibold">Ir al inicio</span>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer-kicker {
  letter-spacing: 0.06em;
}

/* Mismo contorno success que el título del home en la NavBar */
.footer-agency-title {
  -webkit-text-stroke: 1px var(--bs-success);
  paint-order: stroke fill;
}

.footer-rights {
  opacity: 0.9;
}

.footer-wa-tooltip-wrap {
  position: relative;
}

.footer-wa-tooltip {
  position: absolute;
  top: 50%;
  left: calc(100% + 0.5rem);
  z-index: 10;
  padding: 0.4rem 0.75rem;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: #f8f9fa;
  text-align: center;
  white-space: nowrap;
  background: #212529;
  border: 1px solid #198754;
  border-radius: 0.5rem;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.35);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-50%) translateX(-0.35rem);
  transition:
    opacity 0.18s ease,
    transform 0.18s ease,
    visibility 0.18s ease;
}

/* Flecha hacia la izquierda (apunta al botón) */
.footer-wa-tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 100%;
  width: 0;
  height: 0;
  transform: translateY(-50%);
  border-style: solid;
  border-width: 7px 8px 7px 0;
  border-color: transparent #198754 transparent transparent;
}

.footer-wa-tooltip-wrap:hover .footer-wa-tooltip,
.footer-wa-tooltip-wrap:focus-within .footer-wa-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
}

.footer-wa-btn {
  width: 2.75rem;
  height: 2.75rem;
}

.footer-home-link {
  line-height: 1;
}

/* Texto solo al pasar el mouse o al enfocar con teclado (sigue en el DOM para lectores de pantalla). */
.footer-home-text {
  display: inline-block;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: middle;
  line-height: 1.2;
  letter-spacing: 0.02em;
  transition:
    max-width 0.22s ease,
    opacity 0.18s ease;
}

.footer-home-link:hover .footer-home-text,
.footer-home-link:focus-visible .footer-home-text {
  max-width: 11rem;
  opacity: 1;
  text-decoration: underline;
}

@media (prefers-reduced-motion: reduce) {
  .footer-home-text {
    transition: none;
  }
}
</style>
