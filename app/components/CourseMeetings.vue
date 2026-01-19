<script setup lang="ts">
import CourseMeetingItem from '~/components/CourseMeetingItem.vue'

interface Meeting { 
  id?: number | string
  title?: string
  label?: string
  description?: string
  content?: string
  date?: string | number | Date | { seconds: number; nanoseconds: number }
  has_occurred?: boolean
  meeting_url?: string
  video_url?: string
}

const props = defineProps<{ 
  meetings?: Meeting[]
  userView?: boolean // New prop to determine if it's user view
}>()

const slots = useSlots()

watchEffect(() => {
  console.log('Meetings prop changed:', props.meetings)
})

// Convert Firestore timestamp to Date
const getDateFromTimestamp = (date: any): Date | null => {
  if (!date) return null
  // If it's already a Date, return it
  if (date instanceof Date) return date
  // If it's a Firestore timestamp object
  if (date.seconds !== undefined) {
    return new Date(date.seconds * 1000)
  }
  // If it's a number (timestamp)
  if (typeof date === 'number') {
    return new Date(date)
  }
  // If it's a string
  if (typeof date === 'string') {
    return new Date(date)
  }
  return null
}

// Check if meeting can be expanded (has occurred or has no date)
const canExpandMeeting = (meeting: Meeting): boolean => {
  // TODO: REMOVE LATER !!!!
  return true

  // If no date, cannot expand
  if (!meeting.date) return false
  
  const meetingDate = getDateFromTimestamp(meeting.date)
  if (!meetingDate) return false
  
  // Check if meeting has occurred (date is in the past)
  return meetingDate <= new Date()
}

// Process meetings to add disabled state
const processedMeetings = computed(() => {
  return props.meetings?.map(meeting => ({
    ...meeting,
    disabled: !canExpandMeeting(meeting)
  }))
})

</script>

<template>
  <UCard variant="outline" class="w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-md shadow-md hover:shadow-xl transition-shadow duration-300">
    <div class="p-0">
      <UAccordion type="multiple" :items="processedMeetings">
        <template #default="{ item, index, open }">
          <div class="flex space-between w-full" :class="{ 'opacity-50': item.disabled }">
            <div class="flex-1 min-w-0 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {{ item?.label || item?.title || `Spotkanie ${index + 1}` }}
            </div>
            <div v-if="item?.date && getDateFromTimestamp(item.date)" class="flex-none ml-4 text-sm text-muted">
              <NuxtTime :datetime="getDateFromTimestamp(item.date)!" locale="pl" day="numeric" month="short" year="numeric" hour="numeric" minute="numeric" />
            </div>
          </div>
        </template>
        <template #content="{ item }">
          <div class="">
            <!-- Use custom slot content if provided (for user view), otherwise use default CourseMeetingItem -->
            <slot name="content" :item="item">
              <CourseMeetingItem :item="item" />
            </slot>
          </div>
        </template>
      </UAccordion>
    </div>
  </UCard>
</template>
