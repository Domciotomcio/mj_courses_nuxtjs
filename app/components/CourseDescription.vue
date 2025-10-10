<script setup lang="ts">
interface CourseSection {
  type: 'text' | 'list' | 'image' | 'quote' | 'highlight'
  content?: string
  items?: string[]
  imageUrl?: string
  imageAlt?: string
  author?: string
}

interface Props {
  description?: string
  imageName?: string
  sections?: CourseSection[]
}

const props = defineProps<Props>()

// Mock structured content for better presentation
const defaultSections: CourseSection[] = [
  {
    type: 'text',
    content: 'Ten kurs został stworzony z myślą o osobach, które chcą pogłębić swoją wiedzę i umiejętności w sposób praktyczny i przystępny.'
  },
  {
    type: 'list',
    content: 'Co zyskasz dzięki temu kursowi:',
    items: [
      'Praktyczną wiedzę, którą możesz zastosować od zaraz',
      'Dostęp do materiałów wideo w najwyższej jakości',
      'Możliwość zadawania pytań prowadzącemu',
      'Dostęp do społeczności uczestników',
      'Dożywotni dostęp do wszystkich materiałów'
    ]
  },
  {
    type: 'text',
    content: 'Każde spotkanie zostało starannie przygotowane, aby zapewnić Ci maksymalną wartość edukacyjną. Nasze materiały są regularnie aktualizowane, abyś zawsze miał dostęp do najbardziej aktualnych informacji.'
  },
  {
    type: 'quote',
    content: 'Ten kurs zmienił moje podejście do tematu. Polecam każdemu, kto chce się rozwijać!',
    author: 'Anna Kowalska, absolwentka kursu'
  },
  {
    type: 'list',
    content: 'Dla kogo jest ten kurs:',
    items: [
      'Początkujących, którzy chcą zdobyć solidne podstawy',
      'Osób z doświadczeniem pragnących usystematyzować wiedzę',
      'Profesjonalistów szukających nowych inspiracji',
      'Wszystkich, którzy chcą rozwijać swoje kompetencje'
    ]
  }
]

const displaySections = computed(() => {
  return props.sections || defaultSections
})
</script>

<template>
  <div class="course-description">
    <div class="flex flex-col lg:flex-row gap-8 items-start">
      <!-- Content Section -->
      <div class="lg:w-2/3 w-full space-y-6">
        <div v-for="(section, index) in displaySections" :key="index">
          <!-- Text Section -->
          <div v-if="section.type === 'text'" class="prose dark:prose-invert max-w-none">
            <p class="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {{ section.content }}
            </p>
          </div>

          <!-- Highlight Section -->
          <div v-else-if="section.type === 'highlight'" class="my-6">
            <UCard>
              <div class="flex items-start gap-4 p-6">
                <div class="flex-shrink-0">
                  <div class="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <UIcon name="i-lucide-sparkles" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <p class="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-relaxed">
                  {{ section.content }}
                </p>
              </div>
            </UCard>
          </div>

          <!-- List Section -->
          <div v-else-if="section.type === 'list'" class="my-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-primary-600" />
              {{ section.content }}
            </h3>
            <ul class="space-y-3">
              <li 
                v-for="(item, idx) in section.items" 
                :key="idx"
                class="flex items-start gap-3 text-gray-700 dark:text-gray-300"
              >
                <UIcon 
                  name="i-lucide-check" 
                  class="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" 
                />
                <span class="leading-relaxed">{{ item }}</span>
              </li>
            </ul>
          </div>

          <!-- Quote Section -->
          <div v-else-if="section.type === 'quote'" class="my-8">
            <div class="relative">
              <div class="absolute -top-4 -left-4 text-6xl text-primary-200 dark:text-primary-800 opacity-50">
                "
              </div>
              <blockquote class="relative bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border-l-4 border-primary-500">
                <p class="text-gray-700 dark:text-gray-300 italic text-lg mb-3">
                  {{ section.content }}
                </p>
                <footer class="text-sm text-gray-600 dark:text-gray-400 font-semibold flex items-center gap-2">
                  <UIcon name="i-lucide-user" class="w-4 h-4" />
                  {{ section.author }}
                </footer>
              </blockquote>
            </div>
          </div>

          <!-- Image Section -->
          <div v-else-if="section.type === 'image'" class="my-6">
            <img 
              :src="section.imageUrl" 
              :alt="section.imageAlt || 'Course image'" 
              class="w-full rounded-xl shadow-lg object-cover max-h-96"
            />
          </div>
        </div>
      </div>

      <!-- Image Section -->
      <div v-if="imageName" class="lg:w-1/3 w-full flex-shrink-0">
        <div class="sticky top-4">
          <img 
            :src="`/courses/${imageName}`" 
            :alt="imageName" 
            class="w-full rounded-2xl shadow-xl object-cover aspect-square hover:shadow-2xl transition-shadow duration-300"
          />
        </div>
      </div>
    </div>

    <!-- Call to Action - Full Width -->
    <div class="mt-8 p-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-2xl">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
            Gotowy, aby zacząć?
          </h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Dołącz do kursu i rozpocznij naukę już dziś!
          </p>
        </div>
        <UIcon name="i-lucide-arrow-down" class="w-6 h-6 text-primary-600 dark:text-primary-400 animate-bounce" />
      </div>
    </div>

    <!-- Additional Features Grid -->
    <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard>
        <div class="flex flex-col items-center text-center p-4">
          <div class="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
            <UIcon name="i-lucide-video-camera" class="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 class="font-bold text-gray-900 dark:text-gray-100 mb-2">Spotkania na żywo</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Interaktywne sesje z prowadzącym w czasie rzeczywistym
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="flex flex-col items-center text-center p-4">
          <div class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
            <UIcon name="i-lucide-video" class="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h4 class="font-bold text-gray-900 dark:text-gray-100 mb-2">Materiały wideo</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Wysokiej jakości nagrania dostępne 24/7
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="flex flex-col items-center text-center p-4">
          <div class="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
            <UIcon name="i-lucide-infinity" class="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 class="font-bold text-gray-900 dark:text-gray-100 mb-2">Dożywotni dostęp</h4>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Wracaj do materiałów kiedy tylko chcesz
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.course-description {
  max-width: 80rem;
  margin-left: auto;
  margin-right: auto;
}
</style>
