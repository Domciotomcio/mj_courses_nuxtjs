<script lang="ts" setup>
import { collection, doc } from 'firebase/firestore'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const db = useFirestore()
const courseId = route.params.courseId as string
const userId = route.params.id as string

// Load course from Firestore
const course = useDocument(doc(collection(db, 'courses'), courseId))

// Load content based on course_markdown_name from user-courses folder
const { data: courseContent } = await useAsyncData(
  `user-course-content-${courseId}`,
  async () => {
    if (!course.value?.course_markdown_name) return null
    return queryCollection('content')
      .path(`/user-courses/${course.value.course_markdown_name}`)
      .first()
  },
  {
    watch: [course]
  }
)
</script>

<template>
  <div>
    <PageTitle :title="course?.title" :subtitle="course?.subtitle" />

    <div>
      <ContentRenderer
        v-if="courseContent"
        :value="courseContent"
        class="prose dark:prose-invert max-w-none"
      />
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <div class="flex flex-col items-center gap-4">
          <UProgress size="xl" color="neutral" class="w-12 h-12" aria-hidden="true" />
          <p class="sr-only">Ładowanie opisu kursu...</p>
        </div>
      </div>
    </div>

    <div class="mt-8"></div>

    <div>
      <h3>Lista spotkań</h3>

      <CourseMeetings :meetings="course?.meetings">
        <template #content="{ item }">
          <template v-if="item!.has_occurred === false">
            
            <div class="flex items-start">
              
              <div class="pb-3.5 text-sm text-muted flex-1 mr-4">
                <p class="mb-4">Data spotkania: <NuxtTime :datetime="Date.now()" /></p>
                <p>{{ item?.description }}</p>
              </div>
              <div class="flex-shrink-0 pb-3.5">
                <UButton :href="item!.meeting_url" target="_blank">
                  <UIcon name="i-lucide-presentation" />
                  Dołącz do spotkania
                </UButton>
              </div>
            </div>

          </template>
          <template v-else>
            <p class="pb-3.5 text-sm text-muted">
              {{ item?.description }}
            </p>

            <div style="display: flex; justify-content: center;">
              <iframe v-if="item!.video_url" :src="`https://www.youtube.com/embed/${item!.video_url.split('v=')[1]}`"
                width="560" height="315" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>

          </template>
        </template>
      </CourseMeetings>
    </div>

    <div class="mt-8"></div>

    <div>
      <h3>Dodatkowe materiały</h3>
      <div class="mt-4"></div>
      <BookDownload
  bookTitle="Mamo! Tato! Chcę do Kościoła!"
  bookDescription="Praktyczny przewodnik dla rodziców w wychowaniu dzieci do wiary"
  bookCover="/books/Chce-do-kosciola_pomarancz.jpg"
  downloadUrl="https://example.com/book.pdf"
  fileFormat="PDF"
  fileSize="3.2 MB"
/>
    </div>
  </div>
</template>
