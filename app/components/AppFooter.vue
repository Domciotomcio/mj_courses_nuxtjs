
<script setup lang="ts">
import type { FooterColumn } from '@nuxt/ui'

const phoneNumber = '+48 123 456 789'

const columns: FooterColumn[] = [
  {
    label: 'Nawigacja',
    children: [
      { label: 'Wszystkie kursy', to: '/courses' },
      { label: 'Moje kursy', to: '/users/me/courses' },
      { label: 'Kontakt', to: '/contact' }
    ]
  },
  {
    label: 'Wsparcie',
    children: [
      { label: 'FAQ', to: '/faq' },
      { label: 'Polityka prywatności', to: '/privacy' },
      { label: 'Regulamin', to: '/terms' }
    ]
  }
]
</script>

<template>
  <USeparator color="neutral" size="sm" />
  <UFooter>
    <template #top>
      <UContainer>
        <div class="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8 relative">
          <!-- Logo & Contact -->
          <div class="flex flex-col gap-3 xl:w-1/4">
            <UColorModeImage 
              light="/jonatan-logo.png" 
              dark="/jonatan-logo-biale.png" 
              alt="Misja Jonatan" 
              class="h-10 object-contain object-left" 
            />
            <div>
              <p class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Kontakt</p>
              <a :href="`tel:${phoneNumber.replace(/\s/g, '')}`" class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition">
                <UIcon name="i-lucide-phone" class="w-4 h-4" />
                <span>{{ phoneNumber }}</span>
              </a>
            </div>
          </div>
          <!-- Navigation Columns -->
          <div class="flex-1 xl:flex xl:justify-center">
            <UFooterColumns :columns="columns" />
          </div>
          <!-- Social Media Icons -->
          <div class="flex gap-3 xl:w-auto xl:items-start">
            <a href="https://facebook.com/misjajonatan" target="_blank" rel="noopener" aria-label="Facebook" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <UIcon name="i-lucide-facebook" class="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-primary transition" />
            </a>
            <a href="mailto:kontakt@misjajonatan.pl" aria-label="Email" class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              <UIcon name="i-lucide-mail" class="w-5 h-5 text-gray-500 dark:text-gray-400 hover:text-primary transition" />
            </a>
          </div>
          <!-- Copyright - Bottom Right Corner -->
          <p class="absolute bottom-0 right-0 text-muted text-xs">Misja Jonatan © {{ new Date().getFullYear() }}</p>
        </div>
      </UContainer>
    </template>
  </UFooter>
</template>