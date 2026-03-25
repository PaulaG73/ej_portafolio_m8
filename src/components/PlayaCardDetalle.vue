<template>
    <div class="card">
        <h6 class="card-title">{{ detalle.dia }}</h6>
        <p class="icon-temp"> 🌡️</p>
        <div class="container-temp">
            <p class="card-temp"> máx {{ detalle.max }}°C</p>
            <p class="card-temp"> mín {{ detalle.min }}°C</p>
        </div>
        <p class="card-temp"> prom {{ (detalle.min + detalle.max) / 2 }}°C</p>
        <div class="card-estado d-flex">
            <p>{{ detalle.icon }}</p>
            <h6 class="card-subtitle mb-2">{{ detalle.estado }}</h6>

        </div>
    </div>



</template>

<script setup>
import { defineProps } from "vue"
defineProps({
    detalle:
    {
        type: Object

    }

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