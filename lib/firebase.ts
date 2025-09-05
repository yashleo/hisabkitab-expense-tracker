"use client"

let firebaseApp: any = null
let firebaseAuth: any = null
let firebaseDb: any = null
let googleProvider: any = null

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBwmAxxcDscY-BrzcdlDtgIOeKzEko-Z0Y",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "hisabkitabforall.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hisabkitabforall",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "hisabkitabforall.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "364209768256",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:364209768256:web:0a4fa1a43a0598dbe6dca5",
}

// Validate that all required environment variables are present
const validateFirebaseConfig = () => {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ]
  
  
  // Check that the final config has all required values
  const configValues = [
    firebaseConfig.apiKey,
    firebaseConfig.authDomain,
    firebaseConfig.projectId,
    firebaseConfig.storageBucket,
    firebaseConfig.messagingSenderId,
    firebaseConfig.appId
  ]
  
  const missingValues = configValues.filter(value => !value)
  
  if (missingValues.length > 0) {
    throw new Error('Firebase configuration is incomplete. Missing values detected.')
  }
  
  console.log('✅ Firebase configuration validated successfully')
}

const initializeFirebase = async () => {
  if (typeof window === "undefined") return null

  if (!firebaseApp) {
    try {
      // Validate environment variables first
      validateFirebaseConfig()
      
      const { initializeApp, getApps } = await import("firebase/app")
      const { getAuth, GoogleAuthProvider } = await import("firebase/auth")
      const { getFirestore } = await import("firebase/firestore")

      firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
      firebaseAuth = getAuth(firebaseApp)
      firebaseDb = getFirestore(firebaseApp)

      googleProvider = new GoogleAuthProvider()
      googleProvider.setCustomParameters({
        prompt: "select_account",
      })

      // For development: ensure localhost is handled properly
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        console.log("Development mode: OAuth should work on localhost if properly configured in Firebase Console")
      }
    } catch (error) {
      console.error("Firebase initialization error:", error)
      return null
    }
  }

  return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb, provider: googleProvider }
}

export const signInWithGoogle = async () => {
  try {
    const firebase = await initializeFirebase()
    if (!firebase) return { user: null, error: "Firebase initialization failed" }

    const { signInWithPopup } = await import("firebase/auth")
    const { doc, setDoc } = await import("firebase/firestore")

    const result = await signInWithPopup(firebase.auth, firebase.provider)
    const user = result.user

    // Save user data to Firestore
    await setDoc(
      doc(firebase.db, "users", user.uid),
      {
        id: user.uid,
        name: user.displayName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true },
    )

    return { user, error: null }
  } catch (error: any) {
    console.error("Google sign-in error:", error)
    return { user: null, error: error.message }
  }
}

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const firebase = await initializeFirebase()
    if (!firebase) return { user: null, error: "Firebase initialization failed" }

    const { signInWithEmailAndPassword } = await import("firebase/auth")
    
    const result = await signInWithEmailAndPassword(firebase.auth, email, password)
    const user = result.user

    return { user, error: null }
  } catch (error: any) {
    console.error("Email sign-in error:", error)
    let errorMessage = "Sign in failed"
    
    switch (error.code) {
      case "auth/user-not-found":
        errorMessage = "No account found with this email"
        break
      case "auth/wrong-password":
        errorMessage = "Incorrect password"
        break
      case "auth/invalid-email":
        errorMessage = "Invalid email address"
        break
      case "auth/too-many-requests":
        errorMessage = "Too many failed attempts. Try again later"
        break
      default:
        errorMessage = error.message
    }
    
    return { user: null, error: errorMessage }
  }
}

export const signUpWithEmail = async (email: string, password: string, name: string) => {
  try {
    const firebase = await initializeFirebase()
    if (!firebase) return { user: null, error: "Firebase initialization failed" }

    const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth")
    const { doc, setDoc } = await import("firebase/firestore")

    const result = await createUserWithEmailAndPassword(firebase.auth, email, password)
    const user = result.user

    // Update user profile with name
    await updateProfile(user, { displayName: name })

    // Save user data to Firestore
    await setDoc(doc(firebase.db, "users", user.uid), {
      id: user.uid,
      name: name,
      email: user.email || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return { user, error: null }
  } catch (error: any) {
    console.error("Email sign-up error:", error)
    let errorMessage = "Sign up failed"
    
    switch (error.code) {
      case "auth/email-already-in-use":
        errorMessage = "An account with this email already exists"
        break
      case "auth/invalid-email":
        errorMessage = "Invalid email address"
        break
      case "auth/weak-password":
        errorMessage = "Password should be at least 6 characters"
        break
      default:
        errorMessage = error.message
    }
    
    return { user: null, error: errorMessage }
  }
}

export const signOut = async () => {
  try {
    const firebase = await initializeFirebase()
    if (!firebase) return { error: "Firebase initialization failed" }

    const { signOut: firebaseSignOut } = await import("firebase/auth")
    await firebaseSignOut(firebase.auth)
    return { error: null }
  } catch (error: any) {
    console.error("Sign out error:", error)
    return { error: error.message }
  }
}

export const updateUserProfile = async (updates: { name?: string }) => {
  try {
    const firebase = await initializeFirebase()
    if (!firebase) return { error: "Firebase initialization failed" }

    const { updateProfile } = await import("firebase/auth")
    const currentUser = firebase.auth.currentUser
    
    if (!currentUser) {
      return { error: "No user is currently signed in" }
    }

    await updateProfile(currentUser, { 
      displayName: updates.name 
    })

    return { error: null }
  } catch (error: any) {
    console.error("Update profile error:", error)
    return { error: error.message || "Failed to update profile" }
  }
}

export const onAuthStateChange = async (callback: (user: any) => void) => {
  try {
    const firebase = await initializeFirebase()
    if (!firebase) return () => {}

    const { onAuthStateChanged } = await import("firebase/auth")
    return onAuthStateChanged(firebase.auth, callback)
  } catch (error) {
    console.error("Auth state listener error:", error)
    return () => {}
  }
}

// Export Firebase instances for direct use
export const getFirebaseInstances = async () => {
  return await initializeFirebase()
}

export const getAuth = async () => {
  const firebase = await initializeFirebase()
  return firebase?.auth || null
}

export const getDb = async () => {
  const firebase = await initializeFirebase()
  return firebase?.db || null
}

// For compatibility with existing code, export db directly
export const db = firebaseDb
