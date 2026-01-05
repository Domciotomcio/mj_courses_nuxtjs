<script setup lang="ts">
definePageMeta({
  title: 'Kontakt'
})
</script>

<template>
  <UContainer>
    <div class="max-w-7xl">
      <!-- Page Title -->
      <div class="mb-12">
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Masz pytania? Skontaktuj się
        </h1>
      </div>

      <!-- Contact and Organization Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Contact Card -->
        <UCard variant="soft">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 sm:p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <UIcon name="i-lucide-phone" class="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Kontakt
              </h2>
            </div>
          </template>

          <div class="space-y-6">
            <!-- Phone -->
            <div class="flex items-start gap-3 sm:gap-4">
              <UIcon name="i-lucide-phone" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 mt-1 shrink-0" />
              <div>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Telefon</p>
                <a 
                  href="tel:507011408" 
                  class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition"
                >
                  507 011 408
                </a>
              </div>
            </div>

            <!-- Email -->
            <div class="flex items-start gap-3 sm:gap-4 text-wrap">
              <UIcon name="i-lucide-mail" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 mt-1 shrink-0" />
              <div>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                <a 
                  href="mailto:charyzmatykon@gmail.com" 
                  class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition break-all text-wrap"
                >
                  charyzmatykon@gmail.com
                </a>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Organization Info Card -->
        <UCard variant="soft">
          <template #header>
            <div class="flex items-center gap-3">
              <div class="p-2 sm:p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                <UIcon name="i-lucide-users" class="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                Nasza Firma
              </h2>
            </div>
          </template>

          <div class="space-y-6">
            <!-- Organization Name -->
            <div class="flex items-start gap-3 sm:gap-4">
              <UIcon name="i-lucide-building-2" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 mt-1 shrink-0" />
              <div>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Organizacja</p>
                <p class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Fundacja Charyzmatykon
                </p>
              </div>
            </div>

            <!-- Address -->
            <div class="flex items-start gap-3 sm:gap-4">
              <UIcon name="i-lucide-map-pin" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 mt-1 shrink-0" />
              <div>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Adres</p>
                <p class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Szafranowa 7 | 51-311 Kiełczówek
                </p>
              </div>
            </div>

            <!-- Bank Account -->
            <div class="flex items-start gap-3 sm:gap-4">
              <UIcon name="i-lucide-credit-card" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 mt-1 shrink-0" />
              <div>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1">Numer konta</p>
                <p class="text-base sm:text-lg font-mono font-semibold text-gray-900 dark:text-gray-100 break-all">
                  PKO SA 19 1240 6768 1111 0010 6551 8752
                </p>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>
