<script setup lang="ts">
interface Props {
  price?: number
  courseId: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  purchase: [courseId: string]
}>()

const user = useCurrentUser()
const router = useRouter()

function handlePurchase() {
  // Check if user is logged in
  if (!user.value) {
    // Redirect to login page with return URL
    router.push({
      path: '/login',
      query: { redirect: `/courses/${props.courseId}` }
    })
    return
  }
  
  // User is logged in, proceed with purchase
  emit('purchase', props.courseId)
}
</script>

<template>
  <div class="w-full bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
    <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
      <span class="text-lg font-semibold text-gray-700 dark:text-gray-300">Cena za kurs:</span>
      <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
        {{ price || 'Jeszcze nie ustalona' }} zł
      </span>
    </div>
    <div class="flex justify-end">
      <UButton 
        @click="handlePurchase" 
        size="xl"
        trailing
      >
        Dołączam do kursu
      </UButton>
    </div>
  </div>
</template>
