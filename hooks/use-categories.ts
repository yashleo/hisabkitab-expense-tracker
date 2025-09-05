"use client"

import { useState, useEffect } from "react"
import { Category } from "@/lib/types"
import { useAuthContext } from "@/components/providers/auth-provider"
import { firestoreService } from "@/lib/firestore"

const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'userId'>[] = [
    { name: "Food & Dining", color: "#ef4444", isDefault: true },
    { name: "Groceries", color: "#f97316", isDefault: true },
    { name: "Transportation", color: "#f59e0b", isDefault: true },
    { name: "Shopping", color: "#eab308", isDefault: true },
    { name: "Entertainment", color: "#84cc16", isDefault: true },
    { name: "Bills & Utilities", color: "#22c55e", isDefault: true },
    { name: "Healthcare", color: "#10b981", isDefault: true },
    { name: "Education", color: "#14b8a6", isDefault: true },
    { name: "Travel", color: "#06b6d4", isDefault: true },
    { name: "Personal Care", color: "#0ea5e9", isDefault: true },
    { name: "Fitness", color: "#3b82f6", isDefault: true },
    { name: "Gifts", color: "#6366f1", isDefault: true }
]

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuthContext()

    // Load categories when user changes
    useEffect(() => {
        if (user) {
            loadCategories()
        } else {
            setCategories([])
            setLoading(false)
        }
    }, [user])

    const loadCategories = async () => {
        if (!user) return

        setLoading(true)
        setError(null)

        try {
            // Load user's custom categories only (don't auto-create defaults)
            const { categories: allCategories, error: fetchError } = await firestoreService.getUserCategories(user.id)
            
            if (fetchError) {
                setError(fetchError)
                setCategories([])
            } else {
                setCategories(allCategories)
            }
        } catch (err) {
            console.error('Error loading categories:', err)
            setError('Failed to load categories')
        } finally {
            setLoading(false)
        }
    }

    const ensureDefaultCategories = async () => {
        if (!user) return

        try {
            // Check if default categories already exist
            const { categories: existingCategories, error: fetchError } = await firestoreService.getUserCategories(user.id)
            
            if (fetchError) {
                console.error('Error fetching existing categories:', fetchError)
                return
            }
            
            const existingDefaultNames = existingCategories
                .filter(cat => cat.isDefault)
                .map(cat => cat.name)

            // Add missing default categories
            const missingDefaults = DEFAULT_CATEGORIES.filter(
                defaultCat => !existingDefaultNames.includes(defaultCat.name)
            )

            if (missingDefaults.length > 0) {
                for (const defaultCategory of missingDefaults) {
                    await firestoreService.createCategory({
                        ...defaultCategory,
                        userId: undefined // Default categories don't have userId
                    })
                }
            }
        } catch (err) {
            console.error('Error ensuring default categories:', err)
        }
    }

    const addCategory = async (categoryData: {
        name: string
        color: string
    }) => {
        if (!user) {
            return { error: 'User not authenticated' }
        }

        try {
            const { category: newCategory, error: createError } = await firestoreService.createCategory({
                ...categoryData,
                isDefault: false,
                userId: user.id
            })

            if (createError || !newCategory) {
                return { error: createError || 'Failed to add category' }
            }

            // Update local state
            setCategories(prev => [...prev, newCategory])
            return { success: true, category: newCategory }
        } catch (err) {
            console.error('Error adding category:', err)
            return { error: 'Failed to add category' }
        }
    }

    const updateCategory = async (categoryId: string, updates: {
        name?: string
        color?: string
    }) => {
        if (!user) {
            return { error: 'User not authenticated' }
        }

        try {
            const { error: updateError } = await firestoreService.updateCategory(categoryId, updates)
            
            if (updateError) {
                return { error: updateError }
            }

            // Update local state
            setCategories(prev =>
                prev.map(cat => cat.id === categoryId ? { ...cat, ...updates, updatedAt: new Date() } : cat)
            )
            return { success: true }
        } catch (err) {
            console.error('Error updating category:', err)
            return { error: 'Failed to update category' }
        }
    }

    const deleteCategory = async (categoryId: string) => {
        if (!user) {
            return { error: 'User not authenticated' }
        }

        try {
            // Check if category is being used in expenses
            const { expenses, error: expenseError } = await firestoreService.getExpenses(user.id)
            
            if (expenseError) {
                return { error: 'Failed to check category usage' }
            }
            
            const isUsed = expenses.some(expense => expense.category === categoryId)

            if (isUsed) {
                return { error: 'Cannot delete category that is being used in expenses' }
            }

            await firestoreService.deleteCategory(categoryId)

            // Update local state
            setCategories(prev => prev.filter(cat => cat.id !== categoryId))
            return { success: true }
        } catch (err) {
            console.error('Error deleting category:', err)
            return { error: 'Failed to delete category' }
        }
    }

    const getGroupedCategories = () => {
        const defaultCategories = categories.filter(cat => cat.isDefault)
        const customCategories = categories.filter(cat => !cat.isDefault && cat.userId === user?.id)

        return {
            default: defaultCategories,
            custom: customCategories
        }
    }

    const getCategoryById = (categoryId: string) => {
        return categories.find(cat => cat.id === categoryId)
    }

    const getCategoryByName = (categoryName: string) => {
        return categories.find(cat => cat.name === categoryName)
    }

    return {
        categories,
        loading,
        error,
        addCategory,
        updateCategory,
        deleteCategory,
        getGroupedCategories,
        getCategoryById,
        getCategoryByName,
        refreshCategories: loadCategories
    }
}