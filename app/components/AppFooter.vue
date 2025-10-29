<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items: NavigationMenuItem[] = [
  {
    label: 'Figma Kit',
    to: 'https://go.nuxt.com/figma-ui',
    target: '_blank'
  },
  {
    label: 'Playground',
    to: 'https://stackblitz.com/edit/nuxt-ui',
    target: '_blank'
  },
  {
    label: 'Releases',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }
]
</script>

<template>
  <USeparator class="h-px" />
  <UFooter>
    <template #default>
      <p class="text-muted text-sm">Misja Jonatan, Copyright © {{ new Date().getFullYear() }}</p>
    </template>
  </UFooter>
</template>