<script lang="ts" setup>
import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore' 
import type { Course } from '../../../types/models/course'
import { useAutoAnimate } from '@formkit/auto-animate/vue'

const db = useFirestore()
const courses = useCollection<Course>(collection(db, 'courses'))

const showFinishedCourses = ref(false)
const searchQuery = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const sortBy = ref<'date-asc' | 'date-desc' | 'title-asc' | 'title-desc' | 'price-asc' | 'price-desc'>('date-desc')

const sortOptions = [
  { label: 'Data: od najnowszych', value: 'date-desc' },
  { label: 'Data: od najstarszych', value: 'date-asc' },
  { label: 'Nazwa: A-Z', value: 'title-asc' },
  { label: 'Nazwa: Z-A', value: 'title-desc' },
  { label: 'Cena: od najniższej', value: 'price-asc' },
  { label: 'Cena: od najwyższej', value: 'price-desc' }
]

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
      const from = dateFrom.value ? new Date(dateFrom.value) : null
      const to = dateTo.value ? new Date(dateTo.value) : null
      
      if (from && courseDate < from) return false
      if (to && courseDate > to) return false
      return true
    })
  }
  
  // Sort courses
  result = [...result].sort((a, b) => {
    switch (sortBy.value) {
      case 'date-asc':
        return (a.date || '').localeCompare(b.date || '')
      case 'date-desc':
        return (b.date || '').localeCompare(a.date || '')
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
    <UPageSection
      title="Odkryj kursy online Misji Jonatan"
      description="Misja Jonatan - kursy online, które pomogą Ci wzrastać w wierze i pogłębiać relację z Bogiem."
    />

    <!-- Search and Filter Section -->
    <div class="container mx-auto mb-6 px-4">
      <div class="flex flex-col gap-4">
        <!-- Search Bar -->
        <div class="flex gap-4 items-center justify-center">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Szukaj kursów..."
            class="w-full max-w-2xl"
            size="lg"
          />
        </div>
        
        <!-- Filters Row -->
        <div class="flex flex-wrap gap-4 items-center justify-center">
          <div class="flex items-center gap-2">
            <UInput
              v-model="dateFrom"
              type="date"
              placeholder="Data od"
              icon="i-lucide-calendar"
              size="sm"
              class="w-40"
            />
            <span class="text-muted">-</span>
            <UInput
              v-model="dateTo"
              type="date"
              placeholder="Data do"
              icon="i-lucide-calendar"
              size="sm"
              class="w-40"
            />
          </div>
          
          <USelectMenu
            v-model="sortBy"
            :items="sortOptions"
            value-key="value"
            size="sm"
          >
            <UButton
              icon="i-lucide-arrow-up-down"
              trailing-icon="i-lucide-chevron-down"
              color="neutral"
              variant="outline"
              size="sm"
            >
              {{ sortOptions.find(o => o.value === sortBy)?.label }}
            </UButton>
          </USelectMenu>
          
          <UCheckbox v-model="showFinishedCourses" label="Pokaż zakończone kursy" />
          
          <UButton
            v-if="searchQuery || dateFrom || dateTo || showFinishedCourses"
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="sm"
            @click="() => {
              searchQuery = ''
              dateFrom = ''
              dateTo = ''
              showFinishedCourses = false
            }"
          >
            Wyczyść filtry
          </UButton>
        </div>
      </div>
    </div>

    <!-- Courses -->
    <div v-if="filteredCourses.length > 0" ref="coursesContainer" class="container mx-auto space-y-6">
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
