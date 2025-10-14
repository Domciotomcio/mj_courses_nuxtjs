<script setup lang="ts">
interface Props {
  courses?: any[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="course in courses"
      :key="course.id"
      class="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <NuxtLink :to="`/courses/${course.id}`" class="block">
        <div class="relative h-48 md:h-64 overflow-hidden">
          <!-- Background Image -->
          <img
            v-if="course.image_name"
            :src="`/courses/${course.image_name}`"
            :alt="course.title || 'Course image'"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div
            v-else
            class="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-500 to-primary-700"
          />
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          
          <!-- Content -->
          <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
            <h3 class="text-2xl md:text-3xl font-bold mb-2">
              {{ course.title }}
            </h3>
            <p v-if="course.subtitle" class="text-base md:text-lg text-gray-200 mb-3">
              {{ course.subtitle }}
            </p>
            <p v-if="course.description" class="text-sm md:text-base text-gray-300 line-clamp-2 mb-4">
              {{ course.description }}
            </p>
            
            <!-- Course Info -->
            <div class="flex flex-wrap items-center gap-4 text-sm">
              <div v-if="course.price" class="flex items-center gap-2">
                <UIcon name="i-lucide-tag" class="w-4 h-4" />
                <span class="font-semibold">{{ course.price }} zł</span>
              </div>
              <div v-if="course.meetings?.length" class="flex items-center gap-2">
                <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                <span>{{ course.meetings.length }} spotkań</span>
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>
