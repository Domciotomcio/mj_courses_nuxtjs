<script setup>
defineProps({
    title: {
        type: String,
        default: 'Wszystkie kursy'
    },
    subtitle: {
        type: String,
        default: 'Misja Jonatan - Kursy online'
    }
})
</script>

<template>
    <div class="mx-auto text-center">
        <h1 class="font-bold text-3xl">{{ title }}</h1>
        <p class="text-gray-600">{{ subtitle }}</p>
    </div>
</template>

