<script setup lang="ts">
interface Props {
  item: { id?: number | string; title?: string; label?: string; description?: string; content?: string; date?: string | number | Date | { seconds: number; nanoseconds: number } }
}

const props = defineProps<Props>()
</script>

<template>
  <div class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed break-words">
    <p>{{ props.item?.description || props.item?.content }}</p>
  </div>
</template>

