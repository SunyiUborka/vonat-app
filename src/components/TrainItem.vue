<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    data:{
        require: true
    }
})

</script>
<template>
    <div class="min-w-full px-4">
        <div class="grid grid-cols-6">
            <div class="font-bold border-b border-gray-300 pb-2 flex items-center justify-center">{{ props.data.trip.tripShortName }}</div>
            <div class="font-bold border-b border-gray-300 pb-2 flex items-center justify-center">b</div>
            <div class="font-bold border-b border-gray-300 pb-2 flex items-center justify-center">c</div>
            <div class="font-bold border-b border-gray-300 pb-2 flex items-center justify-center">d</div>
            <div class="font-bold border-b border-gray-300 pb-2 flex items-center justify-center">e</div>
            <div class="font-bold border-b border-gray-300 pb-2 flex items-center justify-center">f</div>
        </div>
    </div>
</template>