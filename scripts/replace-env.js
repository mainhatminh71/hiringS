const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '../src/environments/environment.prod.ts');

// Read the template file
let content = fs.readFileSync(envFile, 'utf8');

// Replace placeholders with actual values from process.env
const replacements = {
  'FIREBASE_API_KEY_PLACEHOLDER': process.env.FIREBASE_API_KEY || 'FIREBASE_API_KEY',
  'FIREBASE_EMAIL_PLACEHOLDER': process.env.FIREBASE_EMAIL || 'FIREBASE_EMAIL',
  'FIREBASE_PASSWORD_PLACEHOLDER': process.env.FIREBASE_PASSWORD || 'FIREBASE_PASSWORD'
};

// Replace placeholders with actual values
Object.keys(replacements).forEach(placeholder => {
  const value = replacements[placeholder];
  // Escape single quotes in the value
  const escapedValue = value.replace(/'/g, "\\'");
  content = content.replace(new RegExp(placeholder, 'g'), escapedValue);
});

fs.writeFileSync(envFile, content);
console.log('Environment variables replaced successfully');