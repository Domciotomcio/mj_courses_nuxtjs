<script setup lang="ts">
interface Props {
  courses?: any[]
  userId?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="course in courses"
      :key="course.id"
      class="overflow-hidden rounded-lg shadow-xl hover:shadow-2xl ring-1 ring-black/10 transition-shadow duration-300"
    >
      <NuxtLink :to="userId ? `/users/${userId}/courses/${course.id}` : `/courses/${course.id}`" class="block">
        <div class="relative h-48 md:h-64 overflow-hidden group">
          <!-- Background Image -->
          <img
            v-if="course.image_name"
            :src="`/courses/${course.image_name}`"
            :alt="course.title || 'Course image'"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90"
          />
          <div
            v-else
            class="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-500 to-primary-700"
          />
          
          <!-- Overlay: lighten in light mode, darken in dark mode -->
          <div
            class="absolute inset-0 bg-gradient-to-t from-white/80 via-white/60 to-transparent mix-blend-screen dark:from-black/80 dark:via-black/50 dark:to-black/30 dark:mix-blend-normal transition-colors duration-300 group-hover:bg-gray-700/60"
          />
          
          <!-- Content -->
          <div class="absolute inset-0 flex flex-col justify-end p-4 text-default gap-2">
            <h3 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {{ course.title }}
            </h3>
            <p v-if="course.subtitle" class="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-3">
              {{ course.subtitle }}
            </p>
            <p v-if="course.description" class="text-sm md:text-base text-gray-500 dark:text-gray-350 line-clamp-2">
              {{ course.description }}
            </p>
          
            <!-- Book description (optional, hidden on small screens) -->
            <div v-if="course.book_desc" class="hidden md:block text-xs text-gray-700 dark:text-gray-300">
              <div class="flex items-center gap-3">
                <UIcon name="i-lucide-book" class="w-5 h-5" />
                <span>{{ course.book_desc }}</span>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
