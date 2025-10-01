<script setup>
const user = useCurrentUser()
const colorMode = useColorMode()

colorMode.value = computed(() => 'light')
</script>

<template>
  <UApp>
    <NuxtLayout>
  </NuxtLayout>
  </UApp>
</template>
