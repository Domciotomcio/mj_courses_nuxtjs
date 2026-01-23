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
  if (stripeEvent.type === 'checkout.session.completed' || stripeEvent.type === 'checkout.session.expired' || stripeEvent.type === 'checkout.session.async_payment_failed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session
    const courseId = session.metadata?.courseId
    const userUid = session.metadata?.userUid
    const sessionId = session.id
    
    // Map Stripe event types to payment statuses
    let paymentStatus: 'paid' | 'expired' | 'failed' | 'pending' = 'pending'
    if (stripeEvent.type === 'checkout.session.completed') paymentStatus = 'paid'
    if (stripeEvent.type === 'checkout.session.expired') paymentStatus = 'expired'
    if (stripeEvent.type === 'checkout.session.async_payment_failed') paymentStatus = 'failed'

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
      
      // Check if there's an existing pending payment for this user+course combination
      const existingPaymentsSnapshot = await userDoc.ref.collection('payments')
        .where('courseId', '==', courseId)
        .where('paymentStatus', 'in', ['pending', 'expired', 'failed'])
        .get()
      
      // Prepare payment data
      const paymentData = {
        stripeSessionId: sessionId,
        userUid,
        courseId,
        amountTotal: session.amount_total || 0,
        currency: session.currency || 'pln',
        customerEmail: session.customer_details?.email || session.customer_email || '',
        paymentStatus,
        updatedAt: new Date(),
        stripePaymentIntentId: session.payment_intent as string | undefined
      }
      
      // If there's an existing pending payment, update it instead of creating new one
      if (!existingPaymentsSnapshot.empty && paymentStatus === 'paid') {
        const existingPaymentDoc = existingPaymentsSnapshot.docs[0]
        await existingPaymentDoc.ref.update({
          ...paymentData,
          createdAt: existingPaymentDoc.data().createdAt // Preserve original creation date
        })
        console.log(`✅ Updated existing payment ${existingPaymentDoc.id} to ${paymentStatus} (new session: ${sessionId})`)
      } else {
        // Create new payment record with sessionId as document ID
        await userDoc.ref.collection('payments').doc(sessionId).set({
          ...paymentData,
          createdAt: new Date()
        }, { merge: true })
        console.log(`✅ Payment record created: ${sessionId} with status: ${paymentStatus}`)
      }

      // If payment succeeded, add course reference to user's courses array (avoid duplicates)
      if (paymentStatus === 'paid') {
        const userData = userDoc.data()
        const courseDocRef = db.collection('courses').doc(courseId)
        const currentCourses = userData.courses || []
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
      }
    } catch (error) {
      console.error('Error updating user payment/courses:', error)
      return { received: true, error: 'Failed to update user' }
    }
  }

  return { received: true }
})