<script lang="ts" setup>
import { useRoute } from 'vue-router'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const userId = route.params.id as string

// Get user from composable
const user = useUser(userId)

watchEffect(() => {
  if (user.value) {
    console.log('Loaded user:', user.value)
    console.log('User courses:', user.value.courses)
  }
})
</script>

<template>
  <div>
    <!-- Header: centered PageTitle -->
    <div class="container mx-auto px-4 text-center mb-8">
      <page-title title="Moje kursy" subtitle="Kursy zakupione przez ciebie" />
    </div>

    <div v-if="user">
      <UBlogPosts v-if="user.courses && user.courses.length > 0">
        <UBlogPost
          v-for="course in user.courses"
          :key="course.id"
          v-bind="{ ...course, date: convertToDate(course.date) }"
          :to="`/users/${userId}/courses/${course.id}`"
          class="backdrop-blur-sm bg-default/60 shadow-xl hover:shadow-2xl ring-1 ring-black/10 rounded-lg transition-shadow cursor-pointer"
          :ui="{
            description: 'mt-1 text-base text-pretty line-clamp-3'
          }"
        />
      </UBlogPosts>
      <div v-else class="flex items-center justify-center py-16 text-center text-lg text-muted">
        Brak kursów do wyświetlenia
      </div>
    </div>
    <div v-else>
      <p>Loading user data...</p>
    </div>
  </div>
</template>

<style scoped>
</style>
