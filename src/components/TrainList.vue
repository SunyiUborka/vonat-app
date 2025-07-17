<script setup>
import { onMounted, ref } from 'vue';
import TrainItem from './TrainItem.vue';
import { useMavStore } from '@/stores/mav'
const mavStore = useMavStore()

const trains = ref([])
onMounted(async ()=>{
    await mavStore.fetchTrains() 
    trains.value = mavStore.getTrains
})

</script>

<template>
    <div class="text-white mb-4">Jelenlegi vonatok száma: {{ trains.length }}</div>
    <div class="flex flex-col border-4 rounded-lg border-neutral-700 z-1 overflow-hidden">
        <div class="grid grid-cols-6 bg-white text-black font-bold px-4 py-2 text-center">
            <div>Név</div>
            <div>Cél</div>
            <div>Késés</div>
            <div>Következő megálló</div>
            <div>Érkezés</div>
            <div>Indulás</div>
        </div>

        <TrainItem v-for="(item, index) in trains" :key="index" :data="item"  :class="[ index % 2 === 0 ? 'bg-gray-700 text-white' : 'bg-white text-black']"/>
    </div>
    
    
</template>
