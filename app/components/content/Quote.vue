<script setup lang="ts">
import { ref, onMounted, useSlots } from '#imports'

interface Quote {
  text: string
  author?: string
}

const slots = useSlots()
const quotes = ref<Quote[]>([])

onMounted(() => {
  // Extract text content from the default slot
  const slotContent = slots.default?.() || []
  let textContent = ''
  
  // Recursively extract text from VNodes
  const extractText = (nodes: any[]): string => {
    return nodes.map(node => {
      if (typeof node.children === 'string') {
        return node.children
      } else if (Array.isArray(node.children)) {
        return extractText(node.children)
      } else if (node.children && typeof node.children === 'object') {
        return extractText([node.children])
      }
      return ''
    }).join('')
  }
  
  textContent = extractText(slotContent).trim()
  
  // Split by lines starting with "-" to identify author lines
  const lines = textContent.split('\n').map(l => l.trim()).filter(l => l)
  
  let currentQuote: Quote | null = null
  
  for (const line of lines) {
    if (line.startsWith('- ')) {
      // This is an author line
      if (currentQuote) {
        quotes.value.push(currentQuote)
      }
      currentQuote = {
        text: '',
        author: line.substring(2).trim()
      }
    } else if (currentQuote) {
      // Add to current quote text
      currentQuote.text += (currentQuote.text ? ' ' : '') + line
    } else {
      // Start a new quote without author yet
      currentQuote = {
        text: line,
        author: undefined
      }
    }
  }
  
  // Push the last quote if exists
  if (currentQuote) {
    quotes.value.push(currentQuote)
  }
})
</script>

<template>
  <div class="my-8 space-y-6">
    <blockquote 
      v-for="(quote, index) in quotes" 
      :key="index" 
      class="relative"
    >
      <div class="absolute -top-4 -left-4 text-6xl text-primary-200 dark:text-primary-800 opacity-50 leading-none">
        "
      </div>
      <div class="relative bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-l-4 border-primary-500">
        <p class="text-gray-700 dark:text-gray-300 italic text-lg mb-3">
          {{ quote.text }}
        </p>
        <footer v-if="quote.author" class="text-sm text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2">
          <UIcon name="i-lucide-user" class="w-4 h-4" />
          <span>{{ quote.author }}</span>
        </footer>
      </div>
    </blockquote>
  </div>
</template>
