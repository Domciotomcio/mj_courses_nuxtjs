<script lang="ts" setup>
import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore' 
import type { Course } from '../../../types/models/course'

const db = useFirestore()
const courses = useCollection<Course>(collection(db, 'courses'))

</script>

<template>
  <div>
    <page-title title="Wszystkie kursy" subtitle="Misja Jonatan - Kursy online" />
    <UBlogPosts :posts="courses" />
  </div>
</template>
