import { environmentSecret } from './environment.secret';

export const environment = {
    production: false,
    firebase: {
      apiKey: environmentSecret.firebase.apiKey,
      authDomain: "hirings-a76b9.firebaseapp.com",
      projectId: "hirings-a76b9",
      storageBucket: "hirings-a76b9.firebasestorage.app",
      messagingSenderId: "326780634372",
      appId: "1:326780634372:web:5a4ae3011e8b5bf479bc51",
      measurementId: "G-5KB91QBCP2",
      firebaseEmail: environmentSecret.firebase.firebaseEmail,
      firebasePassword: environmentSecret.firebase.firebasePassword
    },
    mongodb: {
      connectionString: environmentSecret.mongodb.connectionString
    }
  };
export const testCustomerId = 'tech-v3';
