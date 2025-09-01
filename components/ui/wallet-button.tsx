"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { WalletDialog } from "./wallet-dialog"

export function WalletButton() {
  const { wallet, loading } = useWallet()
  const [showDialog, setShowDialog] = useState(false)

  if (loading) {
    return (
      <Button variant="outline" size="sm" disabled className="h-9 px-3">
        <Wallet className="h-4 w-4 mr-2" />
        ...
      </Button>
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDialog(true)}
        className="h-9 px-3"
      >
        <Wallet className="h-4 w-4 mr-2" />
        ₹{wallet?.balance?.toLocaleString() || "0"}
      </Button>
      
      <WalletDialog 
        open={showDialog} 
        onOpenChange={setShowDialog} 
      />
    </>
  )
}
