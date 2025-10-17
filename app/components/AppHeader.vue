<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { signOut } from 'firebase/auth'

const toast = useToast()
const user = useCurrentUser()
const route = useRoute()
const auth = useFirebaseAuth()!

const userId = user.value?.uid || '1'

const dbUser = useUser(userId as string)

watchEffect(() => {
  if (user.value) {
    console.log('Current user in AppHeader:', user.value?.uid)
  }
})

const navigationMenuItems = computed<NavigationMenuItem[]>(() => {
  const items: NavigationMenuItem[] = [
    {
      label: 'Wszystkie kursy',
      to: '/courses',
      active: route.path.startsWith('/courses'),
    }
  ]
  
  // Only show "Moje kursy" if user is logged in
  if (user.value) {
    items.push({
      label: 'Moje kursy',
      to: `/users/${user.value.uid}/courses`,
      active: route.path.startsWith(`/users/${user.value.uid}/courses`),
    })
  }
  
  return items
})

import type { DropdownMenuItem } from '@nuxt/ui'

const items = computed<DropdownMenuItem[][]>(() => [
[
    {
      label: user.value?.email ? `Witaj, ${user.value.email}` : 'Witaj, Użytkownik',
      icon: 'i-lucide-user',
      to: `/users/${user.value?.uid}/courses`,
      active: route.path.startsWith(`/users/${user.value?.uid}/courses`),
    }
] , 
[
    {
      label: 'Płatności',
      icon: 'i-lucide-credit-card',
      to: `/users/${user.value?.uid}/payments`,
      active: route.path.startsWith(`/users/${user.value?.uid}/payments`),
    },
    {
      label: 'Ustawienia',
      icon: 'i-lucide-cog',
      to: `/users/${user.value?.uid}/settings`,
      active: route.path.startsWith(`/users/${user.value?.uid}/settings`),
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
      <UColorModeImage 
        light="/jonatan-logo.png" 
        dark="/jonatan-logo-biale.png" 
        alt="Logo" 
        class="h-12 w-32 mr-2" 
      />
    </template>

    <UNavigationMenu :items="navigationMenuItems" />

    <template #right>
      <div class="flex items-center gap-2">
        
        <template v-if="user === undefined">
          <div class="flex items-center gap-4">
            <USkeleton class="h-3 w-[100px]" />
          </div>
        </template>
        <template v-else-if="user">
          <UDropdownMenu :items="items" :ui="{
            content: 'w-48'
          }"
          >
            <UButton icon="i-lucide-user" variant="ghost" />
          </UDropdownMenu>
        </template>
        <template v-else>
          <div class="flex items-center gap-2">
            <UButton to="/login" color="neutral" variant="link">
              Zaloguj się
            </UButton>
            <UButton to="/register" color="primary" variant="solid" icon="i-lucide-user-plus">
              Zarejestruj się
            </UButton>
          </div>
        </template>
        <UColorModeButton  size="lg"/>
      </div>

    </template>

  </UHeader>
</template>