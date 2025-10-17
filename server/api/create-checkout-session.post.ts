import { defineEventHandler } from "h3";
import { useServerStripe } from "#stripe/server";
import { useFirebaseAdmin } from "../utils/firebase-admin";

export default defineEventHandler(async (event) => {
  console.log('Creating checkout session...');

  const stripe = await useServerStripe(event);
  const body = await readBody(event)
  console.log('Request body:', body);
  
  const courseId = body.courseId;
  const userUid = body.userUid;

  if (!courseId) {
    throw createError({ statusCode: 400, statusMessage: 'Course ID is required' })
  }

  // Fetch course from Firestore
  const { db } = useFirebaseAdmin();
  const courseDoc = await db.collection('courses').doc(courseId).get();

  if (!courseDoc.exists) {
    throw createError({ statusCode: 404, statusMessage: 'Course not found' })
  }

  const courseData = courseDoc.data();
  console.log('Course data from Firestore:', courseData);

  // Convert price to cents (Stripe expects amounts in smallest currency unit)
  const price = courseData?.price || 0;
  const priceCents = Math.round(price * 100);

  const course = {
    id: courseId,
    title: courseData?.title || 'Kurs',
    priceCents: priceCents
  };

  console.log('Course for Stripe:', course);
  console.log('User UID:', userUid);

  if (priceCents <= 0) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid course price' })
  }

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