<script setup>
definePageMeta({
  middleware: ['auth'],
})

const courses = [
  { id: 1, title: 'Vue.js Basics', description: 'Learn the fundamentals of Vue.js.' },
  { id: 2, title: 'Nuxt.js Essentials', description: 'Build powerful SSR apps with Nuxt.js.' },
  { id: 3, title: 'JavaScript Advanced', description: 'Deep dive into advanced JS concepts.' }
];
</script>

<template>
  <div>
    <!-- This page correctly has only one single root element -->
    <p>This is page for user: {{ $route.params.id }}</p>
    <h1>Twoje kursy</h1>

    <ul>
      <li v-for="course in courses" :key="course.id">
        <h2>{{ course.title }}</h2>
        <p>{{ course.description }}</p>
      </li>
    </ul>
  </div>
</template>
