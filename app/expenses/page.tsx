"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AuthHeader } from "@/components/auth/auth-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useExpenses } from "@/hooks/use-expenses"
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog"
import { EditExpenseDialog } from "@/components/expenses/edit-expense-dialog"
import { ExpenseCard } from "@/components/expenses/expense-card"
import { Plus, ChevronLeft, ChevronRight, Calendar } from "lucide-react"

export default function ExpensesPage() {
  const { expenses, loading, refetch } = useExpenses()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingExpense, setEditingExpense] = useState<any>(null)

  // Auto-refresh when dialog closes
  const handleDialogChange = (open: boolean) => {
    setShowAddDialog(open)
    if (!open) {
      // Refresh expenses when dialog closes
      setTimeout(() => {
        refetch()
      }, 100)
    }
  }

  const formatDate = (date: Date) => {
    // Use local date components to avoid timezone issues
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const isSameDay = (date1: Date, date2: Date) => {
    // Compare year, month, and day directly to avoid timezone issues
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getExpensesForDate = (date: Date) => {
    const filtered = expenses.filter((expense) => {
      // Handle both Date objects and Firestore Timestamp objects
      let expenseDate: Date
      if (expense.date instanceof Date) {
        expenseDate = expense.date
      } else if (expense.date && typeof (expense.date as any).toDate === 'function') {
        // Firestore Timestamp
        expenseDate = (expense.date as any).toDate()
      } else {
        // String date
        expenseDate = new Date(expense.date)
      }
      
      const matches = isSameDay(expenseDate, date)
      
      // Debug logging (remove in production)
      if (process.env.NODE_ENV === 'development') {
        console.log('Date comparison:', {
          expenseDate: expenseDate.toISOString().split('T')[0],
          selectedDate: date.toISOString().split('T')[0],
          matches,
          expenseId: expense.id
        })
      }
      
      return matches
    })
    
    return filtered
  }

  const getTotalForDate = (date: Date) => {
    return getExpensesForDate(date).reduce((sum, expense) => sum + expense.amount, 0)
  }

  const selectedDateExpenses = getExpensesForDate(selectedDate)
  const selectedDateTotal = getTotalForDate(selectedDate)

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1)
      } else {
        newMonth.setMonth(prev.getMonth() + 1)
      }
      return newMonth
    })
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AuthHeader />

        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-foreground">Expense Calendar</h1>
              <Calendar className="w-6 h-6 text-muted-foreground" />
            </div>

            {/* Calendar Navigation */}
            <div className="flex items-center justify-between bg-card rounded-lg p-4">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")} className="h-8 w-8 p-0">
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <h2 className="text-lg font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>

              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")} className="h-8 w-8 p-0">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="grid grid-cols-7 gap-1">
                {getDaysInMonth(currentMonth).map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-12 sm:h-16"></div>
                  }

                  const dayExpenses = getExpensesForDate(day)
                  const dayTotal = getTotalForDate(day)
                  const isSelected = isSameDay(day, selectedDate)
                  const isToday = isSameDay(day, new Date())

                  return (
                    <button
                      key={day.getDate()}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        h-12 sm:h-16 p-1 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center text-xs sm:text-sm
                        ${isSelected
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-card hover:bg-muted border-border"
                        }
                        ${isToday && !isSelected ? "border-primary border-2" : ""}
                      `}
                    >
                      <span className="font-medium">{day.getDate()}</span>
                      {dayExpenses.length > 0 && (
                        <div className="flex flex-col items-center mt-1">
                          <div className="w-1 h-1 bg-current rounded-full"></div>
                          <span className="text-[10px] opacity-75">₹{dayTotal}</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {selectedDate.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardTitle>
                  <Button onClick={() => setShowAddDialog(true)} size="sm" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Expense
                  </Button>
                </div>
                {selectedDateTotal > 0 && (
                  <p className="text-sm text-muted-foreground">Total: ₹{selectedDateTotal.toLocaleString()}</p>
                )}
              </CardHeader>

              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-6 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : selectedDateExpenses.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                      <Plus className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">No expenses for this date</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add your first expense for {selectedDate.toLocaleDateString()}
                    </p>
                    <Button onClick={() => setShowAddDialog(true)} size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Expense
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedDateExpenses.map((expense) => (
                      <ExpenseCard
                        key={expense.id}
                        expense={expense}
                        onEdit={() => setEditingExpense(expense)}
                        onDelete={() => {
                          // Refresh expenses after deletion
                          setTimeout(() => {
                            refetch()
                          }, 100)
                        }}
                        viewMode="list"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <AddExpenseDialog open={showAddDialog} onOpenChange={handleDialogChange} defaultDate={selectedDate} />

        {editingExpense && (
          <EditExpenseDialog
            expense={editingExpense}
            open={!!editingExpense}
            onOpenChange={(open) => !open && setEditingExpense(null)}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
