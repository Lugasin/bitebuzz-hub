const functions = require("firebase-functions");
const { messaging } = require("../config/firebase");
const logger = require("firebase-functions/logger");

/**
 * Expects request.data: { title: string, body: string, data: { token: string, ... } }
 */
exports.sendNotification = functions.https.onCall(async (request) => {
  try {
    const { title, body, data } = request.data;
    const token = data && data.token; // Expect token to be provided here or fetch it separately.
    if (!token) {
      throw new functions.https.HttpsError("invalid-argument", "Missing device token");
    }
    
    const message = {
      token,
      notification: { title, body },
      data: data || {},
      android: {
        priority: "high",
        notification: { sound: "default" }
      },
      apns: {
        payload: { aps: { sound: "default" } }
      }
    };
    
    await messaging.send(message);
    logger.info(`Notification sent to token ${token}`);
    return { success: true };
  } catch (error) {
    logger.error("Notification error:", error);
    throw new functions.https.HttpsError("internal", "Failed to send notification");
  }
});
