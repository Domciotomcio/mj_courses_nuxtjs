<script lang="ts" setup>
import { useRoute } from 'vue-router'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const userId = route.params.id as string

// Get user from composable
const user = useUser(userId)

watchEffect(() => {
  if (user.value) {
    console.log('Loaded user:', user.value)
    console.log('User courses:', user.value.courses)
  }
})
</script>

<template>
  <div>
    <page-title title="Moje kursy" subtitle="Kursy zakupione przez ciebie" />

    <div v-if="user">
      <UBlogPosts v-if="user.courses" :posts="user.courses" />
    </div>
    <div v-else>
      <p>Loading user data...</p>
    </div>
  </div>
</template>
