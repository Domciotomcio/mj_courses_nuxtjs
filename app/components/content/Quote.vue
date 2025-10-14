<script setup lang="ts">
interface Props {
  author?: string
  role?: string
}

const props = defineProps<Props>()
</script>

<template>
  <blockquote class="my-8 relative">
    <div class="absolute -top-4 -left-4 text-6xl text-primary-200 dark:text-primary-800 opacity-50 leading-none">
      "
    </div>
    <div class="relative bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-l-4 border-primary-500">
      <p class="text-gray-700 dark:text-gray-300 italic text-lg mb-3">
        <slot />
      </p>
      <footer v-if="author" class="text-sm text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2">
        <UIcon name="i-lucide-user" class="w-4 h-4" />
        <span>{{ author }}</span>
        <span v-if="role" class="text-gray-500 dark:text-gray-500">· {{ role }}</span>
      </footer>
    </div>
  </blockquote>
</template>
