<script setup lang="ts">
interface Props {
  price?: number
  courseId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  purchase: [courseId: string]
}>()

function handlePurchase() {
  emit('purchase', props.courseId)
}
</script>

<template>
  <div class="max-w-3xl ml-auto bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
    <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
      <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">Cena za kurs:</span>
      <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
        {{ price || 'Jeszcze nie ustalona' }} zł
      </span>
    </div>
    <div class="flex justify-end">
      <UButton 
        @click="handlePurchase" 
        size="xl"
        icon="i-lucide-shopping-cart"
        trailing
      >
        Zakup kurs
      </UButton>
    </div>
  </div>
</template>
