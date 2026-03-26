<template>
    <div class="card">
        <h6 class="card-title">{{ detalle.dia }}</h6>
        <p class="icon-temp"> 🌡️</p>
        <div class="container-temp">
            <p class="card-temp"> máx {{ maxDisplay }}{{ unidad }}</p>
            <p class="card-temp"> mín {{ minDisplay }}{{ unidad }}</p>
        </div>
        <p class="card-temp"> prom {{ promDisplay }}{{ unidad }}</p>
        <div class="card-estado d-flex">
            <p>{{ detalle.icon }}</p>
            <h6 class="card-subtitle mb-2">{{ detalle.estado }}</h6>

        </div>
    </div>



</template>

<script setup>
import { computed, defineProps, ref } from 'vue'

const props = defineProps({
  detalle: {
    type: Object,
    required: true
  }
})

// Evita destructuring (eslint: vue/no-setup-props-destructure).
// En template, Vue desenvuelve refs automáticamente.
const detalle = computed(() => props.detalle)

const escalaTemp = ref(localStorage.getItem('escalaTemp') || '°C')

const unidad = computed(() => (escalaTemp.value === '°F' ? '°F' : '°C'))

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
.card {
    margin: 15px;
    padding: 5px;
    border-radius: solid;
    border-color: black;
    border-radius: 1px;
    width: 120px;
    height: 170px;
    color: black;
}

.card-title {
    font-weight: bold;
}

.container-temp{

    display: flex;
    font-size: x-small;
    justify-content: space-around;


}
.card-temp{
    font-size: x-small;
}
.card-estado{
  justify-content: space-around;
}
.card-subtitle{
margin-top: 2px;
    font-size: x-small;
    font-weight: bold;
}
</style>
