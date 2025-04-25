import admin from 'firebase-admin';

admin.initializeApp();

const auth = admin.auth();

export { admin, auth };
