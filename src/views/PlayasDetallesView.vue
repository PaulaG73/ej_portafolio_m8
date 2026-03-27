<template>

    <div class="card-detail bg-dark text-light ">

        <div class="detail-top mt-4">

            <div>

                <h3 class="text-capitalize pt-4 detail-title">{{ playa.name2 }}</h3>



                <div class="row g-3 detail-content-row">

                    <div class="col-12 col-md-6">

                        <img :src="playa.img" :alt="playa.name" class="img-fluid rounded">

                    </div>



                    <div class="col-12 col-md-6">

                        <p class="desc">{{ playa.desc }}</p>



                    </div>



                </div>

            </div>

        </div>





        <div class="pronSem">

            <PlayaCardDetalle v-for="dia in pronSem" :detalle="dia" :key="dia.dia" />

        </div>



        <router-link to="/" class="btn btn-outline-success btn-back-home mb-2">Volver</router-link>

    </div>





</template>



<script setup>

import { ref, computed } from "vue";

import { useRoute } from "vue-router";

import Allplayas from "../data/playas.json";

import PlayaCardDetalle from "../components/PlayaCardDetalle.vue"







const playas = ref(Allplayas);

const route = useRoute();

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



// Acá va la lógica del array del pronSem para el promedio de temperatura//





</script>



<style scoped>

.img-fluid {
    height: 250px;
    width: 100%;
    object-fit: cover;
}



.desc {
    margin-top: 0;
    text-align: justify;
    font-size: small;
}

.detail-top {
  width: min(100%, 1100px);
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}

.detail-title {
  text-align: left;
}

.detail-content-row {
  margin: 0;
}

.pronSem {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
  margin: 0.5rem auto 0;
  padding: 0;
  max-width: 1100px;
  width: min(100%, 1100px);
}

.card-detail {
  padding-bottom: 0.5rem;
}

.btn-back-home {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .pronSem {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 0.25rem;
    gap: 0.4rem;
  }

  .btn-back-home {
    margin-top: 0.75rem;
  }

  .detail-title {
    text-align: center;
  }
}

@media (max-width: 380px) {
  .pronSem {
    grid-template-columns: 1fr;
  }
}

</style>

