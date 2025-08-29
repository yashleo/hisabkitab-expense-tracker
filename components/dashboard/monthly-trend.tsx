"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import type { Expense } from "@/lib/types"

interface MonthlyTrendProps {
  expenses: Expense[]
  loading: boolean
}

export function MonthlyTrend({ expenses, loading }: MonthlyTrendProps) {
  const monthlyData = useMemo(() => {
    const months = []
    const now = new Date()

    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthExpenses = expenses.filter((expense) => {
        const expenseDate = expense.date
        return expenseDate.getMonth() === date.getMonth() && expenseDate.getFullYear() === date.getFullYear()
      })

      const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      months.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        total,
        count: monthExpenses.length,
      })
    }

    return months
  }, [expenses])

  const maxAmount = Math.max(...monthlyData.map((m) => m.total), 1)

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Monthly Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-end justify-between">
                <div className="h-3 bg-muted rounded w-8 animate-pulse"></div>
                <div className="h-8 bg-muted rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Monthly Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {monthlyData.map((month, index) => {
            const height = maxAmount > 0 ? (month.total / maxAmount) * 100 : 0
            return (
              <div key={index} className="flex items-end justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-sm font-medium text-muted-foreground w-8">{month.month}</span>
                  <div className="flex-1 bg-muted rounded-full h-3 relative overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${height}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">₹{month.total.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{month.count} expenses</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
