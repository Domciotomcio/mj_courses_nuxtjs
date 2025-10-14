import { defineEventHandler } from "h3";
import { useServerStripe } from "#stripe/server";

  const courses = [
  { id: "UYmphsTDzCSCmUxtzBxT", title: 'Wychowanie dzieci do wiary', priceCents: 32000 },
]

export default defineEventHandler(async (event) => {
  // Create a PaymentIntent with the amount, currency, and a payment method type.
  //
  // See the documentation [0] for the full list of supported parameters.
  //
  // [0] https://stripe.com/docs/api/payment_intents/create
  console.log('Creating checkout session...');

  const stripe = await useServerStripe(event);
  const body = await readBody(event)
  console.log('Request body:', body);
  const course = courses.find(c => c.id === body.courseId);
  const userUid = body.userUid;

  console.log('Creating checkout session... 2');
  console.log('Course:', course);
  console.log('User UID:', userUid);

  if (!course) throw createError({ statusCode: 404, statusMessage: 'Course not found' })

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'p24'],
    line_items: [{
      price_data: {
        currency: 'pln',
        product_data: { name: course.title },
        unit_amount: course.priceCents,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/cancel',
     metadata: { courseId: course.id, userUid: userUid },
  })

  return { url: session.url }
});