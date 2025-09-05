"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthContextType } from "@/lib/types"
import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, updateUserProfile, onAuthStateChange } from "@/lib/firebase"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe: (() => void) | undefined

    const setupAuthListener = async () => {
      unsubscribe = await onAuthStateChange((firebaseUser) => {
        if (firebaseUser) {
          const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || "",
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          setUser(user)
        } else {
          setUser(null)
        }
        setLoading(false)
      })
    }

    setupAuthListener()

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const signInWithEmailAuth = async (email: string, password: string) => {
    try {
      const result = await signInWithEmail(email, password)
      return result
    } catch (error) {
      return { user: null, error: "Network error" }
    }
  }

  const signUpWithEmailAuth = async (email: string, password: string, name: string) => {
    try {
      const result = await signUpWithEmail(email, password, name)
      return result
    } catch (error) {
      return { user: null, error: "Network error" }
    }
  }

  const signInWithGoogleAuth = async () => {
    try {
      const result = await signInWithGoogle()
      return result
    } catch (error) {
      return { user: null, error: "Network error" }
    }
  }

  const signOutUser = async () => {
    try {
      await signOut()
      return { user: null, error: null }
    } catch (error) {
      return { user: null, error: "Sign out failed" }
    }
  }

  const updateUserProfileAuth = async (updates: { name?: string }) => {
    try {
      const result = await updateUserProfile(updates)
      if (result.error) {
        throw new Error(result.error)
      }
      
      // Update local user state
      if (user && updates.name) {
        setUser(prev => prev ? { ...prev, name: updates.name!, updatedAt: new Date() } : null)
      }
      
      return { error: null }
    } catch (error: any) {
      return { error: error.message || "Failed to update profile" }
    }
  }

  const value = {
    user,
    loading,
    signInWithGoogle: signInWithGoogleAuth,
    signInWithEmail: signInWithEmailAuth,
    signUpWithEmail: signUpWithEmailAuth,
    signOut: signOutUser,
    updateUserProfile: updateUserProfileAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}
