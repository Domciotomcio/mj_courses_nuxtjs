<script lang="ts" setup>
import PageTitle from '~/components/PageTitle.vue';
import { collection, doc } from 'firebase/firestore';

const route = useRoute()
const courseId = route.params.id as string

const db = useFirestore()
const course = useDocument(doc(collection(db, 'courses'), courseId))


const pageTitle = 'Szczegóły kursu'
const pageSubtitle = 'Tutaj znajdziesz wszystkie informacje o kursie'

const meetings = [
  { id: 1, title: 'Spotkanie 1', label: 'Spotkanie 1', content: 'Content for meeting 1' },
  { id: 2, title: 'Spotkanie 2', label: 'Spotkanie 2', content: 'Content for meeting 2' },
  { id: 3, title: 'Spotkanie 3', label: 'Spotkanie 3', content: 'Content for meeting 3' }
];
</script>

<template>
  <div>
    <PageTitle :title="course?.title" :subtitle="course?.subtitle" />

    <p>{{ course?.long_description }}</p>

    <div class="mt-8"></div>

    <div>
      <h1>Lista spotkań</h1>
      <UAccordion type="multiple" :items="course?.meetings">
        <template #content="{ item }">
          <template v-if="item!.has_occurred === false">
            
            <div class="flex items-start">
              
              <div class="pb-3.5 text-sm text-muted flex-1 mr-4">
                <p class="mb-4">Data spotkania: <NuxtTime :datetime="Date.now()" /></p>
                <p>{{ item?.description }}</p>
              </div>
              <div class="flex-shrink-0 pb-3.5">
                <UButton :href="item!.meeting_url" target="_blank">
                  <UIcon name="i-lucide-presentation" />
                  Dołącz do spotkania
                </UButton>
              </div>
            </div>

          </template>
          <template v-else>
            <p class="pb-3.5 text-sm text-muted">
              {{ item?.description }}
            </p>

            <div style="display: flex; justify-content: center;">
              <iframe v-if="item!.video_url" :src="`https://www.youtube.com/embed/${item!.video_url.split('v=')[1]}`"
                width="560" height="315" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            </div>

          </template>
        </template>
      </UAccordion>
    </div>

    <div class="mt-8"></div>

    <div>
      <h1>Dodatkowe materiały</h1>
      <div class="mt-4"></div>
      <UCard>
        <template #header>
          <p>Książka</p>
          </template>

        
      </UCard>
    </div>
  </div>
</template>
