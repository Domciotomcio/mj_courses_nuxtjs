<script lang="ts" setup>
import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore' 
import type { Course } from '../../../types/models/course'

const db = useFirestore()
const courses = useCollection<Course>(collection(db, 'courses'))

// View toggle state
const isListView = ref(false)
const showFinishedCourses = ref(false)

function toggleView() {
  isListView.value = !isListView.value
}

// Filter courses based on finished status
const filteredCourses = computed(() => {
  if (showFinishedCourses.value) {
    return courses.value
  }
  return courses.value.filter(course => !course.is_finished)
})
</script>

<template>
  <div>
    <!-- Header: centered PageTitle with a button pinned to the top-right -->
    <div class="relative mb-8">
      <!-- Centered title container -->
      <div class="container mx-auto px-4 text-center">
        <page-title title="Wszystkie kursy" subtitle="Misja Jonatan - Kursy online" />
      </div>

      <!-- Toggle button pinned to the top-right of the same header area -->
      <div class="absolute right-4 top-0 flex items-center gap-2 z-10">
        <UButton
          :icon="isListView ? 'i-lucide-grid-2x2' : 'i-lucide-list'"
          @click="toggleView"
          color="neutral"
          variant="outline"
          class="lg:hidden"
        />
        <UButton
          :icon="isListView ? 'i-lucide-grid-2x2' : 'i-lucide-list'"
          :label="isListView ? 'Widok siatki' : 'Widok listy'"
          @click="toggleView"
          color="neutral"
          variant="outline"
          class="hidden lg:inline-flex"
        />
      </div>
    </div>

    <!-- Grid View -->
    <Transition name="fade" mode="out-in">
      <div v-if="!isListView" key="grid">
        <UBlogPosts>
          <UBlogPost
            v-for="course in filteredCourses"
            :key="course.id"
            v-bind="{ ...course, date: convertToDate(course.date) }"
            :to="course.is_finished ? undefined : `/courses/${course.id}`"
            :class="[
              'backdrop-blur-sm bg-default/60 shadow-xl hover:shadow-2xl ring-1 ring-black/10 rounded-lg transition-shadow',
              {
                'opacity-50 grayscale cursor-not-allowed pointer-events-none': course.is_finished,
                'cursor-pointer': !course.is_finished
              }
            ]"
            :ui="{
              description: 'mt-1 text-base text-pretty line-clamp-3'
            }"
          />
        </UBlogPosts>
      </div>

      <!-- List View -->
      <div v-else class="container mx-auto" key="list">
        <CourseListView :courses="filteredCourses" />
      </div>
    </Transition>

    <!-- Show finished courses checkbox at the bottom -->
    <div class="container p-4 flex justify-center">
      <UCheckbox v-model="showFinishedCourses" label="Pokaż zakończone kursy" />
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
