import { initializeApp, getApps, cert, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'
import { readFileSync } from 'fs'
import { resolve } from 'path'

let adminApp: App
let adminDb: Firestore

export function useFirebaseAdmin() {
  if (!adminApp) {
    // Initialize Firebase Admin only once
    const apps = getApps()
    
    if (apps.length === 0) {
      try {
        const config = useRuntimeConfig()
        
        // Option 1: Use FIREBASE_SERVICE_ACCOUNT from runtime config (Vercel)
        if (config.firebaseServiceAccount) {
          console.log('Initializing Firebase Admin with service account from runtime config')
          const serviceAccount = JSON.parse(config.firebaseServiceAccount)
          adminApp = initializeApp({
            credential: cert(serviceAccount),
            projectId: config.firebaseProjectId || 'mj-courses'
          })
        }
        // Option 2: Use local service account file (development)
        else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
          console.log('Initializing Firebase Admin with credentials file:', process.env.GOOGLE_APPLICATION_CREDENTIALS)
          const serviceAccount = JSON.parse(
            readFileSync(resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS), 'utf-8')
          )
          adminApp = initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID || 'mj-courses'
          })
        }
        // Option 3: Try loading serviceAccountKey.json directly (fallback for dev)
        else {
          console.log('Attempting to load serviceAccountKey.json from project root')
          try {
            const serviceAccount = JSON.parse(
              readFileSync(resolve(process.cwd(), 'serviceAccountKey.json'), 'utf-8')
            )
            adminApp = initializeApp({
              credential: cert(serviceAccount),
              projectId: serviceAccount.project_id || 'mj-courses'
            })
          } catch (fileError) {
            throw new Error(
              'No Firebase Admin credentials found. Please set FIREBASE_SERVICE_ACCOUNT environment variable ' +
              'or create serviceAccountKey.json in the project root.'
            )
          }
        }
        
        console.log('✅ Firebase Admin initialized successfully')
      } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin:', error)
        throw error
      }
    } else {
      adminApp = apps[0]
    }
  }

  if (!adminDb) {
    adminDb = getFirestore(adminApp)
  }

  return { app: adminApp, db: adminDb }
}
