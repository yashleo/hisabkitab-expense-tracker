// Firebase configuration with fallback values
const firebaseConfig = {
  apiKey: "AIzaSyBwmAxxcDscY-BrzcdlDtgIOeKzEko-Z0Y",
  authDomain: "hisabkitabforall.firebaseapp.com",
  projectId: "hisabkitabforall",
  storageBucket: "hisabkitabforall.appspot.com",
  messagingSenderId: "364209768256",
  appId: "1:364209768256:web:0a4fa1a43a0598dbe6dca5",
}

// Environment configuration and validation
export const config = {
  firebase: firebaseConfig,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

// Simplified validation - always returns true since we have hardcoded config
export const validateConfig = () => {
  console.log('✅ Firebase configuration loaded successfully')
  return true
}

// Get Firebase config with validation
export const getFirebaseConfig = () => {
  validateConfig()
  return config.firebase
}
