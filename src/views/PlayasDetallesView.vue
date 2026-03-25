<template>
    <div class="card-detail bg-dark text-light ">
        <div class="container mt-4 justify-content-around">
            <div>
                <h3 class="text-capitalize pt-4">{{ playa.name2 }}</h3>

                <div class="row">
                    <div class="col-md-6">
                        <img :src="playa.img" :alt="playa.name" class="img-fluid rounded">
                    </div>

                    <div class="col-md-6">
                        <p class="desc">{{ playa.desc }}</p>

                    </div>

                </div>
            </div>
        </div>


        <div class="pronSem d-flex justify-content-center flex-wrap">
            <PlayaCardDetalle v-for="dia in playa.pronSem" :detalle="dia" :key="dia.dia" />
        </div>

        <router-link to="/" class="btn btn-outline-success mb-2">Volver</router-link>
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

// Acá va la lógica del array del pronSem para el promedio de temperatura//


</script>

<style scoped>
.img-fluid {
    height: 250px;


}

.desc {

    margin-top: 40px;
    text-align: justify;
    font-size: small;

}
</style>