<template>
    <div class="col-12 col md-4 col-lg-3">
         <div class="card mt-4" id="p1">
        
       <img :src="playa.img" class="card-img-top card-img-fixed"/>
        
        <div class="card-body">
            <h5 class="card-title fw-bold fs-7">{{ playa.name1 }} <img :src="playa.flag" height="20px"></h5>

            <div class="card__temp__hum">
                <p>{{ cambiotemperatura }}</p> /
                <p>{{ playa.hum }}</p>
            </div>
            <div class="card__estado">
                
                <p>{{ playa.íconoEst }}</p>
                <p>{{ playa.estado }}</p>
            </div>
            <router-link class="btn btn-dark" :to="`/detalle_playas/${playa.id}`">Ver detalle</router-link>
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
return prop.escalaTemp=='°C'? prop.playa.temp : `🌡️${Math.ceil((parseInt(prop.playa.temp.match(/\d+/)[0]) *9/5) +32)}°F` 


})

</script>

<style scoped>



.card-img-fixed{

    height: 200px;
    object-fit: cover;
}
.card__estado {
    display: flex;
    justify-content: center;
    gap: 5px;
}

.card__temp__hum {

    display: flex;
    justify-content: center;
    gap: 20px;
}
</style>