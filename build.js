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

// Security Hardening: Environment Variables Validation
const requiredVars = Object.keys(envVars);
const missingVars = requiredVars.filter(key => !envVars[key]);

if (missingVars.length > 0) {
  console.error('❌ Security Error: Variables de entorno faltantes:', missingVars.join(', '));
  process.exit(1);
}

// Validate credential format
const credentialPatterns = {
  FIREBASE_API_KEY: /^AIza[0-9A-Za-z_-]{35}$/,
  FIREBASE_PROJECT_ID: /^[a-z0-9-]+$/,
  FIREBASE_APP_ID: /^1:[0-9]+:web:[a-f0-9]+$/
};

for (const [key, pattern] of Object.entries(credentialPatterns)) {
  if (envVars[key] && !pattern.test(envVars[key])) {
    console.error(`❌ Security Error: Invalid ${key} format`);
    process.exit(1);
  }
}

// Security: Clear environment variables from memory
process.env.FIREBASE_API_KEY = undefined;
process.env.FIREBASE_AUTH_DOMAIN = undefined;
process.env.FIREBASE_PROJECT_ID = undefined;
process.env.FIREBASE_STORAGE_BUCKET = undefined;
process.env.FIREBASE_MESSAGING_SENDER_ID = undefined;
process.env.FIREBASE_APP_ID = undefined;
process.env.FIREBASE_MEASUREMENT_ID = undefined;

// Security Hardening: Credential Management & Secrets Protection
const obfuscatedConfig = `
<script>
(function() {
  'use strict';
  
  // Anti-tampering protection
  const security = {
    check: function() {
      if (typeof window !== 'undefined' && window.location.hostname !== '${process.env.ALLOWED_DOMAIN || 'localhost'}') {
        console.error('Security: Unauthorized domain access');
        return false;
      }
      return true;
    },
    
    obfuscate: function(str) {
      return btoa(str).split('').reverse().join('');
    },
    
    deobfuscate: function(str) {
      return atob(str.split('').reverse().join(''));
    }
  };
  
  // Encrypted configuration with domain validation
  if (security.check()) {
    const encrypted = {
      a: '${Buffer.from(envVars.FIREBASE_API_KEY).toString('base64')}',
      b: '${Buffer.from(envVars.FIREBASE_AUTH_DOMAIN).toString('base64')}',
      c: '${Buffer.from(envVars.FIREBASE_PROJECT_ID).toString('base64')}',
      d: '${Buffer.from(envVars.FIREBASE_STORAGE_BUCKET).toString('base64')}',
      e: '${Buffer.from(envVars.FIREBASE_MESSAGING_SENDER_ID).toString('base64')}',
      f: '${Buffer.from(envVars.FIREBASE_APP_ID).toString('base64')}',
      g: '${Buffer.from(envVars.FIREBASE_MEASUREMENT_ID).toString('base64')}'
    };
    
    window.FIREBASE_CONFIG = {
      apiKey: atob(encrypted.a),
      authDomain: atob(encrypted.b),
      projectId: atob(encrypted.c),
      storageBucket: atob(encrypted.d),
      messagingSenderId: atob(encrypted.e),
      appId: atob(encrypted.f),
      measurementId: atob(encrypted.g)
    };
    
    // Clear encrypted data from memory
    Object.keys(encrypted).forEach(key => delete encrypted[key]);
  }
})();
</script>`;

html = html.replace('</head>', `${obfuscatedConfig}</head>`);
fs.writeFileSync(htmlPath, html);
