<script setup lang="ts">
interface Props {
  title?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'i-lucide-check-circle'
})
</script>

<template>
  <div class="my-6">
    <h3 v-if="title" class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
      <UIcon :name="icon" class="w-6 h-6 text-primary-600" />
      {{ title }}
    </h3>
    <div class="check-list-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.check-list-content :deep(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.check-list-content :deep(li) {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: rgb(55 65 81);
  line-height: 1.5;
}

:deep(.dark) .check-list-content :deep(li) {
  color: rgb(209 213 219);
}

.check-list-content :deep(li::before) {
  content: '✓';
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
  color: rgb(22 163 74);
  font-weight: bold;
  font-size: 1rem;
}

:deep(.dark) .check-list-content :deep(li::before) {
  color: rgb(74 222 128);
}
</style>
