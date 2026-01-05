<script setup lang="ts">
interface Props {
  bookTitle?: string
  bookDescription?: string
  bookCover?: string
  downloadUrl?: string
  fileFormat?: string
  fileSize?: string
}

const props = withDefaults(defineProps<Props>(), {
  bookTitle: 'Materiał do pobrania',
  bookDescription: 'Pobierz darmowy materiał w ramach kursu',
  fileFormat: 'PDF',
  fileSize: ''
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
  <div class="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl ring-1 ring-black/10 transition-shadow duration-300">
    <div class="flex flex-col md:flex-row">
      <!-- Left side: Book cover image -->
      <div class="md:w-32 flex-shrink-0 p-2 md:p-3">
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

      <!-- Right side: Content -->
      <div class="flex-1 p-3 pb-10 sm:pb-12">
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ bookTitle }}
          </h3>
          <p v-if="fileFormat || fileSize" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {{ fileFormat }}{{ fileSize ? ` • ${fileSize}` : '' }}
          </p>
        </div>

        <p v-if="bookDescription" class="mt-3 text-sm text-gray-600 dark:text-gray-300">
          {{ bookDescription }}
        </p>

        <!-- Download Button positioned bottom-right -->
        <div class="absolute right-4 bottom-4 sm:right-6 sm:bottom-6">
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
            Niedostępne
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
