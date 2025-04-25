const functions = require("firebase-functions");
const { db } = require("../config/firebase");
const { Timestamp } = require("firebase-admin/firestore");
// Import order status constants from shared types
const { OrderStatus } = require("../shared/types");

/**
 * Expects request.data to be an object with order details.
 */
exports.placeOrder = functions.https.onCall(async (request) => {
  if (!request.data) {
    throw new functions.https.HttpsError("invalid-argument", "Missing order data");
  }
  if (!request.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be logged in");
  }
  
  const data = request.data;
  const userId = request.auth.uid;
  
  // Generate a simple order number using timestamp
  const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  
  // Create order object (adjust with your real fields)
  const order = {
    orderNumber,
    userId,
    // For simplicity, we assume customerInfo only includes email (extend as needed)
    customerInfo: {
      id: userId,
      email: data.user && data.user.email ? data.user.email : "guest@example.com"
    },
    restaurantId: data.order.restaurantId,
    restaurantName: data.order.restaurantName || "Unknown Restaurant",
    restaurantLocation: data.order.restaurantLocation, // Expected to be a GeoPoint
    items: data.order.items,
    subtotal: data.order.subtotal,
    deliveryFee: data.order.deliveryFee,
    serviceFee: data.order.serviceFee || 0,
    discount: data.order.discount || 0,
    total: data.order.total,
    paymentMethod: data.paymentMethod,
    paymentStatus: "pending",
    status: OrderStatus.PENDING,
    location: data.location, // Expected to be an object with coordinates and address
    specialInstructions: data.order.specialInstructions || "",
    estimatedDelivery: Timestamp.now(),  // Placeholder ETA
    estimatedDeliveryMinutes: 30,          // Placeholder ETA in minutes
    distance: 0,                           // Placeholder distance
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    statusHistory: [{
      status: OrderStatus.PENDING,
      timestamp: Timestamp.now(),
      note: "Order placed"
    }]
  };

  // Write order into Firestore within a transaction
  const orderRef = db.collection("orders").doc();
  await db.runTransaction(async (transaction) => {
    transaction.set(orderRef, order);
    // Optionally update other statistics (restaurant, user, etc.)
  });

  return {
    success: true,
    orderId: orderRef.id,
    orderNumber
  };
});
