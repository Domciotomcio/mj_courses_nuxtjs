<script setup>

const courses = [
  { id: 1, title: 'Vue.js Basics', description: 'Learn the fundamentals of Vue.js.' },
];

</script>

<template>
  <div>
    <page-title title="Moje kursy" subtitle="Kursy zakupione przez ciebie" />


    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="course in courses" :key="course.id">
        <UCard>
          <template #header>
            <h2 class="text-lg font-bold">{{ course.title }}</h2>
          </template>

          <img :src="`/courses/${course.image_name}`" :alt="course.title" class="w-full h-48 object-cover mb-4" />
          <p class="text-gray-700">{{ course.description }}</p>

          <template #footer>
            <UButton color="primary" variant="outline" class="w-full" @click="viewCourse(course.id)">Zobacz kurs</UButton>
          </template>
        </UCard>
      </div>
    </div>

  </div>
</template>
