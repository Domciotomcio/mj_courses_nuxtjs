<script setup lang="ts">
interface Feature {
  icon: string
  title: string
  description: string
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow' | 'pink'
}

interface Props {
  features?: Feature[]
}

const props = defineProps<Props>()

const colorClasses = {
  blue: {
    bg: 'bg-blue-100 dark:bg-blue-900',
    icon: 'text-blue-600 dark:text-blue-400'
  },
  green: {
    bg: 'bg-green-100 dark:bg-green-900',
    icon: 'text-green-600 dark:text-green-400'
  },
  purple: {
    bg: 'bg-purple-100 dark:bg-purple-900',
    icon: 'text-purple-600 dark:text-purple-400'
  },
  red: {
    bg: 'bg-red-100 dark:bg-red-900',
    icon: 'text-red-600 dark:text-red-400'
  },
  yellow: {
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    icon: 'text-yellow-600 dark:text-yellow-400'
  },
  pink: {
    bg: 'bg-pink-100 dark:bg-pink-900',
    icon: 'text-pink-600 dark:text-pink-400'
  }
}

// Default features if none provided
const defaultFeatures: Feature[] = [
  {
    icon: 'i-lucide-presentation',
    title: 'Spotkania na żywo',
    description: 'Rozmowy i refleksje w czasie rzeczywistym — z możliwością zadawania pytań i dzielenia się doświadczeniem',
    color: 'blue'
  },
  {
    icon: 'i-lucide-video',
    title: 'Materiały wideo',
    description: 'Nagrania wszystkich spotkań dostępne o każdej porze — wracaj do nich wtedy, gdy potrzebujesz',
    color: 'green'
  },
  {
    icon: 'i-lucide-infinity',
    title: 'Dożywotni dostęp',
    description: 'Po zakończeniu kursu zachowujesz pełen dostęp do wszystkich treści, by móc wracać do nich w swojej codziennej drodze wiary i rodzicielstwa',
    color: 'purple'
  },
  {
    icon: 'i-lucide-book-open',
    title: 'Książka w prezencie',
    description: 'Książka w prezencie',
    color: 'red'
  },
]

const displayFeatures = computed(() => props.features || defaultFeatures)
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 not-prose max-w-full">
    <UCard v-for="(feature, index) in displayFeatures" :key="index" class="min-w-0">
      <div class="flex flex-col items-center text-center p-4">
        <div 
          class="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          :class="colorClasses[feature.color || 'blue'].bg"
        >
          <UIcon 
            :name="feature.icon" 
            class="w-8 h-8"
            :class="colorClasses[feature.color || 'blue'].icon"
          />
        </div>
        <h4 class="font-bold text-gray-900 dark:text-gray-100 mb-2">
          {{ feature.title }}
        </h4>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          {{ feature.description }}
        </p>
      </div>
    </UCard>
  </div>
</template>
