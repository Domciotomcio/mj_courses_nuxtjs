import { useCollection } from 'vuefire'
import { collection } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

export function usePayments(userId: string) {
  const db = useFirestore()
  const paymentsRef = collection(db, 'users', userId, 'payments')
  return useCollection(paymentsRef)
}
