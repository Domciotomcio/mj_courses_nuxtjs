<script setup lang="ts">

definePageMeta({
  middleware: 'auth'
})

const title = 'Płatności'
const subtitle = 'Historia twoich płatności'

const data = ref([
  {
    id: '4600',
    data: '2024-03-11T15:30:00',
    status: 'paid',
    kwota: 594
  },
  {
    id: '4599',
    data: '2024-03-11T10:10:00',
    status: 'failed',
    email: 'mia.white@example.com',
    kwota: 276
  },
  {
    id: '4598',
    data: '2024-03-11T08:50:00',
    status: 'refunded',
    kwota: 315
  },
  {
    id: '4597',
    data: '2024-03-10T19:45:00',
    status: 'paid',
    kwota: 529
  },
  {
    id: '4596',
    data: '2024-03-10T15:55:00',
    status: 'paid',
    kwota: 639
  }
])
</script>

<template>
    <PageTitle :title="title" :subtitle="subtitle" />
  <UTable :data="data" class="flex-1" />
</template>