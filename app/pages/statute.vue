<script setup lang="ts">
definePageMeta({
  title: 'Regulamin'
})

// Pobieramy dane. 
// first() szuka pliku w katalogu 'content/statute.md'
const { data: statuteContent } = await useAsyncData('statute', () => 
  queryCollection('content').path('/statute').first()
)
</script>

<template>
  <UContainer class="py-8"> <ContentRenderer 
      v-if="statuteContent" 
      :value="statuteContent" 
      tag="article" 
      class="prose dark:prose-invert max-w-none" 
    />

    <div v-else class="text-center py-10">
      <p>Nie udało się załadować treści regulaminu.</p>
    </div>

  </UContainer>
</template>