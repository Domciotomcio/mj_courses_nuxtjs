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
    <page-title class="mb-8" title="Wszystkie kursy" subtitle="Misja Jonatan - Kursy online" />
    
    <!-- View Toggle Button -->
    <div class="container mx-auto px-4 mb-6 flex justify-end">
      <UButton
        :icon="isListView ? 'i-lucide-grid-2x2' : 'i-lucide-list'"
        :label="isListView ? 'Widok siatki' : 'Widok listy'"
        @click="toggleView"
        color="neutral"
        variant="outline"
      />
    </div>

    <!-- Grid View -->
    <div v-if="!isListView">
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
    <div v-else class="container mx-auto px-4">
      <CourseListView :courses="courses" />
    </div>
  </div>
</template>
