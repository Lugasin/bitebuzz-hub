const functions = require("firebase-functions");
const { db } = require("../config/firebase");
const { serverTimestamp, FieldValue, Timestamp } = require("firebase-admin/firestore");
const { GeoPoint } = require("firebase-admin/firestore");
const { OrderStatus } = require("../shared/types");

/**
 * Expects request.data: { orderId: string, location: { lat, lng }, status?: string }
 */
exports.updateOrderLocation = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Authentication required");
  }
  
  const { orderId, location, status } = request.data;
  const userId = request.auth.uid;
  
  if (!orderId || !location) {
    throw new functions.https.HttpsError("invalid-argument", "Missing orderId or location");
  }
  
  const orderRef = db.doc(`orders/${orderId}`);
  const orderDoc = await orderRef.get();
  
  if (!orderDoc.exists) {
    throw new functions.https.HttpsError("not-found", "Order not found");
  }
  
  const orderData = orderDoc.data();
  
  // Check if the driver is allowed to update the order (for example, orderData.driverId should equal userId)
  if (orderData.driverId !== userId) {
    throw new functions.https.HttpsError("permission-denied", "Not authorized to update this order");
  }
  
  const updateData = {
    "location.coordinates": new GeoPoint(location.lat, location.lng),
    updatedAt: serverTimestamp()
  };
  
  // Update the order status and history if a new status is provided
  if (status && status !== orderData.status) {
    updateData.status = status;
    updateData.statusHistory = FieldValue.arrayUnion({
      status,
      timestamp: serverTimestamp(),
      note: "Status updated by driver"
    });
    if (status === OrderStatus.DELIVERED) {
      updateData.deliveredAt = serverTimestamp();
      // Optionally, update driver document, etc.
    }
  }
  
  await orderRef.update(updateData);
  
  // Dummy ETA calculation; replace this with actual logic as needed.
  const eta = 30;
  
  return { success: true, eta };
});
