<script setup>
import { useColorMode } from '#imports'

const colorMode = useColorMode()
</script>

<template>
  <UMain class="mx-4 sm:mx-8 md:mx-16 lg:mx-24 xl:mx-32 py-8">
  
    <!-- Orange Soft Glow (Light Mode) -->
    <Transition name="gradient-fade">
      <div
        v-if="colorMode.value === 'light'"
        key="light"
        class="fixed inset-0 z-0 pointer-events-none"
        :style="{
          backgroundImage: 'radial-gradient(circle at center, #FF7112, transparent)',
          opacity: 0.1,
          mixBlendMode: 'multiply'
        }"
      />
    </Transition>

    <!-- Midnight Ember (Dark Mode) -->
    <Transition name="gradient-fade">
      <div
        v-if="colorMode.value === 'dark'"
        key="dark"
        class="fixed inset-0 z-0 pointer-events-none"
        :style="{
          background: 'radial-gradient(ellipse at center, #3d2914 0%, #2a1810 30%, #1a0f0a 60%, #0d0806 100%)'
        }"
      />
    </Transition>

    <!-- Your Content/Components -->
    <div class="relative z-10">
      
        <UPage>
          <NuxtPage />
        </UPage>

    </div>

  </UMain>
</template>

<style scoped>
.gradient-fade-enter-active,
.gradient-fade-leave-active {
  transition: opacity 700ms ease-in-out;
}

.gradient-fade-enter-from,
.gradient-fade-leave-to {
  opacity: 0;
}

.gradient-fade-enter-to,
.gradient-fade-leave-from {
  opacity: 1;
}
</style>
