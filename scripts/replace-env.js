const fs = require('fs');
const path = require('path');

const envFile = path.join(__dirname, '../src/environments/environment.prod.ts');

// Read the template file
let content = fs.readFileSync(envFile, 'utf8');

// Replace placeholders with actual values from process.env
const replacements = {
  "FIREBASE_API_KEY": process.env.FIREBASE_API_KEY || 'FIREBASE_API_KEY',
  "FIREBASE_EMAIL": process.env.FIREBASE_EMAIL || 'FIREBASE_EMAIL',
  "FIREBASE_PASSWORD": process.env.FIREBASE_PASSWORD || 'FIREBASE_PASSWORD'
};

// Replace values in single quotes
Object.keys(replacements).forEach(key => {
  const value = replacements[key];
  // Escape single quotes in the value
  const escapedValue = value.replace(/'/g, "\\'");
  // Replace 'KEY' with 'actual_value'
  const regex = new RegExp(`'${key}'`, 'g');
  content = content.replace(regex, `'${escapedValue}'`);
});

fs.writeFileSync(envFile, content);
console.log('Environment variables replaced successfully');