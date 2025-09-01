"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/components/providers/auth-provider"
import type { Expense } from "@/lib/types"
import { firestoreService } from "@/lib/firestore"

export function useExpenses() {
  const { user } = useAuthContext()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadExpenses = async () => {
    if (!user) {
      setExpenses([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { expenses: fetchedExpenses, error: fetchError } = await firestoreService.getExpenses(user.id)
      
      if (fetchError) {
        setError(fetchError)
        setExpenses([])
      } else {
        setExpenses(fetchedExpenses)
        setError(null)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load expenses")
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadExpenses()
  }, [user])

  const addExpense = async (expenseData: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">) => {
    if (!user) throw new Error("User not authenticated")

    try {
      let expense: Expense | null = null
      let createError: string | null = null

      // If wallet deduction is requested, use transaction method
      if (expenseData.deductFromWallet) {
        // Get user's wallet first
        const { wallet, error: walletError } = await firestoreService.getWallet(user.id)
        if (walletError || !wallet) {
          throw new Error("Wallet not found. Please create a wallet first.")
        }

        const result = await firestoreService.createExpenseWithWalletDeduction(
          { ...expenseData, userId: user.id },
          wallet.id,
          expenseData.amount
        )
        expense = result.expense
        createError = result.error
      } else {
        // Use regular expense creation
        const result = await firestoreService.createExpense({
          ...expenseData,
          userId: user.id,
        })
        expense = result.expense
        createError = result.error
      }
      
      if (createError || !expense) {
        throw new Error(createError || "Failed to add expense")
      }

      // Optimistically update the state first
      setExpenses(prev => [expense, ...prev])
      
      // Also refresh the expenses from the server to ensure consistency
      setTimeout(() => {
        loadExpenses()
      }, 100)
      
      return expense
    } catch (err: any) {
      console.error("Error adding expense:", err)
      throw new Error(err.message || "Failed to add expense")
    }
  }

  const updateExpense = async (
    id: string,
    expenseData: Partial<Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt">>,
  ) => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Find the current expense to check previous wallet deduction status
      const currentExpense = expenses.find(exp => exp.id === id)
      if (!currentExpense) {
        throw new Error("Expense not found")
      }

      // Check if wallet adjustment is needed
      const hasWalletChange = 
        expenseData.deductFromWallet !== undefined || 
        (expenseData.amount !== undefined && currentExpense.deductFromWallet)

      if (hasWalletChange) {
        // Get user's wallet
        const { wallet, error: walletError } = await firestoreService.getWallet(user.id)
        if (walletError || !wallet) {
          throw new Error("Wallet not found. Please create a wallet first.")
        }

        const { error: updateError } = await firestoreService.updateExpenseWithWalletAdjustment(
          id,
          expenseData,
          wallet.id,
          currentExpense.deductFromWallet || false,
          currentExpense.amount,
          (expenseData.deductFromWallet ?? currentExpense.deductFromWallet) || false,
          expenseData.amount ?? currentExpense.amount
        )

        if (updateError) {
          throw new Error(updateError)
        }
      } else {
        // Use regular update method
        const { error: updateError } = await firestoreService.updateExpense(id, expenseData)
        
        if (updateError) {
          throw new Error(updateError)
        }
      }

      setExpenses(prev => prev.map(expense => 
        expense.id === id 
          ? { ...expense, ...expenseData, updatedAt: new Date() }
          : expense
      ))
    } catch (err: any) {
      console.error("Error updating expense:", err)
      throw new Error(err.message || "Failed to update expense")
    }
  }

  const deleteExpense = async (id: string) => {
    if (!user) throw new Error("User not authenticated")

    try {
      // Find the expense to check if it was deducted from wallet
      const expenseToDelete = expenses.find(expense => expense.id === id)
      if (!expenseToDelete) {
        throw new Error("Expense not found")
      }

      // If the expense was deducted from wallet, we need to refund it
      if (expenseToDelete.deductFromWallet) {
        console.log(`Refunding ₹${expenseToDelete.amount} to wallet for deleted expense`)
        
        // Get user's wallet
        const { wallet, error: walletError } = await firestoreService.getWallet(user.id)
        if (walletError || !wallet) {
          throw new Error("Wallet not found. Cannot process refund.")
        }

        // Use the wallet refund method
        const { error: deleteError } = await firestoreService.deleteExpenseWithWalletRefund(
          id, 
          wallet.id, 
          expenseToDelete.amount
        )
        
        if (deleteError) {
          throw new Error(deleteError)
        }
        
        console.log(`Successfully refunded ₹${expenseToDelete.amount} to wallet`)
      } else {
        // Use regular delete method
        const { error: deleteError } = await firestoreService.deleteExpense(id)
        
        if (deleteError) {
          throw new Error(deleteError)
        }
      }

      // Update local state immediately
      setExpenses(prev => prev.filter(expense => expense.id !== id))
      
      // Also refresh from server to ensure consistency
      setTimeout(() => {
        loadExpenses()
      }, 100)
    } catch (err: any) {
      console.error("Error deleting expense:", err)
      throw new Error(err.message || "Failed to delete expense")
    }
  }

  const getExpensesByDateRange = async (startDate: Date, endDate: Date) => {
    if (!user) return { expenses: [], error: "User not authenticated" }

    try {
      const { expenses: rangeExpenses, error: rangeError } = await firestoreService.getExpensesByDateRange(user.id, startDate, endDate)
      return { expenses: rangeExpenses, error: rangeError }
    } catch (err: any) {
      return { expenses: [], error: err.message || "Failed to fetch expenses by date range" }
    }
  }

  const getExpensesByCategory = async (startDate?: Date, endDate?: Date) => {
    if (!user) return []

    try {
      const { categoryData, error: categoryError } = await firestoreService.getExpensesByCategory(user.id, startDate, endDate)
      if (categoryError) {
        console.error("Error getting category data:", categoryError)
        return []
      }
      return categoryData
    } catch (err: any) {
      console.error("Error getting category data:", err)
      return []
    }
  }

  const getMonthlyExpenses = async (year?: number) => {
    if (!user) return []

    try {
      const { monthlyData, error: monthlyError } = await firestoreService.getMonthlyExpenses(user.id, year)
      if (monthlyError) {
        console.error("Error getting monthly data:", monthlyError)
        return []
      }
      return monthlyData
    } catch (err: any) {
      console.error("Error getting monthly data:", err)
      return []
    }
  }

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0)
  }

  const getRecentExpenses = (limit: number = 5) => {
    return expenses
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit)
  }

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpensesByDateRange,
    getExpensesByCategory,
    getMonthlyExpenses,
    getTotalExpenses,
    getRecentExpenses,
    refetch: loadExpenses,
  }
}
