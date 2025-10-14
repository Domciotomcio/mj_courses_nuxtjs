<script lang="ts" setup>
import { useFirestore, useDocument } from 'vuefire'
import { collection, doc } from 'firebase/firestore'
import { useRoute } from 'vue-router'
import CourseMeetingItem from '~/components/CourseMeetingItem.vue'
import CourseMeetings from '~/components/CourseMeetings.vue'

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
  const { url } = await $fetch('/api/create-checkout-session', {
    method: 'POST',
    body: { courseId, userUid }
  })

  if (url) window.location.href = url
}

const course2 = {
  id: 1,
  title: 'Wychowanie dzieci do wiary',
  image_name: "course1.jpg",
  description: "lorem ipsum dolor sit amet consectetur adipisicing elit. Vel id sapiente, dolorem doloremque pariatur excepturi corrupti error. Suscipit ad, aspernatur, perspiciatis atque sit consequuntur, accusamus ducimus inventore incidunt cum exercitationem?",
  meetings: [
    { id: 1, title: 'Spotkanie 1', label: 'Spotkanie 1', content: 'Content for meeting 1' },
    { id: 2, title: 'Spotkanie 2', label: 'Spotkanie 2', content: 'Content for meeting 2' },
    { id: 3, title: 'Spotkanie 3', label: 'Spotkanie 3', content: 'Content for meeting 3' }
  ],
  price: '99 PLN'
};

</script>

<template>
  <div>
    <PageTitle :title="course?.title" :subtitle="course?.subtitle" />

    <div class="container mx-auto px-4 py-8">
      <ContentRenderer
        v-if="courseContent"
        :value="courseContent"
        class="prose dark:prose-invert max-w-none"
      />
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Ładowanie opisu kursu...</p>
      </div>
    </div>

    <CourseMeetings :meetings="course?.meetings" />

    <div class="container mx-auto px-4">
      <h3>Podsumowanie</h3>
      <CoursePurchaseSummary 
        :price="course?.price" 
        :course-id="course?.id || ''"
        @purchase="buyCourse"
      />
    </div>
  </div>
</template>
