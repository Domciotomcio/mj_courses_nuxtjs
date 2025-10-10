<script lang="ts" setup>
import { useFirestore, useDocument } from 'vuefire'
import { collection, doc } from 'firebase/firestore'
import { useRoute } from 'vue-router'

const route = useRoute()
const courseId = route.params.id as string
const user = useCurrentUser()
const userUid = user.value?.uid

console.log('Course ID from route:', courseId)
const db = useFirestore()
const course = useDocument(doc(collection(db, 'courses'), courseId))
console.log(course)

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
      <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">Opis kursu</h1>
      
      <CourseDescription 
        :description="course?.long_description"
        :image-name="course?.image_name"
      />
    </div>

    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Lista spotkań</h1>
      <div class="m-4">
        <UAccordion type="multiple" :items="course?.meetings">
          <template #content="{ item }">
            
            <div class="pb-3.5 text-sm text-muted flex-1 mr-4">
                  <p class="mb-4">Data spotkania: <NuxtTime :datetime="Date.now()" /></p>
                  <p>{{ item?.description }}</p>
                </div>
          </template>
        </UAccordion>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Podsumowanie</h1>
      <div class="max-w-3xl ml-auto bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">Cena za kurs:</span>
          <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {{ course?.price || 'Jeszcze nie ustalona' }} zł
          </span>
        </div>
        <div class="flex justify-end">
          <UButton 
            @click="buyCourse(course!.id || '')" 
            size="xl"
            icon="i-lucide-shopping-cart"
            trailing
          >
            Zakup kurs
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
