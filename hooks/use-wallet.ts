"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/components/providers/auth-provider"
import type { Wallet } from "@/lib/types"
import { firestoreService } from "@/lib/firestore"

export function useWallet() {
    const { user } = useAuthContext()
    const [wallet, setWallet] = useState<Wallet | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadWallet = async () => {
        if (!user) {
            setWallet(null)
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const { wallet: fetchedWallet, error: fetchError } = await firestoreService.getWallet(user.id)

            if (fetchError) {
                // If wallet doesn't exist, create one
                if (fetchError.includes("Wallet not found") || fetchError.includes("not found")) {
                    const { wallet: newWallet, error: createError } = await firestoreService.createWallet({
                        userId: user.id,
                        balance: 0
                    })

                    if (createError || !newWallet) {
                        setError(createError || "Failed to create wallet")
                        setWallet(null)
                    } else {
                        setWallet(newWallet)
                        setError(null)
                    }
                } else {
                    setError(fetchError)
                    setWallet(null)
                }
            } else {
                setWallet(fetchedWallet)
                setError(null)
            }
        } catch (err: any) {
            setError(err.message || "Failed to load wallet")
            setWallet(null)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadWallet()
    }, [user])

    const updateWalletBalance = async (newBalance: number) => {
        if (!user || !wallet) return { success: false, error: "Wallet not available" }

        try {
            const { error: updateError } = await firestoreService.updateWallet(wallet.id, { balance: newBalance })

            if (updateError) {
                setError(updateError)
                return { success: false, error: updateError }
            } else {
                setWallet(prev => prev ? { ...prev, balance: newBalance, updatedAt: new Date() } : null)
                setError(null)
                return { success: true, error: null }
            }
        } catch (err: any) {
            const errorMessage = err.message || "Failed to update wallet"
            setError(errorMessage)
            return { success: false, error: errorMessage }
        }
    }

    const addMoney = async (amount: number) => {
        if (!wallet) return { success: false, error: "Wallet not available" }
        return await updateWalletBalance(wallet.balance + amount)
    }

    const deductMoney = async (amount: number) => {
        if (!wallet) return { success: false, error: "Wallet not available" }

        if (wallet.balance < amount) {
            return { success: false, error: "Insufficient balance" }
        }

        return await updateWalletBalance(wallet.balance - amount)
    }

    const canAfford = (amount: number) => {
        return wallet ? wallet.balance >= amount : false
    }

    return {
        wallet,
        loading,
        error,
        updateWalletBalance,
        addMoney,
        deductMoney,
        canAfford,
        refreshWallet: loadWallet
    }
}
