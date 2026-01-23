export interface Payment {
  id: string // Firestore document ID (matches Stripe session ID)
  stripeSessionId: string // Stripe checkout session ID
  userUid: string // Firebase user UID
  courseId: string // Course document ID
  amountTotal: number // Amount in cents
  currency: string // Currency code (e.g., 'pln', 'usd')
  customerEmail: string // Customer email from Stripe
  paymentStatus: 'paid' | 'expired' | 'failed' | 'pending' // Mapped from Stripe event
  createdAt: Date | string | any // Server timestamp
  updatedAt?: Date | string | any // Optional update timestamp
  stripePaymentIntentId?: string // Optional payment intent ID
}
