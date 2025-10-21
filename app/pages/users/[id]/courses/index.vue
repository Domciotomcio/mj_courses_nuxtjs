<script lang="ts" setup>
import { useRoute } from 'vue-router'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const userId = route.params.id as string

// Get user from composable
const user = useUser(userId)

// View toggle state
const isListView = ref(false)

function toggleView() {
  isListView.value = !isListView.value
}

watchEffect(() => {
  if (user.value) {
    console.log('Loaded user:', user.value)
    console.log('User courses:', user.value.courses)
  }
})
</script>

<template>
  <div>
    <!-- Header: centered PageTitle with a button pinned to the top-right -->
    <div class="relative mb-8">
      <!-- Centered title container -->
      <div class="container mx-auto px-4 text-center">
        <page-title title="Moje kursy" subtitle="Kursy zakupione przez ciebie" />
      </div>

      <!-- Toggle button pinned to the top-right of the same header area -->
      <div class="absolute right-4 top-0">
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

    <div v-if="user">
      <!-- Grid View -->
      <Transition name="fade" mode="out-in">
        <div v-if="!isListView" key="grid">
          <UBlogPosts v-if="user.courses">
            <UBlogPost
              v-for="course in user.courses"
              :key="course.id"
              v-bind="course"
              :to="`/users/${userId}/courses/${course.id}`"
              :ui="{
                description: 'mt-1 text-base text-pretty line-clamp-3'
              }"
            />
          </UBlogPosts>
        </div>

        <!-- List View -->
        <div v-else class="container mx-auto px-4" key="list">
          <CourseListView :courses="user.courses" :userId="userId" />
        </div>
      </Transition>
    </div>
    <div v-else>
      <p>Loading user data...</p>
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
