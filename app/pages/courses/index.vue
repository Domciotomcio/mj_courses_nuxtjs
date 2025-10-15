<script lang="ts" setup>
import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore' 
import type { Course } from '../../../types/models/course'

const db = useFirestore()
const courses = useCollection<Course>(collection(db, 'courses'))

// View toggle state
const isListView = ref(false)

function toggleView() {
  isListView.value = !isListView.value
}


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
      <div class="absolute right-4 top-0">
        <UButton
          :icon="isListView ? 'i-lucide-grid-2x2' : 'i-lucide-list'"
          :label="isListView ? 'Widok siatki' : 'Widok listy'"
          @click="toggleView"
          color="neutral"
          variant="outline"
        />
      </div>
    </div>

    <!-- Grid View -->
    <Transition name="fade" mode="out-in">
      <div v-if="!isListView" key="grid">
        <UBlogPosts>
          <UBlogPost
            v-for="course in courses"
            :key="course.id"
            v-bind="course"
            :to="`/courses/${course.id}`"
            :ui="{
              description: 'mt-1 text-base text-pretty line-clamp-3'
            }"
          />
        </UBlogPosts>
      </div>

      <!-- List View -->
      <div v-else class="container mx-auto px-4" key="list">
        <CourseListView :courses="courses" />
      </div>
    </Transition>
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
