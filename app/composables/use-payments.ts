import { useCollection } from 'vuefire'
import { collection, query, orderBy } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

/**
 * Fetches payments from user's payments subcollection (users/{userId}/payments)
 * @param userId - The Firestore user document ID
 * @returns VueFire collection reference with real-time updates
 */
export function usePayments(userId: string) {
  const db = useFirestore()
  const paymentsRef = collection(db, 'users', userId, 'payments')
  const paymentsQuery = query(
    paymentsRef,
    orderBy('createdAt', 'desc')
  )
  return useCollection(paymentsQuery)
}
