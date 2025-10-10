import { defineEventHandler, readRawBody } from 'h3'
import Stripe from 'stripe'
import { computed } from 'vue'
import { useFirestore, useCollection } from 'vuefire'
import { query, where, limit, doc, collection, updateDoc, arrayUnion } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

// To use it:
// copy the webhook secret to .env as STRIPE_WEBHOOK_SECRET
// stripe login
// stripe listen --forward-to localhost:3000/api/webhook

export default defineEventHandler(async (event) => {
  console.log('Received Stripe webhook event -\-\-\\-\-\-\-\\-\-\-\-\\-\-\-\-\\-\-\-\-\\-\-\-\-\\-\-\-\-\\-\-\-\-\\-\-\-')

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

    // TODO: Fix initializeApp error "Firebase App named '[DEFAULT]' already exists"
    const db = useFirestore()
    const userQuery = query(collection(db, 'users'), where('uid', '==', userUid), limit(1))
    const users = useCollection(userQuery)
    const user = computed(() => users.value[0] || null)

    // add to user.courses the refference to the courseId
    if (user.value) {
      const userRef = doc(db, 'users', user.value.id)
      await updateDoc(userRef, {
        courses: arrayUnion(courseId)
      })
      console.log(`Course ${courseId} added to user ${user.value.id}`)
    } else {
      console.error('User not found for session:', session.id)
    }

    // TODO: Update your database to mark the course as paid for the user
    // Example:
    // await db.courses.update({ paid: true }).where({ id: courseId })
  }

  return { received: true }
})