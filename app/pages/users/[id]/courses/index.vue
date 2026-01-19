<script lang="ts" setup>
import { useRoute } from 'vue-router'
import NoCourseFound from '~/components/courses/NoCourseFound.vue'

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
           <div v-else>
            <NoCourseFound />
          </div>
        </div>

        <!-- List View -->
        <div v-else class="container mx-auto px-4" key="list">
          <CourseListView v-if="user.courses && user.courses.length > 0" :courses="user.courses" :userId="userId" />
          <UEmpty
            v-else
            icon="i-lucide-graduation-cap"
            title="Brak zapisanych kursów"
            description="Nie masz jeszcze żadnych kursów. Sprawdź dostępne kursy i rozpocznij naukę!"
            :actions="[{
              label: 'Przeglądaj kursy',
              icon: 'i-lucide-search',
              color: 'primary',
              to: '/courses'
            }]"
          />
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
