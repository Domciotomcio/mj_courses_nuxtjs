<script setup lang="ts">
interface Quote {
  text: string
  author?: string
}

interface Props {
  quotes?: Quote[]
}

const props = defineProps<Props>()

// Default quotes if none provided
const defaultQuotes: Quote[] = []

const displayQuotes = computed(() => props.quotes || defaultQuotes)
</script>

<template>
  <div class="my-8">
    <div v-if="displayQuotes.length === 0" class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded border border-yellow-200 dark:border-yellow-800">
      <p class="text-sm text-yellow-800 dark:text-yellow-200">No quotes provided.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose max-w-full">
      <blockquote 
        v-for="(quote, index) in displayQuotes" 
        :key="index" 
        class="relative min-w-0"
      >
        <div class="absolute -top-4 -left-4 text-6xl text-primary-200 dark:text-primary-800 opacity-50 leading-none">
          "
        </div>
        <div class="relative bg-gray-50/60 dark:bg-gray-800/60 backdrop-blur-md p-6 rounded-xl border-l-4 border-primary-500 h-full flex flex-col">
          <p class="text-gray-700 dark:text-gray-300 italic text-lg mb-3 flex-1">
            {{ quote.text }}
          </p>
          <footer v-if="quote.author" class="text-sm text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2 mt-auto">
            <UIcon name="i-lucide-user" class="w-4 h-4" />
            <span>{{ quote.author }}</span>
          </footer>
        </div>
      </blockquote>
    </div>
  </div>
</template>
