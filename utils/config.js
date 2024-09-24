const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
const privateKey = process.env.GOOGLE_APPLICATION_PRIVATE_KEY; // Define private key separately
const serviceAccount = serviceAccountJson ? JSON.parse(serviceAccountJson) : {}; // Parse only if JSON is available

// Check if serviceAccount is valid
if (!serviceAccount || !privateKey) { // Use privateKey for validation
    throw new Error('Invalid service account credentials');
}

if (!admin.apps.length) {
  admin.initializeApp({
      credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: privateKey, // Use the separate privateKey
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL
  });
}

const firestore = admin.firestore();

const firebaseConfig  = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const serviceConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
};


module.exports = { firebaseConfig, firestore };

