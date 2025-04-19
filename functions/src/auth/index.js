const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Create user record when a new account is created
exports.createUser = functions.auth.user().onCreate(async (user) => {
  try {
    // Get user data
    const { uid, email, displayName, phoneNumber, photoURL } = user;
    
    // Set default role
    const role = 'customer';
    
    // Create user profile
    const userData = {
      profile: {
        email: email || '',
        name: displayName || '',
        phone: phoneNumber || '',
        role: role,
        profileImage: photoURL || 'default-profile.jpg',
        createdAt: admin.database.ServerValue.TIMESTAMP
      }
    };
    
    // Save to Database
    await admin.database().ref(`users/${uid}`).set(userData);
    
    // Add to role category
    await admin.database().ref(`users/byRole/${role}/${uid}`).set(true);
    
    // Create a welcome notification
    const notification = {
      message: 'Welcome to BiteBuzz! Start ordering delicious food and groceries today.',
      type: 'welcome',
      read: false,
      timestamp: admin.database.ServerValue.TIMESTAMP,
      data: {}
    };
    
    await admin.database().ref(`notifications/${uid}/welcome`).set(notification);
    
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { error: error.message };
  }
}); 