<script lang="ts" setup>
import PageTitle from '~/components/PageTitle.vue';

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
    <PageTitle :title="pageTitle" :subtitle="pageSubtitle" />


    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel id sapiente, dolorem doloremque pariatur excepturi corrupti error. Suscipit ad, aspernatur, perspiciatis atque sit consequuntur, accusamus ducimus inventore incidunt cum exercitationem?
  
    <u-accordion :items="meetings" class="my-4" />
  </div>
</template>
