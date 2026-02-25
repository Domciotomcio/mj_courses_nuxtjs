import { doc, getDoc } from 'firebase/firestore'

export default defineNuxtRouteMiddleware(async () => {
  const user = await getCurrentUser()

  if (!user) {
    return navigateTo('/login')
  }

  const db = useFirestore()
  const userSnapshot = await getDoc(doc(db, 'users', user.uid))
  const role = userSnapshot.data()?.role

  const runtimeConfig = useRuntimeConfig()
  const adminEmailsRaw = runtimeConfig.public.adminEmails
  const adminEmails = Array.isArray(adminEmailsRaw)
    ? adminEmailsRaw
    : String(adminEmailsRaw || '')
        .split(',')
        .map(email => email.trim())
        .filter(Boolean)

  const isAllowedByRole = role === 'admin'
  const isAllowedByEmail = !!user.email && adminEmails.includes(user.email)

  if (!isAllowedByRole && !isAllowedByEmail) {
    return navigateTo('/courses')
  }
})
