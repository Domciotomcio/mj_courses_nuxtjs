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
  <u-card variant="soft">
    <h3 v-if="title" class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 shadow-lg">
      {{ title }}
    </h3>
    <div class="check-list-content">
      <slot />
    </div>
  </u-card>
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
  color: rgb(75 85 99); /* gray-600 text in light mode */
  line-height: 1.5;
}

.dark .check-list-content :deep(li) {
  color: rgb(209 213 219); /* gray-300 in dark mode */
}

.check-list-content :deep(li::before) {
  content: '';
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  /* Orange check-circle for light mode */
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23EA580C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9 12l2 2 4-4'/></svg>");
}

.dark .check-list-content :deep(li::before) {
  /* Lighter orange for dark mode */
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FB923C' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9 12l2 2 4-4'/></svg>");
}
</style>
