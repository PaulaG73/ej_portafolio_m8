<template>

  <div class="card-detail bg-dark text-light min-vh-100 overflow-x-hidden">

    <nav class="navbar navbar-dark bg-dark border-bottom border-secondary shadow-sm detail-nav">
      <div class="container-fluid px-2 px-sm-3 py-2">
        <div class="d-flex flex-column flex-md-row align-items-stretch align-items-md-center w-100 gap-2 gap-md-3">
          <div class="d-flex justify-content-between align-items-center w-100 w-md-auto flex-shrink-0">
            <router-link
              class="text-light text-decoration-none small fw-semibold py-1"
              :to="{ name: 'home' }"
            >
              ← Inicio
            </router-link>
          </div>
          <div
            class="d-flex flex-md-grow-1 flex-wrap align-items-center gap-2 justify-content-center w-100 min-w-0 ms-md-3 ms-lg-4 ps-md-1 ps-lg-3"
          >
            <label class="text-light small mb-0 text-nowrap" for="escala-temp-detail">Escala</label>
            <select
              id="escala-temp-detail"
              class="form-select form-select-sm border-success text-success bg-dark flex-shrink-0"
              style="width: auto; min-width: 5rem"
              v-model="escalaTemp"
            >
              <option value="°C">°C</option>
              <option value="°F">°F</option>
            </select>
          </div>
          <div
            class="d-flex flex-wrap align-items-center gap-2 justify-content-center justify-content-md-end flex-shrink-0 ms-md-auto w-100 w-md-auto min-w-0"
          >
            <span class="text-white small mb-0 text-center text-md-end text-break">{{ userLabel }}</span>
            <button
              type="button"
              class="btn btn-outline-success btn-sm flex-shrink-0"
              @click="onLogout"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>

    <template v-if="playa">
      <div class="detail-top mt-3 mt-md-4 px-2 px-sm-3">

        <div>

          <h3 class="text-capitalize pt-2 pt-md-3 detail-title px-1">
            {{ playa.name2 }}
          </h3>

          <div class="row g-3 g-md-4 detail-content-row mx-0">
            <div class="col-12 col-xl-6 px-2 px-xl-0 detail-ipad-pro-pad">
              <img
                :src="playa.img"
                :alt="playa.name || playa.name2"
                class="img-fluid rounded detail-hero-img w-100"
              >
            </div>

            <div class="col-12 col-xl-6 px-2 px-xl-0 d-flex align-items-center detail-text-col detail-ipad-pro-pad">
              <p class="desc mb-0 w-100">{{ playa.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="pronSem px-2 px-sm-3">
        <div
          v-if="pronSem.length"
          :id="carouselId"
          class="carousel slide pronSem-carousel"
          data-bs-ride="false"
          data-bs-touch="true"
          data-bs-wrap="true"
        >
          <div class="carousel-inner">
            <div
              v-for="(slide, index) in pronSemSlides"
              :key="`slide-${index}`"
              class="carousel-item"
              :class="{ active: index === 0 }"
            >
              <div class="row g-2 g-md-3 px-1 px-md-0">
                <div
                  v-for="(dia, cardIdx) in slide"
                  :key="`${dia.dia}-${index}-${cardIdx}`"
                  :class="cardColClass"
                >
                  <div class="pronSem-item-wrap">
                    <PlayaCardDetalle :detalle="dia" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            v-if="pronSemSlides.length > 1"
            class="carousel-control-prev"
            type="button"
            :data-bs-target="`#${carouselId}`"
            data-bs-slide="prev"
          >
            <span class="carousel-control-prev-icon" aria-hidden="true" />
            <span class="visually-hidden">Anterior</span>
          </button>
          <button
            v-if="pronSemSlides.length > 1"
            class="carousel-control-next"
            type="button"
            :data-bs-target="`#${carouselId}`"
            data-bs-slide="next"
          >
            <span class="carousel-control-next-icon" aria-hidden="true" />
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>

      <div class="detail-footer-actions px-2 px-sm-3 pb-4 text-center">
        <router-link
          to="/"
          class="btn btn-outline-success btn-back-home"
        >
          Volver al inicio
        </router-link>
      </div>
    </template>

    <div v-else class="container px-3 py-5 text-center text-light">
      <p class="mb-3">No encontramos esta playa.</p>
      <router-link :to="{ name: 'home' }" class="btn btn-success">
        Ir al inicio
      </router-link>
    </div>
  </div>

</template>



<script setup>

import { ref, computed, onMounted, onBeforeUnmount } from "vue";

import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";

import Allplayas from "../data/playas.json";

import PlayaCardDetalle from "../components/PlayaCardDetalle.vue"







const playas = ref(Allplayas);

const route = useRoute();
const router = useRouter();
const store = useStore();

const userLabel = computed(() => store.getters.userName || store.getters.userEmail || "");

const escalaTemp = computed({
  get: () => store.getters.tempScale,
  set: (v) => store.dispatch("updateTempScale", v)
});

async function onLogout () {
  await store.dispatch("logout");
  router.push({ name: "home" });
}

const playa = computed(() => playas.value.find(playa => playa.id === route.params.id))

const FORECAST_KEY = 'forecastById_v1'

function readForecastCache () {
  try {
    const raw = localStorage.getItem(FORECAST_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.byId) parsed.byId = {}
    return parsed
  } catch {
    return null
  }
}

const pronSem = computed(() => {
  if (!playa.value) return []

  const cache = readForecastCache()
  const entry = cache?.byId?.[playa.value.id]
  if (entry?.pronSemC?.length) return entry.pronSemC

  // Fallback: si el usuario abre detalle directo sin pasar por Home
  return playa.value.pronSem || []
})

const carouselId = computed(() => `pronSemCarousel-${playa.value?.id || "default"}`)
const viewportWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1200)
const cardsPerSlide = computed(() => {
  const width = viewportWidth.value
  // iPad Pro: touch + rango de anchura (coincide con la media query de padding que ya usaste)
  const coarse =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches

  if (width < 768) return 1
  if (coarse && width >= 900 && width <= 1400) return 2
  if (width >= 1200) return 4
  return 3
})

const cardColClass = computed(() => {
  if (cardsPerSlide.value === 1) return 'col-12'
  if (cardsPerSlide.value === 2) return 'col-12 col-md-6'
  if (cardsPerSlide.value === 4) return 'col-12 col-md-6 col-xl-3'
  return 'col-12 col-md-4'
})

function handleResize () {
  viewportWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener("resize", handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize)
})

