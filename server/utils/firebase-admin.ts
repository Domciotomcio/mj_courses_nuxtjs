import { initializeApp, getApps, cert, type App, applicationDefault } from 'firebase-admin/app'
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
        // Option 1: Use GOOGLE_APPLICATION_CREDENTIALS file path (recommended)
        const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS
        
        if (credentialsPath) {
          console.log('Initializing Firebase Admin with credentials file:', credentialsPath)
          const serviceAccount = JSON.parse(
            readFileSync(resolve(process.cwd(), credentialsPath), 'utf-8')
          )
          adminApp = initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID || 'mj-courses'
          })
        }
        // Option 2: Use service account JSON string from env (must be valid JSON string)
        else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
          console.log('Initializing Firebase Admin with service account from env')
          const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
          adminApp = initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID || 'mj-courses'
          })
        }
        // Option 3: Use application default credentials (for Cloud environments)
        else if (process.env.NODE_ENV === 'production') {
          console.log('Initializing Firebase Admin with application default credentials')
          adminApp = initializeApp({
            credential: applicationDefault(),
            projectId: process.env.FIREBASE_PROJECT_ID || 'mj-courses'
          })
        }
        // Option 4: Minimal setup for development (less secure, for local only)
        else {
          console.warn('⚠️  No Firebase Admin credentials found. Using minimal setup.')
          console.warn('For production, please set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT')
          
          adminApp = initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || 'mj-courses'
          })
        }
        
        console.log('✅ Firebase Admin initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Firebase Admin:', error)
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
