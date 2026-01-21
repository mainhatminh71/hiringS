const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '../src/environments/environment.prod.ts');

// Read the template file
let content = fs.readFileSync(envFile, 'utf8');

// Replace environment variables with actual values from process.env
const replacements = {
  'FIREBASE_API_KEY': process.env.FIREBASE_API_KEY || 'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN': process.env.FIREBASE_AUTH_DOMAIN || 'hirings-a76b9.firebaseapp.com',
  'FIREBASE_PROJECT_ID': process.env.FIREBASE_PROJECT_ID || 'hirings-a76b9',
  'FIREBASE_STORAGE_BUCKET': process.env.FIREBASE_STORAGE_BUCKET || 'hirings-a76b9.firebasestorage.app',
  'FIREBASE_MESSAGING_SENDER_ID': process.env.FIREBASE_MESSAGING_SENDER_ID || '326780634372',
  'FIREBASE_APP_ID': process.env.FIREBASE_APP_ID || '1:326780634372:web:5a4ae3011e8b5bf479bc51',
  'FIREBASE_MEASUREMENT_ID': process.env.FIREBASE_MEASUREMENT_ID || 'G-5KB91QBCP2',
  'FIREBASE_EMAIL': process.env.FIREBASE_EMAIL || 'FIREBASE_EMAIL',
  'FIREBASE_PASSWORD': process.env.FIREBASE_PASSWORD || 'FIREBASE_PASSWORD',
  'TEST_CUSTOMER_ID': process.env.TEST_CUSTOMER_ID || 'startup-v5'
};

// Replace process.env['KEY'] with actual values
Object.keys(replacements).forEach(key => {
  const regex = new RegExp(`process\\.env\\['${key}'\\]`, 'g');
  content = content.replace(regex, `'${replacements[key]}'`);
});

// Also handle process.env.KEY format
Object.keys(replacements).forEach(key => {
  const regex = new RegExp(`process\\.env\\.${key}`, 'g');
  content = content.replace(regex, `'${replacements[key]}'`);
});

fs.writeFileSync(envFile, content);
console.log('Environment variables replaced successfully');