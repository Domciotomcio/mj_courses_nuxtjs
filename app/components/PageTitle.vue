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
    <div class="mb-4 text-center pb-8">
        <h1 class="font-bold text-3xl">{{ title }}</h1>
        <p class="text-gray-600">{{ subtitle }}</p>
    </div>
</template>

