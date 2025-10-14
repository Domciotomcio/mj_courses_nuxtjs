<script setup lang="ts">
import CourseMeetingItem from '~/components/CourseMeetingItem.vue'

interface Meeting { id?: number | string; title?: string; label?: string; description?: string; content?: string; date?: string | number | Date | { seconds: number; nanoseconds: number } }

const props = defineProps<{ meetings?: Meeting[] }>()

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

</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h3>Lista spotkań</h3>
    <div class="m-4">
      <UAccordion type="multiple" :items="props.meetings">
        <template #default="{ item, index, open }">
          <div class="flex items-center justify-between w-full">
            <div class="flex-1 min-w-0 text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
              {{ item?.label || item?.title || `Spotkanie ${index + 1}` }}
            </div>
            <div v-if="item?.date && getDateFromTimestamp(item.date)" class="flex-none ml-4 text-sm text-muted">
              <NuxtTime :datetime="getDateFromTimestamp(item.date)!" locale="pl" day="numeric" month="short" year="numeric" hour="numeric" minute="numeric" />
            </div>
          </div>
        </template>
        <template #content="{ item }">
          <CourseMeetingItem :item="item" />
        </template>
      </UAccordion>
    </div>
  </div>
</template>
