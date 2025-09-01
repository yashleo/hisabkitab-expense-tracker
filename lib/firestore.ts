"use client"

import { getFirebaseInstances } from "./firebase"
import { User, Expense, Category, Wallet } from "./types"

// Firestore service for managing database operations
export class FirestoreService {
    private static instance: FirestoreService
    private db: any = null

    private constructor() { }

    public static getInstance(): FirestoreService {
        if (!FirestoreService.instance) {
            FirestoreService.instance = new FirestoreService()
        }
        return FirestoreService.instance
    }

    private async getDb() {
        if (!this.db) {
            const firebase = await getFirebaseInstances()
            if (!firebase) throw new Error("Firebase not initialized")
            this.db = firebase.db
        }
        return this.db
    }

    // User operations
    async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<{ user: User | null; error: string | null }> {
        try {
            const db = await this.getDb()
            const { collection, doc, setDoc, serverTimestamp } = await import("firebase/firestore")

            const userRef = doc(collection(db, "users"))
            const newUser = {
                ...userData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }

            await setDoc(userRef, newUser)

            const user: User = {
                ...userData,
                id: userRef.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            return { user, error: null }
        } catch (error: any) {
            console.error("Error creating user:", error)
            return { user: null, error: error.message }
        }
    }

    async getUser(userId: string): Promise<{ user: User | null; error: string | null }> {
        try {
            const db = await this.getDb()
            const { doc, getDoc } = await import("firebase/firestore")

            const userDoc = await getDoc(doc(db, "users", userId))

            if (!userDoc.exists()) {
                return { user: null, error: "User not found" }
            }

            const userData = userDoc.data()
            const user: User = {
                id: userDoc.id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                createdAt: userData.createdAt?.toDate() || new Date(),
                updatedAt: userData.updatedAt?.toDate() || new Date(),
            }

            return { user, error: null }
        } catch (error: any) {
            console.error("Error fetching user:", error)
            return { user: null, error: error.message }
        }
    }

    async updateUser(userId: string, updates: Partial<Omit<User, "id" | "createdAt">>): Promise<{ error: string | null }> {
        try {
            const db = await this.getDb()
            const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

            await updateDoc(doc(db, "users", userId), {
                ...updates,
                updatedAt: serverTimestamp(),
            })

            return { error: null }
        } catch (error: any) {
            console.error("Error updating user:", error)
            return { error: error.message }
        }
    }

    // Expense operations
    async createExpense(expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">): Promise<{ expense: Expense | null; error: string | null }> {
        try {
            const db = await this.getDb()
            const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

            const newExpense = {
                ...expenseData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }

            const docRef = await addDoc(collection(db, "expenses"), newExpense)

            const expense: Expense = {
                ...expenseData,
                id: docRef.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            return { expense, error: null }
        } catch (error: any) {
            console.error("Error creating expense:", error)
            return { expense: null, error: error.message }
        }
    }

    async getExpenses(userId: string, limit?: number): Promise<{ expenses: Expense[]; error: string | null }> {
        try {
            const db = await this.getDb()
            const { collection, query, where, orderBy, getDocs, limitToLast } = await import("firebase/firestore")

            let expenseQuery = query(
                collection(db, "expenses"),
                where("userId", "==", userId),
                orderBy("date", "desc")
            )

            if (limit) {
                expenseQuery = query(expenseQuery, limitToLast(limit))
            }

            const querySnapshot = await getDocs(expenseQuery)
            const expenses: Expense[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                userId: doc.data().userId,
                amount: doc.data().amount,
                date: doc.data().date?.toDate() || new Date(),
                category: doc.data().category,
                location: doc.data().location,
                description: doc.data().description,
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            }))

            return { expenses, error: null }
        } catch (error: any) {
            console.error("Error fetching expenses:", error)
            return { expenses: [], error: error.message }
        }
    }

