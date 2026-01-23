<script lang="ts" setup>
import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore' 
import type { Course } from '../../../types/models/course'
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { CalendarDate, DateFormatter, getLocalTimeZone, type DateValue } from '@internationalized/date'
import { pageCTA } from '#build/ui'

const db = useFirestore()
const courses = useCollection<Course>(collection(db, 'courses'))

const showFinishedCourses = ref(false)
const searchQuery = ref('')
const dateFrom = ref<DateValue | null>(null)
const dateTo = ref<DateValue | null>(null)
const sortBy = ref<'date-asc' | 'date-desc' | 'title-asc' | 'title-desc' | 'price-asc' | 'price-desc'>('date-desc')

// Date formatter for display
const df = new DateFormatter('pl-PL', {
  dateStyle: 'medium'
})

const sortOptions = [
  { label: 'Data: od najnowszych', value: 'date-desc' },
  { label: 'Data: od najstarszych', value: 'date-asc' },
  { label: 'Nazwa: A-Z', value: 'title-asc' },
  { label: 'Nazwa: Z-A', value: 'title-desc' },
  { label: 'Cena: od najniższej', value: 'price-asc' },
  { label: 'Cena: od najwyższej', value: 'price-desc' }
]

// Scroll to section helper
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Auto-animate reference
const [coursesContainer] = useAutoAnimate()

// Filter courses based on finished status and search query
const filteredCourses = computed(() => {
  let result = courses.value
  
  // Filter by finished status
  if (!showFinishedCourses.value) {
    result = result.filter(course => !course.is_finished)
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(course => 
      course.title?.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query)
    )
  }
  
  // Filter by date range
  if (dateFrom.value || dateTo.value) {
    result = result.filter(course => {
      if (!course.date) return false
      const courseDate = new Date(course.date)
      const from = dateFrom.value ? dateFrom.value.toDate(getLocalTimeZone()) : null
      const to = dateTo.value ? dateTo.value.toDate(getLocalTimeZone()) : null
      
      if (from && courseDate < from) return false
      if (to && courseDate > to) return false
      return true
    })
  }
  
  // Sort courses
  result = [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'date-asc': {
        const dateA = a.date ? new Date(a.date).getTime() : 0
        const dateB = b.date ? new Date(b.date).getTime() : 0
        return dateA - dateB
      }
      case 'date-desc': {
        const dateA = a.date ? new Date(a.date).getTime() : 0
        const dateB = b.date ? new Date(b.date).getTime() : 0
        return dateB - dateA
      }
      case 'title-asc':
        return (a.title || '').localeCompare(b.title || '', 'pl')
      case 'title-desc':
        return (b.title || '').localeCompare(a.title || '', 'pl')
      case 'price-asc':
        return (a.price || 0) - (b.price || 0)
      case 'price-desc':
        return (b.price || 0) - (a.price || 0)
      default:
        return 0
    }
  })
  
  return result
})
</script>

