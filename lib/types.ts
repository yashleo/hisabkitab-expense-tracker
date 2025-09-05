export interface User {
  id: string
  name: string
  email: string
  phone?: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
  isDefault: boolean
  userId?: string // null for default categories, userId for custom categories
  createdAt: Date
  updatedAt: Date
}

export interface Expense {
  id: string
  userId: string
  amount: number
  date: Date
  category: string
  location?: string
  description?: string
  deductFromWallet?: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  createdAt: Date
  updatedAt: Date
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<{ user: any; error: string | null }>
  signInWithEmail: (email: string, password: string) => Promise<{ user: any; error: string | null }>
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ user: any; error: string | null }>
  signOut: () => Promise<{ error: string | null }>
  updateUserProfile: (updates: { name?: string }) => Promise<{ error: string | null }>
}

export const DEFAULT_CATEGORIES = [
  { name: "Food & Dining", color: "#ef4444" },
  { name: "Transportation", color: "#3b82f6" },
  { name: "Shopping", color: "#8b5cf6" },
  { name: "Entertainment", color: "#f59e0b" },
  { name: "Bills & Utilities", color: "#10b981" },
  { name: "Healthcare", color: "#ef4444" },
  { name: "Travel", color: "#06b6d4" },
  { name: "Education", color: "#6366f1" },
  { name: "Personal Care", color: "#ec4899" },
  { name: "Groceries", color: "#84cc16" },
  { name: "Fitness", color: "#f97316" },
] as const

export type ExpenseCategory = (typeof DEFAULT_CATEGORIES)[number]["name"]