const pronSemSlides = computed(() => {
  const source = pronSem.value
  const total = source.length
  if (!total) return []

  const slides = []
  for (let start = 0; start < total; start++) {
    const window = []
    for (let offset = 0; offset < cardsPerSlide.value; offset++) {
      const idx = (start + offset) % total
      window.push(source[idx])
    }
    slides.push(window)
  }
  return slides
})


// Acá va la lógica del array del pronSem para el promedio de temperatura//





</script>



<style scoped>

.detail-hero-img {
  width: 100%;
  height: auto;
  min-height: 200px;
  max-height: 40vh;
  object-fit: cover;
  object-position: center;
}

.desc {
  margin-top: 0;
  text-align: start;
  overflow-wrap: anywhere;
  hyphens: auto;
  font-size: 0.88rem;
  line-height: 1.45;
}

@media (min-width: 768px) {
  .desc {
    text-align: justify;
    font-size: 0.85rem;
  }

  .detail-hero-img {
    max-height: 270px;
  }
}

.detail-top {
  width: min(100%, 1100px);
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}

.detail-title {
  text-align: left;
  line-height: 1.25;
  margin-bottom: 1.4rem;
}

.detail-content-row {
  max-width: 100%;
}

.detail-text-col {
  margin-top: 0.35rem;
}

/* iPad Pro: padding lateral bastante mayor sin cambiar tamaño de texto */
@media (pointer: coarse) and (min-width: 900px) and (max-width: 1400px) {
  .detail-ipad-pro-pad {
    padding-left: 2.25rem !important;
    padding-right: 2.25rem !important;
  }

  /* Concentrar foto y texto hacia el centro */
  .detail-hero-img {
    width: auto !important;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  .desc {
    width: auto !important; /* le gana a w-100 */
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Más aire vertical entre bloques principales en eje Y */
  .detail-top {
    margin-top: 2.5rem;
  }

  .detail-content-row {
    row-gap: 2rem;
  }

  .pronSem {
    margin-top: 2.25rem;
  }

  /* Mantener el tamaño visual de las tarjetas (como antes: 3 por slide) */
  .pronSem-carousel .carousel-item .row {
    justify-content: center;
    max-width: 680px;
    margin-left: auto;
    margin-right: auto;
  }

  .pronSem-item-wrap {
    max-width: 100%;
  }
}

.pronSem {
  margin: 1.5rem auto 0;
  max-width: 1100px;
  width: min(100%, 1100px);
}

.pronSem-carousel .carousel-inner {
  padding: 0 2.25rem;
}

.pronSem-item-wrap {
  max-width: 100%;
  margin: 0 auto;
}

.pronSem-carousel .carousel-control-prev,
.pronSem-carousel .carousel-control-next {
  width: 2rem;
  opacity: 0.9;
}

.card-detail {
  padding-bottom: 0.5rem;
}

.btn-back-home {
  display: block;
  width: 100%;
  margin-top: 1.75rem;
  max-width: 20rem;
}

@media (min-width: 576px) {
  .btn-back-home {
    display: inline-block;
    width: auto;
  }
}

@media (max-width: 767.98px) {
  .pronSem {
    margin-top: 1rem;
  }

  .pronSem-carousel .carousel-inner {
    padding: 0 1.8rem;
  }

  .pronSem-item-wrap {
    max-width: 100%;
  }

  .btn-back-home {
    margin-top: 0.75rem;
    max-width: none;
  }

  .detail-title {
    text-align: center;
  }
}

@media (min-width: 1200px) {
  .detail-text-col {
    margin-top: 0;
    padding-left: 1rem !important;
  }
}

@media (max-width: 380px) {
  .pronSem-carousel .carousel-inner {
    padding: 0 1.5rem;
  }
}

</style>

