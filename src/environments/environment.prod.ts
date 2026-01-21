export const environment = {
    production: true,
    firebase: {
      apiKey: process.env['FIREBASE_API_KEY'] || 'FIREBASE_API_KEY',
      authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || "hirings-a76b9.firebaseapp.com",
      projectId: process.env['FIREBASE_PROJECT_ID'] || "hirings-a76b9",
      storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || "hirings-a76b9.firebasestorage.app",
      messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || "326780634372",
      appId: process.env['FIREBASE_APP_ID'] || "1:326780634372:web:5a4ae3011e8b5bf479bc51",
      measurementId: process.env['FIREBASE_MEASUREMENT_ID'] || "G-5KB91QBCP2",
      firebaseEmail: process.env['FIREBASE_EMAIL'] || 'FIREBASE_EMAIL',
      firebasePassword: process.env['FIREBASE_PASSWORD'] || 'FIREBASE_PASSWORD'
    }
  };
export const testCustomerId = 'startup-v5';