<template>
  <div>
    <!-- Header -->
    <section>
    <UPageHero
      headline="Misja Jonatan"
      title="Odkryj kursy online Misji Jonatan"
      description="Misja Jonatan - kursy online, które pomogą Ci wzrastać w wierze i pogłębiać relację z Bogiem."
      orientation="horizontal"
      :links="[{
        label: 'Zobacz kursy',
        color: 'primary',
        size: 'lg',
        trailingIcon: 'i-lucide-arrow-down',
        click: () => scrollToSection('courses-section')
      }]"
    >
    <img
      src="/hero.jpg"
      alt="App screenshot"
      class="rounded-lg shadow-2xl ring ring-default shadow-orange-500/50 dark:shadow-orange-400/30"
    />
  </UPageHero>
  </section>


  <section id="courses-section">
    <!-- Page Title and Filters Section -->
    <div class="container mx-auto px-6 mb-8">
      <div class="flex flex-col lg:flex-row gap-6 items-start">
      <!-- Page Title - 1/3 space -->
      <div class="w-full lg:w-1/3 flex items-center">
        <page-title title="Wszystkie kursy" subtitle="Przeglądaj dostępne kursy online" />
      </div>

      <!-- Search and Filter Section - 2/3 space -->
      <div class="w-full lg:w-2/3">
        <div class="flex flex-col gap-4">
        <!-- Search Bar -->
        <div class="flex gap-4 items-center">
          <UInput
          v-model="searchQuery"
          icon="i-lucide-search"
          placeholder="Szukaj kursów..."
          class="w-full"
          size="lg"
          />
        </div>
        
        <!-- Filters Row -->
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex items-center gap-2">
          <UPopover>
            <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-calendar"
            size="sm"
            >
            {{ dateFrom ? df.format(dateFrom.toDate(getLocalTimeZone())) : 'Data od' }}
            </UButton>
            <template #content>
            <UCalendar v-model="dateFrom as any" class="p-2" />
            </template>
          </UPopover>
          
          <span class="text-muted">-</span>
          
          <UPopover>
            <UButton
            color="neutral"
            variant="outline"
            icon="i-lucide-calendar"
            size="sm"
            >
            {{ dateTo ? df.format(dateTo.toDate(getLocalTimeZone())) : 'Data do' }}
            </UButton>
            <template #content>
            <UCalendar v-model="dateTo as any" class="p-2" />
            </template>
          </UPopover>
          </div>
          
          <USelectMenu
          v-model="sortBy"
          :items="sortOptions"
          value-key="value"
          icon="i-lucide-arrow-up-down"
          trailing-icon="i-lucide-chevron-down"
          color="neutral"
          variant="outline"
          size="sm"
          class="w-auto"
          />
          
          <UCheckbox v-model="showFinishedCourses" label="Pokaż zakończone kursy" />
          
          <UButton
          v-if="searchQuery || dateFrom || dateTo || showFinishedCourses"
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          size="sm"
          @click="() => {
            searchQuery = ''
            dateFrom = null
            dateTo = null
            showFinishedCourses = false
          }"
          >
          Wyczyść filtry
          </UButton>
        </div>
        </div>
      </div>
      </div>
    </div>

    <!-- Courses -->
    <div v-if="filteredCourses.length > 0" ref="coursesContainer" class="container px-12 space-y-6">
      <UPageCTA
      v-for="course in filteredCourses"
      :header="course.title"
      :key="course.id"
      :title="course.title"
      :description="course.description"
      :links="course.is_finished ? [] : [{
        icon: 'i-lucide-shopping-cart',
        label: 'Zakup kurs',
        to: `/courses/${course.id}`,
        color: 'neutral',
        variant: 'outline'
      },{
        label: 'Dowiedz się więcej',
        to: `/courses/${course.id}`,
        color: 'primary',
        trailingIcon: 'i-lucide-arrow-right'
      }]"
      :class="[
        'shadow-xl hover:shadow-2xl transition-shadow',
        {
        'opacity-50 grayscale cursor-not-allowed': course.is_finished
        }
      ]"
      variant="outline"
      orientation="horizontal"
      >
      <template #description>
    <div class="space-y-6">
      
      <p class="text-gray-600 dark:text-gray-300 text-lg">
      Kurs został stworzony z myślą o wszystkich, którzy pragną pogłębić swoją relację z Bogiem...
      </p>

      <div class="flex flex-col items-start gap-4 text-sm text-gray-500 font-medium">
      <!-- Author -->
      <div class="flex items-center gap-1">
        <UIcon name="i-heroicons-user-circle" class="w-5 h-5" />
        <span>Artur Skowron</span>
      </div>
      
      <!-- Number of meetings -->
      <div class="flex items-center gap-1">
        <UIcon name="i-lucide-presentation" class="w-5 h-5" />
        <span>12 spotkań na żywo</span>
      </div>

      <!-- Number of meetings -->
      <div class="flex items-center gap-1">
        <UIcon name="i-heroicons-video-camera" class="w-5 h-5" />
        <span>Materiały wideo</span>
      </div>

      <!-- Number of meetings -->
      <div class="flex items-center gap-1">
        <UIcon name="i-lucide-book-open" class="w-5 h-5" />
        <span>Ksiąka w prezencie</span>
      </div>

      <!-- Number of meetings -->
      <div class="flex items-center gap-1">
        <UIcon name="i-lucide-infinity" class="w-5 h-5" />
        <span>Dożywotni dostęp</span>
      </div>
      </div>

      <!-- Price Section -->
      <!--
      <div class="flex items-baseline gap-2">
      <span class="text-3xl font-bold text-gray-900 dark:text-white">199 zł</span>
      <div v-if="course.is_cutprized">
      <span class="text-sm text-gray-400 line-through">299 zł</span> <UBadge color="orange" variant="subtle" size="xs">Promocja</UBadge>
      </div>
      </div>-->

    </div>
    </template>
      
      <img
      :src="course?.image_1x1"
      class="rounded-lg shadow-2xl ring ring-default aspect-[1/1] object-cover"
      />
      </UPageCTA>
    </div>
    <div v-else>
      <NoCourseFound />
    </div>
    </section>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
