<template>
    <div class="detail-card">
        <h6 class="detail-card-title">{{ detalle.dia }}</h6>
        <p class="icon-temp"> 🌡️</p>
        <div class="container-temp">
            <p class="detail-card-temp"> máx {{ maxDisplay }}{{ unidad }}</p>
            <p class="detail-card-temp"> mín {{ minDisplay }}{{ unidad }}</p>
        </div>
        <p class="detail-card-temp detail-card-temp-prom"> prom {{ promDisplay }}{{ unidad }}</p>
        <div class="card-estado d-flex">
            <span class="clima-estado-icon-wrap" aria-hidden="true">
              <span class="clima-estado-icon-inner">{{ detalle.icon }}</span>
            </span>
            <h6 class="detail-card-subtitle">{{ detalle.estado }}</h6>
        </div>
    </div>



</template>

<script setup>
import { computed, defineProps } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
  detalle: {
    type: Object,
    required: true
  }
})

const store = useStore()

// Evita destructuring (eslint: vue/no-setup-props-destructure).
// En template, Vue desenvuelve refs automáticamente.
const detalle = computed(() => props.detalle)

const unidad = computed(() =>
  store.getters.tempScale === '°F' ? '°F' : '°C'
)

const toF = (c) => Math.ceil(c * 9 / 5 + 32)

const minDisplay = computed(() => {
  const minC = Number(detalle.value?.min)
  if (Number.isNaN(minC)) return ''
  return unidad.value === '°F' ? toF(minC) : minC
})

const maxDisplay = computed(() => {
  const maxC = Number(detalle.value?.max)
  if (Number.isNaN(maxC)) return ''
  return unidad.value === '°F' ? toF(maxC) : maxC
})

const promDisplay = computed(() => {
  const minC = Number(detalle.value?.min)
  const maxC = Number(detalle.value?.max)
  if (Number.isNaN(minC) || Number.isNaN(maxC)) return ''

  const promC = (minC + maxC) / 2
  return unidad.value === '°F' ? toF(promC) : promC
})




</script>

<style scoped>
.detail-card {
    margin: 0;
    padding: 0.5rem;
    width: 100%;
    min-height: 145px;
    height: auto;
    color: black;
    border: 1px solid var(--bs-success);
    border-radius: 1.25rem;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.detail-card-title {
    font-weight: bold;
    font-size: 0.85rem;
    margin: 0;
}

.container-temp{
    display: flex;
    font-size: 0.72rem;
    justify-content: space-around;
    gap: 0.35rem;
    margin: 0;
}

.icon-temp {
  margin: 0;
  line-height: 1;
}

.detail-card-temp{
    font-size: 0.72rem;
    margin: 0;
    text-align: justify;
}

.detail-card-temp-prom {
  text-align: center;
}
.card-estado{
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  text-align: center;
  margin-top: 0.25rem;
}

.card-estado p {
  margin: 0;
}

.detail-card-subtitle{
    margin: 0;
    font-size: 0.72rem;
    font-weight: bold;
    text-align: justify;
}

@media (max-width: 576px) {
  .detail-card {
    min-height: 135px;
    padding: 0.45rem;
  }
}
</style>
