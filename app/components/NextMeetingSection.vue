<script setup lang="ts">
interface Meeting {
  id?: number | string
  title?: string
  label?: string
  name?: string
  description?: string
  date?: string | number | Date | { seconds: number; nanoseconds: number }
  has_occurred?: boolean
  meeting_url?: string
  video_url?: string
}

interface Props {
  meeting: Meeting
  meetingUrl: string
}

const props = defineProps<Props>()

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
</script>

<template>
  <div class="mb-8">
    <UCard class="backdrop-blur-sm bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 shadow-xl border border-primary-200 dark:border-primary-800">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <UIcon name="i-lucide-calendar-clock" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Najbliższe spotkanie
            </h3>
          </div>
          <p class="text-base font-medium text-gray-800 dark:text-gray-200 mb-2">
            {{ meeting.label || meeting.title || meeting.name }}
          </p>
          <p v-if="meeting.description" class="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {{ meeting.description }}
          </p>
          <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <UIcon name="i-lucide-clock" class="w-4 h-4" />
            <NuxtTime 
              v-if="getDateFromTimestamp(meeting.date)" 
              :datetime="getDateFromTimestamp(meeting.date)!" 
              locale="pl" 
              day="numeric" 
              month="long" 
              year="numeric" 
              hour="numeric" 
              minute="numeric" 
            />
          </div>
        </div>
        <div class="flex-shrink-0">
          <UButton
            :href="meetingUrl"
            target="_blank"
            size="xl"
            color="primary"
            icon="i-lucide-video"
          >
            Dołącz do spotkania
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>