    async getExpensesByDateRange(
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<{ expenses: Expense[]; error: string | null }> {
        try {
            const db = await this.getDb()
            const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")

            const expenseQuery = query(
                collection(db, "expenses"),
                where("userId", "==", userId),
                where("date", ">=", startDate),
                where("date", "<=", endDate),
                orderBy("date", "desc")
            )

            const querySnapshot = await getDocs(expenseQuery)
            const expenses: Expense[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                userId: doc.data().userId,
                amount: doc.data().amount,
                date: doc.data().date?.toDate() || new Date(),
                category: doc.data().category,
                location: doc.data().location,
                description: doc.data().description,
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            }))

            return { expenses, error: null }
        } catch (error: any) {
            console.error("Error fetching expenses by date range:", error)
            return { expenses: [], error: error.message }
        }
    }

    async updateExpense(expenseId: string, updates: Partial<Omit<Expense, "id" | "userId" | "createdAt">>): Promise<{ error: string | null }> {
        try {
            const db = await this.getDb()
            const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

            await updateDoc(doc(db, "expenses", expenseId), {
                ...updates,
                updatedAt: serverTimestamp(),
            })

            return { error: null }
        } catch (error: any) {
            console.error("Error updating expense:", error)
            return { error: error.message }
        }
    }

    async deleteExpense(expenseId: string): Promise<{ error: string | null }> {
        try {
            const db = await this.getDb()
            const { doc, deleteDoc } = await import("firebase/firestore")

            await deleteDoc(doc(db, "expenses", expenseId))
            return { error: null }
        } catch (error: any) {
            console.error("Error deleting expense:", error)
            return { error: error.message }
        }
    }

    async deleteExpenseWithWalletRefund(
        expenseId: string, 
        walletId: string, 
        refundAmount: number
    ): Promise<{ error: string | null }> {
        try {
            const db = await this.getDb()
            const { doc, deleteDoc, updateDoc, increment, runTransaction } = await import("firebase/firestore")

            // Use a transaction to ensure both operations succeed or fail together
            await runTransaction(db, async (transaction) => {
                const expenseRef = doc(db, "expenses", expenseId)
                const walletRef = doc(db, "wallets", walletId)

                // First verify the expense exists
                const expenseSnap = await transaction.get(expenseRef)
                if (!expenseSnap.exists()) {
                    throw new Error("Expense not found")
                }

                // Verify the wallet exists
                const walletSnap = await transaction.get(walletRef)
                if (!walletSnap.exists()) {
                    throw new Error("Wallet not found")
                }

                // Delete the expense
                transaction.delete(expenseRef)

                // Refund the amount to wallet
                transaction.update(walletRef, {
                    balance: increment(refundAmount),
                    updatedAt: new Date()
                })
            })

            return { error: null }
        } catch (error: any) {
            console.error("Error deleting expense with wallet refund:", error)
            return { error: error.message }
        }
    }

    // Category operations
    async getUserCategories(userId: string): Promise<{ categories: Category[]; error: string | null }> {
        try {
            const db = await this.getDb()
            const { collection, query, where, orderBy, getDocs } = await import("firebase/firestore")

            const categoryQuery = query(
                collection(db, "categories"),
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            )

            const querySnapshot = await getDocs(categoryQuery)
            const categories: Category[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name,
                color: doc.data().color,
                isDefault: doc.data().isDefault || false,
                userId: doc.data().userId,
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            }))

            return { categories, error: null }
        } catch (error: any) {
            console.error("Error fetching categories:", error)
            return { categories: [], error: error.message }
        }
    }

    async createCategory(categoryData: Omit<Category, "id" | "createdAt" | "updatedAt">): Promise<{ category: Category | null; error: string | null }> {
        try {
            const db = await this.getDb()
            const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

            const newCategory = {
                ...categoryData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }

            const docRef = await addDoc(collection(db, "categories"), newCategory)

            const category: Category = {
                ...categoryData,
                id: docRef.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            return { category, error: null }
        } catch (error: any) {
            console.error("Error creating category:", error)
            return { category: null, error: error.message }
        }
    }

    async updateCategory(categoryId: string, updates: Partial<Omit<Category, "id" | "userId" | "createdAt">>): Promise<{ error: string | null }> {
        try {
            const db = await this.getDb()
            const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

            await updateDoc(doc(db, "categories", categoryId), {
                ...updates,
                updatedAt: serverTimestamp(),
            })

            return { error: null }
        } catch (error: any) {
            console.error("Error updating category:", error)
            return { error: error.message }
        }
    }

    async deleteCategory(categoryId: string): Promise<{ error: string | null }> {
        try {
            const db = await this.getDb()
            const { doc, deleteDoc } = await import("firebase/firestore")

            await deleteDoc(doc(db, "categories", categoryId))
            return { error: null }
        } catch (error: any) {
            console.error("Error deleting category:", error)
            return { error: error.message }
        }
    }

    // Analytics operations
    async getExpensesByCategory(userId: string, startDate?: Date, endDate?: Date): Promise<{ categoryData: any[]; error: string | null }> {
        try {
            const { expenses, error } = startDate && endDate
                ? await this.getExpensesByDateRange(userId, startDate, endDate)
                : await this.getExpenses(userId)

            if (error) return { categoryData: [], error }

            const categoryTotals = expenses.reduce((acc, expense) => {
                acc[expense.category] = (acc[expense.category] || 0) + expense.amount
                return acc
            }, {} as Record<string, number>)

            const categoryData = Object.entries(categoryTotals).map(([category, amount]) => ({
                category,
                amount,
                count: expenses.filter(e => e.category === category).length
            }))

            return { categoryData, error: null }
        } catch (error: any) {
            console.error("Error getting expenses by category:", error)
            return { categoryData: [], error: error.message }
        }
    }

    async getMonthlyExpenses(userId: string, year?: number): Promise<{ monthlyData: any[]; error: string | null }> {
        try {
            const currentYear = year || new Date().getFullYear()
            const startDate = new Date(currentYear, 0, 1)
            const endDate = new Date(currentYear, 11, 31)

            const { expenses, error } = await this.getExpensesByDateRange(userId, startDate, endDate)
            if (error) return { monthlyData: [], error }

            const monthlyTotals = Array(12).fill(0)
            expenses.forEach(expense => {
                const month = expense.date.getMonth()
                monthlyTotals[month] += expense.amount
            })

            const monthlyData = monthlyTotals.map((total, index) => ({
                month: new Date(currentYear, index, 1).toLocaleString('default', { month: 'short' }),
                amount: total,
                count: expenses.filter(e => e.date.getMonth() === index).length
            }))

            return { monthlyData, error: null }
        } catch (error: any) {
            console.error("Error getting monthly expenses:", error)
            return { monthlyData: [], error: error.message }
        }
    }

    // Wallet operations
    async createWallet(walletData: Omit<Wallet, "id" | "createdAt" | "updatedAt">): Promise<{ wallet: Wallet | null; error: string | null }> {
        try {
            const db = await this.getDb()
            const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")

            const newWallet = {
                ...walletData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }

            const docRef = await addDoc(collection(db, "wallets"), newWallet)

            const wallet: Wallet = {
                ...walletData,
                id: docRef.id,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            return { wallet, error: null }
        } catch (error: any) {
            console.error("Error creating wallet:", error)
            return { wallet: null, error: error.message }
        }
    }

    async getWallet(userId: string): Promise<{ wallet: Wallet | null; error: string | null }> {
        try {
            const db = await this.getDb()
            const { collection, query, where, getDocs } = await import("firebase/firestore")

            const walletQuery = query(
                collection(db, "wallets"),
                where("userId", "==", userId)
            )

            const querySnapshot = await getDocs(walletQuery)
            
            if (querySnapshot.empty) {
                return { wallet: null, error: "Wallet not found" }
            }

            const doc = querySnapshot.docs[0]
            const wallet: Wallet = {
                id: doc.id,
                userId: doc.data().userId,
                balance: doc.data().balance || 0,
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            }

            return { wallet, error: null }
        } catch (error: any) {
            console.error("Error fetching wallet:", error)
            // Handle permission errors specifically
            if (error.code === 'permission-denied') {
                return { wallet: null, error: "Permission denied accessing wallet" }
            }
            return { wallet: null, error: error.message }
        }
    }

    async updateWallet(walletId: string, updates: Partial<Omit<Wallet, "id" | "userId" | "createdAt">>): Promise<{ error: string | null }> {
        try {
            const db = await this.getDb()
            const { doc, updateDoc, serverTimestamp } = await import("firebase/firestore")

            await updateDoc(doc(db, "wallets", walletId), {
                ...updates,
                updatedAt: serverTimestamp(),
            })

            return { error: null }
        } catch (error: any) {
            console.error("Error updating wallet:", error)
            return { error: error.message }
        }
    }

    // Transaction methods for expense + wallet operations
    async createExpenseWithWalletDeduction(
        expenseData: Omit<Expense, "id" | "createdAt" | "updatedAt">,
        walletId: string,
        deductionAmount: number
    ): Promise<{ expense: Expense | null; error: string | null }> {
        try {
            const db = await this.getDb()
            const { collection, doc, runTransaction, serverTimestamp } = await import("firebase/firestore")

            const result = await runTransaction(db, async (transaction) => {
                // Get current wallet
                const walletRef = doc(db, "wallets", walletId)
                const walletDoc = await transaction.get(walletRef)
                
                if (!walletDoc.exists()) {
                    throw new Error("Wallet not found")
                }

                const currentBalance = walletDoc.data().balance
                if (currentBalance < deductionAmount) {
                    throw new Error("Insufficient wallet balance")
                }

                // Create expense
                const expenseRef = doc(collection(db, "expenses"))
                const newExpense = {
                    ...expenseData,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                }
                transaction.set(expenseRef, newExpense)

                // Update wallet balance
                transaction.update(walletRef, {
                    balance: currentBalance - deductionAmount,
                    updatedAt: serverTimestamp(),
                })

                return {
                    id: expenseRef.id,
                    ...expenseData,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }
            })

            return { expense: result, error: null }
        } catch (error: any) {
            console.error("Error creating expense with wallet deduction:", error)
            return { expense: null, error: error.message }
        }
    }

    async updateExpenseWithWalletAdjustment(
        expenseId: string,
        updates: Partial<Omit<Expense, "id" | "userId" | "createdAt">>,
        walletId: string,
        previousWalletDeduction: boolean,
        previousAmount: number,
        newWalletDeduction: boolean,
        newAmount: number
    ): Promise<{ error: string | null }> {
        try {
            const db = await this.getDb()
            const { doc, runTransaction, serverTimestamp } = await import("firebase/firestore")

            await runTransaction(db, async (transaction) => {
                // Get current wallet
                const walletRef = doc(db, "wallets", walletId)
                const walletDoc = await transaction.get(walletRef)
                
                if (!walletDoc.exists()) {
                    throw new Error("Wallet not found")
                }

                let currentBalance = walletDoc.data().balance

                // Calculate balance adjustment
                let balanceAdjustment = 0

                // If previously deducted, add back the old amount
                if (previousWalletDeduction) {
                    balanceAdjustment += previousAmount
                }

                // If now deducting, subtract the new amount
                if (newWalletDeduction) {
                    balanceAdjustment -= newAmount
                }

                const newBalance = currentBalance + balanceAdjustment

                // Check if sufficient funds for new deduction
                if (newWalletDeduction && newBalance < 0) {
                    throw new Error("Insufficient wallet balance")
                }

                // Update expense
                const expenseRef = doc(db, "expenses", expenseId)
                transaction.update(expenseRef, {
                    ...updates,
                    updatedAt: serverTimestamp(),
                })

                // Update wallet if there's a balance change
                if (balanceAdjustment !== 0) {
                    transaction.update(walletRef, {
                        balance: newBalance,
                        updatedAt: serverTimestamp(),
                    })
                }
            })

            return { error: null }
        } catch (error: any) {
            console.error("Error updating expense with wallet adjustment:", error)
            return { error: error.message }
        }
    }
}

// Export singleton instance
export const firestoreService = FirestoreService.getInstance()
