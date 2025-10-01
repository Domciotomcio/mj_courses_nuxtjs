import { defineEventHandler, readRawBody } from 'h3'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export default defineEventHandler(async (event) => {
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
    console.log('✅ Payment succeeded for course:', courseId, 'session:', session.id)

    // TODO: Update your database to mark the course as paid for the user
    // Example:
    // await db.courses.update({ paid: true }).where({ id: courseId })
  }

  return { received: true }
})