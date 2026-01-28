<script lang="ts" setup>
import { useCollection } from 'vuefire'
import { collection, doc, orderBy, query } from 'firebase/firestore'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const db = useFirestore()
const courseId = route.params.courseId as string
const userId = route.params.id as string

// Load course from Firestore
const course = useDocument(doc(collection(db, 'courses'), courseId))

// Meetings are stored in a subcollection under the course
const meetings = useCollection(
  query(collection(db, 'courses', courseId, 'meetings'), orderBy('index', 'asc'))
)

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

// Convert Firestore timestamp to Date
const getDateFromTimestamp = (date: any): Date | null => {
  if (!date) return null
  if (date instanceof Date) return date
  if (date.seconds !== undefined) {
    return new Date(date.seconds * 1000)
  }
  if (typeof date === 'number') {
    return new Date(date)
  }
  if (typeof date === 'string') {
    return new Date(date)
  }
  return null
}

// Find the next upcoming meeting
const nextMeeting = computed(() => {
  if (!meetings.value?.length) return null

  const now = new Date()
  const upcomingMeetings = meetings.value
    .map(meeting => ({ ...meeting, parsedDate: getDateFromTimestamp(meeting.date) }))
    .filter(meeting => meeting.parsedDate && meeting.parsedDate > now)
    .sort((a, b) => (a.parsedDate?.getTime() || 0) - (b.parsedDate?.getTime() || 0))

  return upcomingMeetings[0] || null
})

const meetingDate = (meeting: any) => getDateFromTimestamp(meeting?.date)
const meetingUrl = (meeting: any) => meeting?.meeting_url || course.value?.meeting_url || ''

// Debug
watchEffect(() => {
  console.log('Meetings collection:', meetings.value)
  console.log('Course meeting_url fallback:', course.value?.meeting_url)
  console.log('Next meeting:', nextMeeting.value)
})
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

    <!-- Next Meeting Section -->
    <NextMeetingSection 
      v-if="nextMeeting && meetingUrl(nextMeeting)" 
      :meeting="nextMeeting" 
      :meetingUrl="meetingUrl(nextMeeting)" 
    />

    <div>
      <h3>Lista spotkań</h3>

      <CourseMeetings :meetings="meetings">
        <template #content="{ item }">
          <template v-if="item!.has_occurred === false">
            
            <div class="flex items-start">
              
              <div class="pb-3.5 text-sm text-muted flex-1 mr-4">
                <p v-if="meetingDate(item)" class="mb-4">Data spotkania: <NuxtTime :datetime="meetingDate(item)!" /></p>
                <p v-else class="mb-4">Data spotkania: wkrótce</p>
                <p>{{ item?.description }}</p>
              </div>
              <div v-if="meetingUrl(item)" class="flex-shrink-0 pb-3.5">
                <UButton :href="meetingUrl(item)" target="_blank">
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
      <!--Course book name-->
      <h1>{{ course?.book?.name }}</h1>

      <BookDownload
        v-if="course?.book?.name"
        :bookTitle="course?.book?.name"
        :bookDescription="course?.book?.description"
        :bookCover="course?.book?.cover_image"
        :downloadUrl="`/books/${course.book.pdf_name}`"
        :fileFormat="course?.book?.file_format"
        :fileSize="course?.book?.file_size"
      />
    </div>
  </div>
</template>
