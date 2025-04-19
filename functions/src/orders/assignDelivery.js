const functions = require("firebase-functions");
const { db, serverTimestamp } = require("../config/firebase");

/**
 * Expects request.data: { orderId: string, driverId: string }
 */
exports.assignDelivery = functions.https.onCall(async (request) => {
  const { orderId, driverId } = request.data;
  
  if (!orderId || !driverId) {
    throw new functions.https.HttpsError("invalid-argument", "Missing orderId or driverId");
  }
  
  const orderRef = db.doc(`orders/${orderId}`);
  await orderRef.update({
    driverId,
    updatedAt: serverTimestamp()
  });
  
  return { success: true, message: "Delivery assigned successfully" };
});
