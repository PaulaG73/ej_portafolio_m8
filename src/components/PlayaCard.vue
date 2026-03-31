<template>
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
      <div class="card home-playa-card flex-fill w-100 shadow-sm">
        <img :src="playa.img" class="card-img-top card-img-fixed" :alt="playa.name1 || 'Playa'">

        <div class="card-body d-flex flex-column">
          <h5 class="card-title fw-bold small text-break">
            {{ playa.name1 }}
            <img :src="playa.flag" height="20" class="align-text-top ms-1" alt="">
          </h5>

          <div class="card__temp__hum flex-wrap">
            <p class="mb-0 text-center">{{ cambiotemperatura }}</p>
            <span class="d-none d-sm-inline" aria-hidden="true">/</span>
            <p class="mb-0 text-center">{{ playa.hum }}</p>
          </div>
          <div class="card__estado flex-wrap">
            <p class="mb-0">{{ playa.íconoEst }}</p>
            <p class="mb-0 text-center text-break">{{ playa.estado }}</p>
          </div>
          <router-link
            class="btn btn-outline-success btn-sm mt-auto align-self-center"
            :to="`/detalle_playas/${playa.id}`"
          >
            Ver detalle
          </router-link>
        </div>
      </div>
    </div>
   
</template>

<script setup>


import { defineProps, computed } from 'vue';

const prop=defineProps({
    playa: {
        type: Object,
        required: true
    },

    escalaTemp: {

        type: String,
        default: "°C"
    }

})

const cambiotemperatura=computed(()=>{

  if (prop.escalaTemp === '°C') return prop.playa.temp

  const tempText = String(prop.playa.temp ?? '')
  const match = tempText.match(/-?\d+(\.\d+)?/)
  const c = match ? Number(match[0]) : NaN
  const f = Number.isFinite(c) ? Math.ceil((c * 9 / 5) + 32) : ''

  return `🌡️${f}°F`

})

</script>

<style scoped>

.home-playa-card {
  border-radius: 1rem;
  overflow: hidden;
}

.card-img-fixed{

    height: 200px;
    object-fit: cover;
}
.card__estado {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.1rem;
    text-align: center;
}

.card__temp__hum {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem 1rem;
}

</style>