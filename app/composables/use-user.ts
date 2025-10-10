import { useCollection } from 'vuefire'
import { query, where, limit } from 'firebase/firestore'
import { doc, collection } from 'firebase/firestore'


export default function (userId?: string) {
  console.log('Im now in useUser composable with userId:', userId)

  const db = useFirestore()

  const userQuery = query(collection(db, 'users'), where('uid', '==', userId), limit(1))
  const users = useCollection(userQuery)
  const user = computed(() => users.value[0] || null)

  watchEffect(() => {
    if (user.value) {
      console.log('User data loaded:', user.value)
    }
  })

  return user
}