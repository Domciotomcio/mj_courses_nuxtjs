<script lang="ts" setup>
import { useFirestore, useDocument, useCollection } from 'vuefire'
import { collection, doc } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import CourseMeetingItem from '~/components/CourseMeetingItem.vue'
import CourseMeetings from '~/components/CourseMeetings.vue'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const courseId = route.params.id as string
const user = useCurrentUser()
const consentAccepted = ref(false)
const toast = useToast()

// Reactive userUid
const userUid = computed(() => user.value?.uid)

// Load user document with courses field (array of references)
const db = useFirestore()
const userDoc = computed(() => {
  if (!userUid.value) return null
  return useDocument(doc(db, 'users', userUid.value))
})

// Check if user already owns this course
const userOwnsCourse = computed(() => {
  if (!user.value?.uid) return false
  if (!userDoc.value?.value) return false
  
  const userCourses = userDoc.value.value.courses
  if (!Array.isArray(userCourses)) return false
  
  // Check if any of the course references match the current courseId
  const hasCourse = userCourses.some((courseRef: any) => {
    // Extract the course ID from the reference path
    // Path format: /courses/{courseId}
    if (courseRef?.path) {
      const refCourseId = courseRef.path.split('/').pop()
      return refCourseId === courseId
    }
    // Or if it's just the ID
    if (courseRef?.id === courseId) return true
    return false
  })
  
  console.log('User courses array:', userCourses)
  console.log('Looking for courseId:', courseId)
  console.log('User owns course:', hasCourse)
  
  return hasCourse
})

console.log('Course ID from route:', courseId)
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
  // Check if user is logged in
  if (!user.value) {
    router.push({
      path: '/login',
      query: { redirect: `/courses/${courseId}` }
    })
    return
  }

  if (!consentAccepted.value) {
    toast.add({
      title: 'Wymagana zgoda',
      description: 'Musisz zaakceptować warunki dostarczenia treści cyfrowych, aby kontynuować zakup.',
      color: 'error',
      icon: 'i-lucide-alert-circle'
    })
    return
  }
  
  console.log('courseId:', courseId)
  const { url } = await $fetch('/api/create-checkout-session', {
    method: 'POST',
    body: { courseId, userUid: userUid.value }
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

const scrollToPurchase = () => {
  const pricingPlan = document.querySelector('.pricing-section')
  if (pricingPlan) {
    pricingPlan.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// Handle hash navigation on mount
onMounted(() => {
  if (route.hash) {
    setTimeout(() => {
      const element = document.querySelector(route.hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 300) // Small delay to ensure content is rendered
  }
})

</script>

<template>
  <div>
    <UPageSection
      :title="course?.title || 'Nazwa kursu'"
      description="Misja Jonatan - kursy online" 
      :headline="headlineText"
      orientation="horizontal"
      :links="[{ label: 'Kup teraz', size: 'xl', icon: 'i-lucide-shopping-basket', onClick: scrollToPurchase }]"
    >
      <img
        :src="course?.image_1x1"
        class="rounded-lg shadow-2xl ring ring-default aspect-[4/3] object-cover"
      />
    </UPageSection>

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

    <section id="summary">
    <div class="container mt-8">
      <div class="flex flex-col md:flex-row md:items-start md:gap-8">
        <!-- Meetings column -->
        <div class="md:w-2/3">
          <CourseMeetings :meetings="course?.meetings" />
        </div>

        <!-- Summary column -->
        <div class="md:w-1/3 mt-8 md:mt-0 pricing-section">
          <UPricingPlan
            :title="titleText"
            :description="descriptionText"
            :price="priceText"
            :features="featuresList"
            class="mx-auto bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <template #footer>
              <div v-if="!user" class="space-y-4">
                <UAlert
                  title="Wymagane logowanie"
                  description="Musisz być zalogowany, aby kupić kurs."
                  color="warning"
                  icon="i-lucide-info"
                />
                <UButton
                  label="Zaloguj się"
                  size="lg"
                  block
                  @click="router.push({ path: '/login', query: { redirect: `/courses/${courseId}` } })"
                />
              </div>
              <div v-else-if="userOwnsCourse" class="space-y-4">
                <UAlert
                  title="Masz już ten kurs"
                  description="Ten kurs jest już dostępny w Twoim koncie."
                  color="success"
                  icon="i-lucide-check-circle"
                />
                <UButton
                  label="Przejdź do kursu"
                  size="lg"
                  block
                  @click="router.push(`/users/${userUid}/courses/${courseId}`)"
                />
              </div>
              <div v-else class="space-y-4">
                <UFormField>
                  <UCheckbox 
                    v-model="consentAccepted"
                    label="Wyrażam zgodę na dostarczenie treści cyfrowych (kursu) natychmiast po opłaceniu zamówienia i przyjmuję do wiadomości, że w ten sposób tracę prawo do odstąpienia od umowy w terminie 14 dni."
                  />
                </UFormField>
                <UButton
                  label="Kup teraz"
                  size="lg"
                  block
                  @click="buyCourse(course?.id || courseId)"
                />
              </div>
            </template>
          </UPricingPlan>
        </div>
      </div>
    </div>
    </section>
  </div>
</template>
