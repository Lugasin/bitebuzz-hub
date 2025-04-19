const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { db } = require("../config/firebase");
const { sendNotification } = require("../notifications/notificationServices");

/**
 * Trigger a notification when an order status changes.
 */
exports.orderStatusChanged = onDocumentUpdated({ document: "orders/{orderId}" }, async (event) => {
  const beforeData = event.data?.before.data();
  const afterData = event.data?.after.data();

  if (!beforeData || !afterData || beforeData.status === afterData.status) {
    return;
  }

  const statusMessages = {
    confirmed: "Your order has been confirmed.",
    preparing: "We're preparing your order.",
    ready: "Your order is ready for pickup.",
    in_transit: "Your order is on the way!",
    delivered: "Order delivered! Enjoy your meal.",
    cancelled: "Your order has been cancelled."
  };

  const message = statusMessages[afterData.status];
  if (!message) return;
  
  // Send notification to the user (assumes userId is stored in afterData)
  await sendNotification(afterData.userId, {
    title: "Order Update",
    body: message
  });
});
