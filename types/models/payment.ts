export interface Payment {
  id: string // Stripe payment intent or session ID
  courseId: string
  amount: number
  currency: string
  status: 'pending' | 'succeeded' | 'canceled' | 'failed'
  createdAt: Date | string
  updatedAt: Date | string
  stripeSessionId?: string
  stripePaymentIntentId?: string
}
