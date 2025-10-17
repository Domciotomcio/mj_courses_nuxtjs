import { defineEventHandler, readRawBody } from 'h3'
import Stripe from 'stripe'
import { useFirebaseAdmin } from '../utils/firebase-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

// To use it:
// copy the webhook secret to .env as STRIPE_WEBHOOK_SECRET
// stripe login
// stripe listen --forward-to localhost:3000/api/webhook

export default defineEventHandler(async (event) => {
  console.log('Received Stripe webhook event ----------------------')

  const body = await readRawBody(event) // must use raw body for signature verification
  const sig = event.node.req.headers['stripe-signature'] as string

  let stripeEvent: Stripe.Event
  try {
    stripeEvent = stripe.webhooks.constructEvent(body as string, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return { status: 400, message: 'Invalid signature' }
  }

  // Handle checkout session completion
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session
    const courseId = session.metadata?.courseId
    const userUid = session.metadata?.userUid
    console.log('✅ Payment succeeded for course:', courseId, 'session:', session.id)

    if (!courseId || !userUid) {
      console.error('Missing courseId or userUid in session metadata')
      return { received: true, error: 'Missing metadata' }
    }

    try {
      // Use Firebase Admin SDK for server-side operations
      const { db } = useFirebaseAdmin()
      
      // Query users collection to find the user by uid
      const usersSnapshot = await db.collection('users')
        .where('uid', '==', userUid)
        .limit(1)
        .get()

      if (usersSnapshot.empty) {
        console.error('User not found for uid:', userUid)
        return { received: true, error: 'User not found' }
      }

      // Get the user document
      const userDoc = usersSnapshot.docs[0]
      const userData = userDoc.data()
      
      // Create Firestore document reference to the course
      const courseDocRef = db.collection('courses').doc(courseId)
      
      // Add course reference to user's courses array (avoid duplicates)
      const currentCourses = userData.courses || []
      
      // Check if course reference already exists by comparing paths
      const courseRefExists = currentCourses.some((ref: any) => 
        ref.path === courseDocRef.path || ref.id === courseId
      )
      
      if (!courseRefExists) {
        await userDoc.ref.update({
          courses: [...currentCourses, courseDocRef]
        })
        console.log(`✅ Course reference ${courseDocRef.path} added to user ${userDoc.id}`)
      } else {
        console.log(`ℹ️  Course reference already exists for user ${userDoc.id}`)
      }
      
    } catch (error) {
      console.error('Error updating user courses:', error)
      return { received: true, error: 'Failed to update user' }
    }
  }

  return { received: true }
})