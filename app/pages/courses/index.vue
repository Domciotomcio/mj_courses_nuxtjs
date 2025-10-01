<script setup>

const courses = [
  { id: 1, title: 'Wychowanie dzieci do wiary', image_name: "course1.jpg", description: 'Learn the fundamentals of Vue.js.' },
  { id: 2, title: 'BÓG MÓWI. SŁUCHAJ GO.', image_name: "course2.jpg", description: 'Build powerful SSR apps with Nuxt.js.' },
  { id: 3, title: 'Trzeci kurs', image_name: "course3.jpg", description: 'Deep dive into advanced JS concepts.' }
];

const viewCourse = (courseId) => {
  // Logic to view the course details
  console.log(`Viewing course with ID: ${courseId}`);

  navigateTo(`/courses/${courseId}`);
};

</script>

<template>
  <div>
    <page-title title="Wszystkie kursy" subtitle="Misja Jonatan - Kursy online" />

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
