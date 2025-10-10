<script lang="ts" setup>
import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore' 
import type { Course } from '../../../types/models/course'

const db = useFirestore()
const courses = useCollection<Course>(collection(db, 'courses'))


const courses2: Course[] = [
  { id: '1', title: 'Wychowanie dzieci do wiary', image_name: "course1.jpg", description: 'Learn the fundamentals of Vue.js.' },
  { id: '2', title: 'BÓG MÓWI. SŁUCHAJ GO.', image_name: "course2.jpg", description: 'Build powerful SSR apps with Nuxt.js.' },
  { id: '3', title: 'Trzeci kurs', image_name: "course3.jpg", description: 'Deep dive into advanced JS concepts.' },
  { id: '1', title: 'Wychowanie dzieci do wiary', image_name: "course1.jpg", description: 'Learn the fundamentals of Vue.js.' },
  { id: '2', title: 'BÓG MÓWI. SŁUCHAJ GO.', image_name: "course2.jpg", description: 'Build powerful SSR apps with Nuxt.js.' },
  { id: '3', title: 'Trzeci kurs', image_name: "course3.jpg", description: 'Deep dive into advanced JS concepts.' },
  { id: '1', title: 'Wychowanie dzieci do wiary', image_name: "course1.jpg", description: 'Learn the fundamentals of Vue.js.' },
  { id: '2', title: 'BÓG MÓWI. SŁUCHAJ GO.', image_name: "course2.jpg", description: 'Build powerful SSR apps with Nuxt.js.' },
  { id: '3', title: 'Trzeci kurs', image_name: "course3.jpg", description: 'Deep dive into advanced JS concepts.' },
  { id: '1', title: 'Wychowanie dzieci do wiary', image_name: "course1.jpg", description: 'Learn the fundamentals of Vue.js.' },
  { id: '2', title: 'BÓG MÓWI. SŁUCHAJ GO.', image_name: "course2.jpg", description: 'Build powerful SSR apps with Nuxt.js.' },
  { id: '3', title: 'Trzeci kurs', image_name: "course3.jpg", description: 'Deep dive into advanced JS concepts.' }
];

function viewCourse(courseId: string) {
  // Logic to view the course details
  console.log(`Viewing course with ID: ${courseId}`);

  navigateTo(`/courses/${courseId}`);
};

const posts = ref([
  {
    title: 'Nuxt Icon v1',
    description: 'Discover Nuxt Icon v1!',
    image: '/public/courses/image1.jpg',
    date: '2024-11-25'
  },
  {
    title: 'Nuxt 3.14',
    description: 'Nuxt 3.14 is out!',
    image: 'https://nuxt.com/assets/blog/v3.14.png',
    date: '2024-11-04'
  },
])

</script>

<template>
  <div>
    <page-title title="Wszystkie kursy" subtitle="Misja Jonatan - Kursy online" />
    <UBlogPosts :posts="courses" />
  </div>
</template>
