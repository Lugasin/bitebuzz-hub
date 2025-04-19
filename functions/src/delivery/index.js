const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { calculateDistance } = require('../utils');

// Assign nearest driver to an order
exports.assignNearestDriver = functions.database
  .ref('/orders/{orderId}')
  .onCreate(async (snapshot, context) => {
    const orderId = context.params.orderId;
    const orderData = snapshot.val();
    
    // Only assign if order status is 'placed'
    if (orderData.status !== 'placed') return null;
    
    try {
      // Get vendor location
      const vendorId = orderData.vendor.vendorId;
      const vendorSnapshot = await admin.database().ref(`vendors/${ven