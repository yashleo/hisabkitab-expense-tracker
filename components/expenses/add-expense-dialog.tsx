"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useExpenses } from "@/hooks/use-expenses"
import { useWallet } from "@/hooks/use-wallet"
import { DEFAULT_CATEGORIES } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultDate?: Date
}

export function AddExpenseDialog({ open, onOpenChange, defaultDate }: AddExpenseDialogProps) {
  const { addExpense } = useExpenses()
  const { wallet } = useWallet()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    category: "",
    location: "",
    description: "",
    deductFromWallet: false,
  })

  useEffect(() => {
    if (open) {
      // Always set to tomorrow's date when dialog opens, unless defaultDate is provided
      let dateToUse: Date
      if (defaultDate) {
        dateToUse = defaultDate
      } else {
        dateToUse = new Date()
        dateToUse.setDate(dateToUse.getDate() + 1) // Shift 1 day to the right (tomorrow)
      }
      setFormData((prev) => ({
        ...prev,
        date: dateToUse.toISOString().split("T")[0],
      }))
    }
  }, [open, defaultDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.amount || !formData.category) return

    const amount = Number.parseFloat(formData.amount)

    setLoading(true)

    try {
      const result = await addExpense({
        amount,
        date: new Date(formData.date + 'T00:00:00'), // Force local time to avoid timezone shifts
        category: formData.category,
        location: formData.location || undefined,
        description: formData.description || undefined,
        deductFromWallet: formData.deductFromWallet,
      })

      if (result) {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1) // Shift 1 day to the right (tomorrow)
        
        setFormData({
          amount: "",
          date: tomorrow.toISOString().split("T")[0],
          category: "",
          location: "",
          description: "",
          deductFromWallet: false,
        })
        onOpenChange(false)
      }
    } catch (error: any) {
      alert(error.message || "Failed to add expense")
    }

    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ 
      ...prev, 
      [field]: field === "deductFromWallet" ? value === "true" : value 
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
          <DialogDescription>
            {defaultDate
              ? `Record a new expense for ${defaultDate.toLocaleDateString()}`
              : "Record a new expense to track your spending."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">₹</span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="pl-8"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_CATEGORIES.map((category, index) => (
                  <SelectItem key={`${category.name}-${index}`} value={category.name}>
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></span>
                      {category.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="Where did you spend this?"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="What was this expense for?"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="deductFromWallet"
              checked={formData.deductFromWallet}
              onCheckedChange={(checked) => 
                handleInputChange("deductFromWallet", checked ? "true" : "false")
              }
            />
            <Label htmlFor="deductFromWallet" className="text-sm font-normal">
              Deduct from wallet balance (₹{wallet?.balance?.toFixed(2) || "0.00"} available)
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.amount || !formData.category}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Expense"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
