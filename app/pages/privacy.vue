<script setup lang="ts">
definePageMeta({
  title: 'Polityka prywatności'
})

// Pobieramy dane. 
// first() szuka pliku w katalogu 'content/privacy.md'
const { data: privacyContent } = await useAsyncData('privacy', () => 
  queryCollection('content').path('/privacy').first()
)
</script>

<template>
  <UContainer class="py-8"> <ContentRenderer 
      v-if="privacyContent" 
      :value="privacyContent" 
      tag="article" 
      class="prose dark:prose-invert max-w-none" 
    />

    <div v-else class="text-center py-10">
      <p>Nie udało się załadować treści polityki prywatności.</p>
    </div>

  </UContainer>
</template>