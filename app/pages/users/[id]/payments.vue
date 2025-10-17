<script setup lang="ts">

definePageMeta({
  middleware: 'auth'
})

const title = 'Płatności'
const subtitle = 'Historia twoich płatności'


import { useRoute } from 'vue-router'
import { usePayments } from '../../../composables/use-payments'
import { useFirestore, useCollection } from 'vuefire'
import { collection, query, where, limit } from 'firebase/firestore'
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'

const route = useRoute()

const userUid = route.params.id as string
const db = useFirestore()
const userQuery = query(collection(db, 'users'), where('uid', '==', userUid), limit(1))
const users = useCollection(userQuery)
const userDocId = computed(() => users.value[0]?.id)

import { computed } from 'vue'
import type { Payment } from '../../../../types/models/payment'

const paymentsData = computed(() => {
  if (userDocId.value) {
    return usePayments(userDocId.value)
  }
  return null
})

const paymentsRef = computed<Payment[]>(() => {
  const data = paymentsData.value
  if (data && Array.isArray(data.value)) {
    return data.value as Payment[]
  }
  return []
})

const UBadge = resolveComponent('UBadge')

const columns: TableColumn<any>[] = [
  { accessorKey: 'id', header: 'ID', cell: ({ row }) => `#${row.getValue('id')}` },
  { accessorKey: 'createdAt', header: 'Data', cell: ({ row }) => new Date(row.getValue('createdAt')).toLocaleString('pl-PL') },
  { accessorKey: 'courseId', header: 'Kurs' },
  { accessorKey: 'amount', header: 'Kwota', cell: ({ row }) => `${(Number(row.getValue('amount'))/100).toFixed(2)} zł` },
  { accessorKey: 'currency', header: 'Waluta' },
  { accessorKey: 'status', header: 'Status', cell: ({ row }) => {
    const color = ({
      succeeded: 'success',
      pending: 'warning',
      canceled: 'error',
      failed: 'error'
  })[String(row.getValue('status'))] || 'neutral'
    return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => row.getValue('status'))
  }}
]
</script>

<template>
    <PageTitle :title="title" :subtitle="subtitle" />
  <UTable :data="paymentsRef" :columns="columns" class="flex-1" />
</template>