<script setup lang="ts">
interface Props {
  bookTitle?: string
  bookDescription?: string
  bookCover?: string
  downloadUrl?: string
  fileFormat?: string
  fileSize?: string
  is_finished?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  bookTitle: 'Materiał do pobrania',
  bookDescription: 'Pobierz darmowy materiał w ramach kursu',
  fileFormat: 'PDF',
  fileSize: '',
  is_finished: false
})

const handleDownload = () => {
  if (props.downloadUrl) {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a')
    link.href = props.downloadUrl
    link.download = props.downloadUrl.split('/').pop() || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<template>
  <UCard
    class="shadow-md hover:shadow-xl transition-shadow duration-300"
    :variant="'soft'"
    :ui="{ root: 'ring-1 ring-black/10 dark:ring-white/10 p-0' }"
  >
    <div class="flex flex-col md:flex-row items-start gap-4 p-4">
      <div class="md:w-32 w-24 flex-shrink-0">
        <img
          v-if="bookCover"
          :src="`/books/${bookCover}`"
          :alt="bookTitle"
          class="w-full h-auto rounded-lg object-cover shadow-sm"
        />
        <div v-else class="w-full aspect-[3/4] bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
          <UIcon name="i-lucide-book-open" class="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
      </div>

      <div class="flex-1 min-w-0 space-y-3">
        <div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {{ bookTitle }}
          </h3>
          <p v-if="fileFormat || fileSize" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ fileFormat }}{{ fileSize ? ` • ${fileSize}` : '' }}
          </p>
        </div>

        <p v-if="bookDescription" class="text-sm text-gray-600 dark:text-gray-300">
          {{ bookDescription }}
        </p>

        <div class="flex justify-end">
          <template v-if="is_finished">
            <UButton
              v-if="downloadUrl"
              @click="handleDownload"
              color="primary"
              size="md"
              icon="i-lucide-download"
            >
              Pobierz
            </UButton>
            <UButton
              v-else
              color="neutral"
              size="md"
              icon="i-lucide-lock"
              disabled
            >
              Brak pliku
            </UButton>
          </template>
          <template v-else>
            <UAlert
              title="Książka będzie dostępna po zakończeniu kursu"
              color="neutral"
              icon="i-lucide-clock"
              variant="subtle"
              class="w-full"
            />
          </template>
        </div>
      </div>
    </div>
  </UCard>
</template>
