"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DEFAULT_CATEGORIES, type Expense } from "@/lib/types"
import { Clock, ArrowRight } from "lucide-react"

interface RecentExpensesProps {
  expenses: Expense[]
  loading: boolean
}

export function RecentExpenses({ expenses, loading }: RecentExpensesProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-32 animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="h-4 bg-muted rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Recent Expenses
        </CardTitle>
        <Link href="/expenses">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {expenses.length > 0 ? (
          <div className="space-y-4">
            {expenses.map((expense) => {
              const category = DEFAULT_CATEGORIES.find((c) => c.name === expense.category)
              const formattedDate = expense.date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
              })

              return (
                <div key={expense.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center`}
                      style={{ backgroundColor: category?.color || "#6b7280" }}
                    >
                      <span className="text-white text-sm font-semibold">{category?.name.charAt(0).toUpperCase() || "E"}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{expense.description || "Untitled Expense"}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {expense.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formattedDate}</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground">₹{expense.amount.toLocaleString()}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No recent expenses</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
