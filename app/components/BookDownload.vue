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
    window.open(props.downloadUrl, '_blank')
  }
}
</script>

<template>
  <UCard variant="outline">
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div v-if="bookCover" class="flex-shrink-0">
            <img 
              :src="bookCover" 
              :alt="bookTitle" 
              class="w-12 h-12 rounded-lg object-cover shadow-sm"
            />
          </div>
          <div v-else class="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
            <UIcon name="i-lucide-book-open" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {{ bookTitle }}
            </h3>
            <p v-if="fileFormat || fileSize" class="text-sm text-gray-500 dark:text-gray-400">
              {{ fileFormat }}{{ fileSize ? ` • ${fileSize}` : '' }}
            </p>
          </div>
        </div>
        
        <!-- Download Button -->
        <div class="flex-shrink-0 flex items-end">
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
    </template>
  </UCard>
</template>
