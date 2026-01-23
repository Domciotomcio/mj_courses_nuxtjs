<script setup lang="ts">
import { useRoute } from 'vue-router'
import { usePayments } from '../../../composables/use-payments'
import { useFirestore, useCollection, useDocument } from 'vuefire'
import { collection, query, where, limit, doc } from 'firebase/firestore'
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Payment } from '../../../../types/models/payment'
import type { Course } from '../../../../types/models/course'

definePageMeta({
  middleware: 'auth'
})

const title = 'Płatności'
const subtitle = 'Historia twoich płatności'

const route = useRoute()
const userUid = route.params.id as string

// Find user document by UID to get document ID for subcollection query
const db = useFirestore()
const userQuery = query(collection(db, 'users'), where('uid', '==', userUid), limit(1))
const users = useCollection(userQuery)
const userDocId = computed(() => users.value[0]?.id)

// Get user's owned courses to check access
const userCourses = computed(() => {
  if (!users.value || users.value.length === 0) return []
  const userData = users.value[0]
  if (!userData) return []
  return userData.courses || []
})

// Create a set of course IDs the user already owns
const ownedCourseIds = computed(() => {
  const ids = new Set<string>()
  userCourses.value.forEach((courseRef: any) => {
    // Handle both DocumentReference and plain ID
    const courseId = courseRef.id || courseRef
    ids.add(courseId)
  })
  return ids
})

// Fetch payments from user's subcollection (users/{userId}/payments)
const paymentsCollection = computed(() => {
  if (userDocId.value) {
    return usePayments(userDocId.value)
  }
  return null
})

// Fetch all courses to map IDs to names
const coursesCollection = useCollection(collection(db, 'courses'))
const coursesMap = computed(() => {
  const map: Record<string, string> = {}
  if (coursesCollection.value) {
    coursesCollection.value.forEach((course: any) => {
      map[course.id] = course.title || course.name || course.id
    })
  }
  return map
})

// Transform Firestore data to properly typed Payment objects with formatting
const paymentsData = computed<Payment[]>(() => {
  const collection = paymentsCollection.value
  if (!collection || !collection.value || !Array.isArray(collection.value)) {
    return []
  }
  
  return collection.value.map((payment: any) => ({
    id: payment.id,
    stripeSessionId: payment.stripeSessionId || payment.id,
    userUid: payment.userUid || userUid,
    courseId: payment.courseId,
    // Handle both old (amount) and new (amountTotal) field names
    amountTotal: payment.amountTotal ?? payment.amount ?? 0,
    currency: payment.currency || 'pln',
    customerEmail: payment.customerEmail || '',
    // Handle both old (status) and new (paymentStatus) field names
    paymentStatus: payment.paymentStatus || payment.status || 'pending',
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    stripePaymentIntentId: payment.stripePaymentIntentId
  }))
})

/**
 * Get course name by ID
 */
const getCourseName = (courseId: string): string => {
  return coursesMap.value[courseId] || courseId
}

/**
 * Format amount from cents to currency with proper decimal places
 */
const formatCurrency = (amountInCents: number, currency: string): string => {
  const amount = amountInCents / 100
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format Firestore timestamp to localized date string
 */
const formatDate = (timestamp: any): string => {
  if (!timestamp) return '-'
  
  // Handle Firestore Timestamp object
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    return timestamp.toDate().toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Handle Date object or string
  try {
    return new Date(timestamp).toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return '-'
  }
}

/**
 * Map payment status to badge color (handles both old and new status values)
 */
const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    paid: 'success',
    succeeded: 'success', // Old value
    pending: 'warning',
    expired: 'error',
    canceled: 'error', // Old value
    failed: 'error'
  }
  return colorMap[status] || 'neutral'
}

/**
 * Get display label for payment status (handles both old and new status values)
 */
const getStatusLabel = (status: string): string => {
  const labelMap: Record<string, string> = {
    paid: 'Opłacone',
    succeeded: 'Opłacone', // Old value
    pending: 'Oczekujące',
    expired: 'Wygasłe',
    canceled: 'Anulowane', // Old value
    failed: 'Nieudane'
  }
  return labelMap[status] || status
}

/**
 * Redirect to complete payment for pending/failed payments
 */
const completePayment = async (payment: Payment) => {
  // For pending payments, redirect to create a new checkout session
  try {
    const response = await $fetch('/api/create-checkout-session', {
      method: 'POST',
      body: {
        courseId: payment.courseId,
        userUid: payment.userUid
      }
    })
    
    if (response.url) {
      window.location.href = response.url
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
  }
}

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

// Define table columns with proper formatting
const columns: TableColumn<Payment>[] = [
  { 
    accessorKey: 'id', 
    header: 'ID', 
    cell: ({ row }) => `#${String(row.getValue('id'))}` 
  },
  { 
    accessorKey: 'createdAt', 
    header: 'Data', 
    cell: ({ row }) => formatDate(row.getValue('createdAt')) 
  },
  { 
    accessorKey: 'courseId', 
    header: 'Kurs',
    cell: ({ row }) => getCourseName(row.getValue('courseId') as string)
  },
  { 
    accessorKey: 'amountTotal', 
    header: 'Kwota', 
    cell: ({ row }) => formatCurrency(
      row.getValue('amountTotal') as number, 
      row.original.currency
    ) 
  },
  { 
    accessorKey: 'paymentStatus', 
    header: 'Status', 
    cell: ({ row }) => {
      const status = row.getValue('paymentStatus') as string
      const payment = row.original
      const courseId = payment.courseId
      
      // Check if user already owns this course
      const alreadyOwned = ownedCourseIds.value.has(courseId)
      
      // Show button ONLY for pending/expired/failed payments AND user doesn't own the course
      if ((status === 'pending' || status === 'expired' || status === 'failed') && !alreadyOwned) {
        return h(UButton, { 
          size: 'xs',
          color: 'primary',
          variant: 'soft',
          onClick: () => completePayment(payment)
        }, () => 'Dokończ płatność')
      }
      
      // Otherwise show badge with actual status
      const color = getStatusColor(status)
      const label = getStatusLabel(status)
      return h(UBadge, { variant: 'subtle', color }, () => label)
    }
  },
  { 
    accessorKey: 'customerEmail', 
    header: 'Email'
  }
]
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <PageTitle :title="title" :subtitle="subtitle" />
    
    <div v-if="paymentsData.length === 0" class="text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">Brak płatności do wyświetlenia</p>
    </div>
    
    <UTable 
      v-else
      :data="paymentsData" 
      :columns="columns" 
      class="flex-1" 
    />
  </div>
</template>