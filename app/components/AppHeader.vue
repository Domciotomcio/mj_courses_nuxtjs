<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { signOut } from 'firebase/auth'

const toast = useToast()
const user = useCurrentUser()
const route = useRoute()
const auth = useFirebaseAuth()!
const userId = user.value?.uid || '1'

const navigationMenuItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Wszystkie kursy',
    to: '/courses',
    active: route.path.startsWith('/courses'),

  },
  {
    label: 'Moje kursy',
    to: `/users/${userId}/courses`,
    active: route.path.startsWith(`/users/${userId}/courses`),
  },
])

import type { DropdownMenuItem } from '@nuxt/ui'

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: user.value?.email || 'User email',
      avatar: {
        src: 'https://github.com/benjamincanac.png'
      },
      type: 'label'
    }
  ],
  [
    {
      label: 'Płatności',
      icon: 'i-lucide-credit-card'
    },
    {
      label: 'Ustawienia',
      icon: 'i-lucide-cog'
    },
  ],
  [
    {
      label: 'Wyloguj się',
      icon: 'i-lucide-log-out',
      onSelect: () => {
        logout()
      }
    }
  ]
])

function logout() {
  signOut(auth)
  navigateTo('/courses')
  toast.add({ title: 'Sukces', description: 'Wylogowano pomyślnie' })

}
</script>

<template>
  <UHeader>
    <template #title>
      <img src="/jonatan-logo.png" alt="Logo" class="h-12 w-32 mr-2" />
    </template>

    <UNavigationMenu :items="navigationMenuItems" />

    <template #right>
      <div>
        <template v-if="user === undefined">
          <div class="flex items-center gap-4">
            <USkeleton class="h-3 w-[100px]" />
          </div>
        </template>
        <template v-else-if="user">
          <UDropdownMenu :items="items" :ui="{
            content: 'w-48'
          }">
            <UAvatar icon="i-lucide-user" size="md" class="ml-2" />
          </UDropdownMenu>
        </template>
        <template v-else>
          <UButton to="/login" color="primary" variant="outline">
            Zaloguj się
          </UButton>
        </template>
      </div>

    </template>

  </UHeader>
</template>