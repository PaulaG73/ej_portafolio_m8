<template>
    <div class="container px-2 px-sm-3 pt-2 pt-md-3 pb-4">
        <div class="row g-3 g-lg-4">
            <PlayaCard v-for="playa in playas" :key="playa.id" :playa="playa" 
           :escalaTemp="escalaTemp" />
        </div>
    </div>
</template>

<script setup>
import PlayaCard from './PlayaCard.vue';
import { defineProps } from 'vue';

defineProps({
    playas: {
        type: Array,
        required: true
    },

    escalaTemp: {

        type: String,
        default: "°C"
    }

})
</script>

<style scoped>

</style>