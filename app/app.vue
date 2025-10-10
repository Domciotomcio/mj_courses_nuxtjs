<script setup>
const user = useCurrentUser()
const colorMode = useColorMode()
import { pl } from '@nuxt/ui/locale'


//colorMode.value = computed(() => 'light')

</script>

<template>
  <UApp :locale="pl">
    <NuxtLayout>
  </NuxtLayout>
  </UApp>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>
