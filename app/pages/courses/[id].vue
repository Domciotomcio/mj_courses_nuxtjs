<script lang="ts" setup>
import { useFirestore, useDocument } from 'vuefire'
import { collection, doc } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import CourseMeetingItem from '~/components/CourseMeetingItem.vue'
import CourseMeetings from '~/components/CourseMeetings.vue'
import { computed } from 'vue'

const route = useRoute()
const courseId = route.params.id as string
const user = useCurrentUser()
const userUid = user.value?.uid

console.log('Course ID from route:', courseId)
const db = useFirestore()
const course = useDocument(doc(collection(db, 'courses'), courseId))
console.log(course)

// Load content based on course_markdown_name
const { data: courseContent } = await useAsyncData(
  `course-content-${courseId}`,
  async () => {
    if (!course.value?.course_markdown_name) return null
    return queryCollection('content')
      .path(`/courses/${course.value.course_markdown_name}`)
      .first()
  },
  {
    watch: [course]
  }
)

async function buyCourse(courseId: string) {
  console.log('courseId:', courseId)
  const { url } = await $fetch('/api/create-checkout-session', {
    method: 'POST',
    body: { courseId, userUid }
  })

  if (url) window.location.href = url
}

// Fallbacks / mock data when fields are missing
const titleText = computed(() => course.value?.title ?? 'Kurs — wkrótce')
const descriptionText = computed(() => course.value?.subtitle ?? 'Opis kursu pojawi się niebawem.')

const priceText = computed(() => {
  const p = course.value?.price
  if (p === null || p === undefined || p === '') return 'Gratis'
  // try to parse numeric value; if not numeric, append PLN
  const num = typeof p === 'number' ? p : Number(String(p).replace(/[^0-9.,-]/g, '').replace(',', '.'))
  if (Number.isFinite(num)) {
    try {
      return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(num)
    } catch (e) {
      return `${num} PLN`
    }
  }
  return String(p) + ' PLN'
})

const featuresList = computed(() => {
  const f = course.value?.features
  if (Array.isArray(f) && f.length) return f
  return ['Dostęp do materiałów', 'Wsparcie autora', 'Certyfikat ukończenia']
})

const headlineText = computed(() => {
  const courseDate = course.value?.date
  if (!courseDate) return undefined
  
  // Handle Firebase Timestamp object
  let startDate: Date
  if (courseDate && typeof courseDate === 'object' && 'toDate' in courseDate) {
    // Firebase Timestamp object
    startDate = courseDate.toDate()
  } else if (courseDate && typeof courseDate === 'object' && 'seconds' in courseDate) {
    // Firebase Timestamp plain object { seconds, nanoseconds }
    startDate = new Date(courseDate.seconds * 1000)
  } else {
    // Fallback to string/date parsing
    startDate = new Date(courseDate)
  }
  
  const now = new Date()
  
  // If course hasn't started yet, show the headline
  if (startDate > now) {
    return `Nowy - start od ${startDate.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
  }
  
  // Course already started, don't show headline
  return undefined
})

</script>

<template>
  <div>
    <UPageHero 
      :title="course?.title || 'Nazwa kursu'"
      description="Misja Jonatan - kursy online" 
      :headline="headlineText"
      orientation="horizontal"
    >
      <img
        :src="`/courses/jak_wychowac_dzieci_do_wiary/1x1.jpg`"
        class="rounded-lg shadow-2xl ring ring-default"
      />
    </UPageHero>

    <div>
      <ContentRenderer
        v-if="courseContent"
        :value="courseContent"
        class="prose dark:prose-invert max-w-none"
      />
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <div class="flex flex-col items-center gap-4">
          <!-- indeterminate progress spinner -->
          <UProgress size="xl" color="neutral" class="w-12 h-12" aria-hidden="true" />
          <p class="sr-only">Ładowanie opisu kursu...</p>
        </div>
      </div>
    </div>

    <div class="container mt-8">
      <div class="flex flex-col md:flex-row md:items-start md:gap-8">
        <!-- Meetings column -->
        <div class="md:w-2/3">
          <CourseMeetings :meetings="course?.meetings" />
        </div>

        <!-- Summary column -->
        <div class="md:w-1/3 mt-8 md:mt-0">
          <UPricingPlan
            :title="titleText"
            :description="descriptionText"
            :price="priceText"
            :features="featuresList"
            :button="{ label: 'Kup teraz', size: 'lg', block: true, onClick: () => buyCourse(course?.id || courseId) }"
            class="mx-auto bg-white/60 dark:bg-gray-900/60 backdrop-blur-md"
          />
        </div>
      </div>
    </div>
  </div>
</template>
