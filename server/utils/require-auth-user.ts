import { createError, getHeader, type H3Event } from 'h3'
import { getAuth } from 'firebase-admin/auth'
import { useFirebaseAdmin } from './firebase-admin'

export async function requireAuthenticatedUser(event: H3Event) {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Missing bearer token' })
  }

  const idToken = authHeader.slice('Bearer '.length).trim()
  if (!idToken) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid bearer token' })
  }

  try {
    const { app } = useFirebaseAdmin()
    const decodedToken = await getAuth(app).verifyIdToken(idToken)
    return decodedToken
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
