"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useWallet } from "@/hooks/use-wallet"
import { Loader2, Wallet, Plus, Minus } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface WalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletDialog({ open, onOpenChange }: WalletDialogProps) {
  const { wallet, loading, addMoney, updateWalletBalance } = useWallet()
  const [amount, setAmount] = useState("")
  const [operation, setOperation] = useState<"add" | "set">("add")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setAmount("")
      setOperation("add")
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid positive amount.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      let result
      if (operation === "add") {
        result = await addMoney(Number(amount))
      } else {
        result = await updateWalletBalance(Number(amount))
      }

      if (result.success) {
        toast({
          title: "Success",
          description: operation === "add" 
            ? `₹${amount} added to wallet successfully!`
            : `Wallet balance updated to ₹${amount}!`,
        })
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update wallet",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            Manage Wallet
          </DialogTitle>
          <DialogDescription>
            Current Balance: ₹{wallet?.balance?.toLocaleString() || "0"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 mb-4">
              <Button
                type="button"
                variant={operation === "add" ? "default" : "outline"}
                size="sm"
                onClick={() => setOperation("add")}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Money
              </Button>
              <Button
                type="button"
                variant={operation === "set" ? "default" : "outline"}
                size="sm"
                onClick={() => setOperation("set")}
                className="flex-1"
              >
                <Wallet className="w-4 h-4 mr-1" />
                Set Balance
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">
                {operation === "add" ? "Amount to Add" : "New Balance"}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {operation === "add" ? "Add Money" : "Update Balance"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
