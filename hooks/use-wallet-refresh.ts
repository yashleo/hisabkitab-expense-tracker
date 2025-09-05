"use client"

import { createContext, useContext, useCallback } from "react"

type WalletRefreshContextType = {
  triggerRefresh: () => void
  registerRefreshHandler: (handler: () => void) => void
}

const WalletRefreshContext = createContext<WalletRefreshContextType | null>(null)

// Global refresh handler
let globalRefreshHandler: (() => void) | null = null

export function useWalletRefresh() {
  const triggerRefresh = useCallback(() => {
    if (globalRefreshHandler) {
      globalRefreshHandler()
    }
  }, [])

  const registerRefreshHandler = useCallback((handler: () => void) => {
    globalRefreshHandler = handler
  }, [])

  return {
    triggerRefresh,
    registerRefreshHandler
  }
}
