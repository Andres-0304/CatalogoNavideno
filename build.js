const fs = require('fs');
const path = require('path');

// Leer el archivo HTML
const htmlPath = path.join(__dirname, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Variables de entorno de Netlify (sin fallbacks por seguridad)
const envVars = {
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID
};

// Verificar que todas las variables estén definidas
const requiredVars = Object.keys(envVars);
const missingVars = requiredVars.filter(key => !envVars[key]);

if (missingVars.length > 0) {
  console.error('Variables de entorno faltantes:', missingVars.join(', '));
  process.exit(1);
}

const envScript = `<script>window.FIREBASE_API_KEY='${envVars.FIREBASE_API_KEY}';window.FIREBASE_AUTH_DOMAIN='${envVars.FIREBASE_AUTH_DOMAIN}';window.FIREBASE_PROJECT_ID='${envVars.FIREBASE_PROJECT_ID}';window.FIREBASE_STORAGE_BUCKET='${envVars.FIREBASE_STORAGE_BUCKET}';window.FIREBASE_MESSAGING_SENDER_ID='${envVars.FIREBASE_MESSAGING_SENDER_ID}';window.FIREBASE_APP_ID='${envVars.FIREBASE_APP_ID}';window.FIREBASE_MEASUREMENT_ID='${envVars.FIREBASE_MEASUREMENT_ID}';</script>`;

html = html.replace('</head>', `${envScript}</head>`);
fs.writeFileSync(htmlPath, html);
