const functions = require("firebase-functions");
const Stripe = require("stripe");
const { db, serverTimestamp } = require("../config/firebase");

// Initialize Stripe using the environment variable for the secret key.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

/**
 * Processes a payment via Stripe.
 * Expects data: { amount: number, currency: string, metadata: object }
 */
exports.processPayment = functions.https.onCall(async (request) => {
  const { amount, currency, metadata } = request.data;
  if (!amount || !currency) {
    throw new functions.https.HttpsError("invalid-argument", "Missing payment details");
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency,
      metadata
    });
    return { success: true, id: paymentIntent.id };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
