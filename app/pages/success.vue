<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = route.params.userId
</script>

<template>
    <div>
        <div class="max-w-md mx-auto">
            <u-card>
                <template #header>
                    <h2 class="text-lg font-bold">Płatność</h2>
                </template>

                <p class="text-green-700">Płatność zakończona sukcesem! Dziękujemy.</p>

                <template #footer>
                    <NuxtLink :to="`/users/${userId}/courses`">
                        <UButton color="primary" variant="outline" class="w-full">Przejdź do swoich kursów</UButton>
                    </NuxtLink>
                </template>  </u-card>
        </div>
    </div>
</template>