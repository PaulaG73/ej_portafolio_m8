<template>
  <nav class ="navbar bg-dark">
  <div class="container-fluid">
    <a id="inicio" class="navbar-brand text-light fs-1">Playas soñadas de América</a>


<select class="btn btn-outline-success" v-model="escalaTemp">
<option value="°C">°C</option>
<option value="°F">°F</option>
</select>
</div>
</nav>
  <div class="home">
    
    <PlayaGrid :playas="playas" 
    :escalaTemp="escalaTemp"/>

    <FooterFooter/>

    
  </div>

</template>

<script setup>
import FooterFooter from '../components/FooterFooter.vue';
import PlayaGrid from '../components/PlayaGrid.vue';
import playasData from '../data/playas.json';
import { ref } from 'vue'


const playas = ref(playasData)
const escalaTemp =ref("°C")


</script>

<style>
.card-derechos{

  display: flex;
  justify-content: center;
  gap: 5px;
}



</style>