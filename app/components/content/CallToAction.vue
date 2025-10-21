<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Gotowy, aby zacząć?',
  description: '',
  icon: 'i-lucide-arrow-down'
})
</script>

<template>
  <div class="mt-8 p-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-2xl">
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
          {{ title }}
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ description }}
        </p>
      </div>
      <UIcon 
        :name="icon" 
        class="w-6 h-6 text-primary-600 dark:text-primary-400" 
      />
    </div>
  </div>
</template>
