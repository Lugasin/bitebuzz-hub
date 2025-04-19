const functions = require("firebase-functions");
const { db, serverTimestamp } = require("../config/firebase");
const { FieldValue } = require("firebase-admin/firestore");

/**
 * Processes a wallet transaction.
 * Expects data: { userId: string, amount: number, type: "credit"|"debit", reference: string }
 */
exports.walletTransaction = functions.https.onCall(async (request) => {
  if (!request.data) {
    throw new functions.https.HttpsError("invalid-argument", "Missing transaction data");
  }
  const { userId, amount, type, reference } = request.data;
  
  try {
    const walletRef = db.doc(`wallets/${userId}`);
    await db.runTransaction(async (transaction) => {
      const walletDoc = await transaction.get(walletRef);
      const currentBalance = walletDoc.data()?.balance || 0;
      let newBalance = currentBalance;
      if (type === "debit") {
        if (currentBalance < amount) {
          throw new functions.https.HttpsError("failed-precondition", "Insufficient funds");
        }
        newBalance -= amount;
      } else {
        newBalance += amount;
      }
      transaction.update(walletRef, { balance: newBalance });
      const trxRef = db.collection("transactions").doc();
      transaction.set(trxRef, {
        userId,
        amount,
        type,
        reference,
        createdAt: serverTimestamp()
      });
    });
    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
