<script lang="ts" setup>
import PageTitle from '~/components/PageTitle.vue';
import { collection, doc } from 'firebase/firestore';

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const courseId = route.params.courseId as string

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

    <div class="container mx-auto px-4 py-8 prose dark:prose-invert max-w-none">
      <p class="text-lg">
        Cieszymy się, że chcesz wyruszyć z nami w tę drogę odkrywania, jak prowadzić dzieci ku dojrzałej i autentycznej wierze.
      </p>
      
      <p>
        To przestrzeń, w której możesz zatrzymać się, posłuchać, podzielić doświadczeniem i pozwolić, by Bóg działał w Twoim rodzicielstwie.
      </p>

      <p class="font-semibold">Poniżej znajdziesz:</p>
      <ul>
        <li>nagrania minionych spotkań,</li>
        <li>terminy kolejnych sesji na żywo,</li>
        <li>materiały dodatkowe.</li>
      </ul>

      <p>
        Zachęcamy, byś uczestniczył w spotkaniach <strong>aktywnie</strong> – notuj swoje myśli, pytania, poruszenia serca. 
        Możesz też wracać do nagrań w dowolnym momencie, w rytmie swojego życia rodzinnego.
      </p>

      <UAlert
        color="primary"
        variant="soft"
        title="Niech ten kurs stanie się dla Ciebie przestrzenią spotkania z Bogiem, odnowienia wiary i odkrycia radości rodzicielstwa, które prowadzi do Niego."
        class="my-6"
      />

      <UCard class="bg-primary-50 dark:bg-primary-950/20 border-l-4 border-primary-500">
        <p class="italic text-base">
          „Młody człowiek doświadczony miłością Bożą, powołaniem i misją, wsparty mądrością dorosłych, 
          może wydobyć z siebie najpiękniejsze skarby Bożej łaski."
        </p>
      </UCard>
    </div>

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
