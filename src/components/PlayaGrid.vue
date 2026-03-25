<template>
    <div class="container">
        <div class="row"> 
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