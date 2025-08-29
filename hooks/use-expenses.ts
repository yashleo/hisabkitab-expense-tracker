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
      const { expense, error: createError } = await firestoreService.createExpense({
        ...expenseData,
        userId: user.id,
      })
      
      if (createError || !expense) {
        throw new Error(createError || "Failed to add expense")
      }

      setExpenses(prev => [expense, ...prev])
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
      const { error: updateError } = await firestoreService.updateExpense(id, expenseData)
      
      if (updateError) {
        throw new Error(updateError)
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
      const { error: deleteError } = await firestoreService.deleteExpense(id)
      
      if (deleteError) {
        throw new Error(deleteError)
      }

      setExpenses(prev => prev.filter(expense => expense.id !== id))
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
