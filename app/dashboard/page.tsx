"use client"

import { useMemo, useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { AuthHeader } from "@/components/auth/auth-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useExpenses } from "@/hooks/use-expenses"
import { useAuthContext } from "@/components/providers/auth-provider"
import { DEFAULT_CATEGORIES } from "@/lib/types"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentExpenses } from "@/components/dashboard/recent-expenses"
import { CategoryChart } from "@/components/dashboard/category-chart"
import { MonthlyTrend } from "@/components/dashboard/monthly-trend"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { Plus, Calendar, PieChart, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuthContext()
  const { 
    expenses, 
    loading, 
    getExpensesByCategory, 
    getMonthlyExpenses,
    getTotalExpenses,
    getRecentExpenses
  } = useExpenses()

  const [categoryData, setCategoryData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return

      try {
        const [categoryStats, monthlyStats] = await Promise.all([
          getExpensesByCategory(),
          getMonthlyExpenses()
        ])
        
        // Transform category data to match CategoryChart component expectations
        const transformedCategoryData = categoryStats.map((cat: any) => {
          const defaultCategory = DEFAULT_CATEGORIES.find(dc => dc.name === cat.category)
          return {
            id: cat.category,
            name: cat.category,
            icon: "📊", // Default icon since DEFAULT_CATEGORIES doesn't have icons
            color: defaultCategory?.color || "#6b7280", // Fallback color
            total: cat.amount,
            count: cat.count
          }
        })
        
        setCategoryData(transformedCategoryData)
        setMonthlyData(monthlyStats)
      } catch (error) {
        console.error("Error loading analytics:", error)
      }
    }

    loadAnalytics()
  }, [user, expenses])

  const dashboardData = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Current month expenses
    const currentMonthExpenses = expenses.filter((expense) => {
      const expenseDate = expense.date
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
    })

    // Previous month expenses
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear
    const prevMonthExpenses = expenses.filter((expense) => {
      const expenseDate = expense.date
      return expenseDate.getMonth() === prevMonth && expenseDate.getFullYear() === prevYear
    })

    // Today's expenses
    const today = now.toDateString()
    const todayExpenses = expenses.filter((expense) => expense.date.toDateString() === today)

    // Calculate totals
    const totalThisMonth = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalPrevMonth = prevMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalToday = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalAllTime = getTotalExpenses()

    // Calculate percentage change
    const monthlyChange = totalPrevMonth > 0 ? ((totalThisMonth - totalPrevMonth) / totalPrevMonth) * 100 : 0

    return {
      totalThisMonth,
      totalPrevMonth,
      totalToday,
      totalAllTime,
      monthlyChange,
      currentMonthExpenses,
      todayExpenses,
      categoryTotals: categoryData,
      expenseCount: expenses.length,
      avgDaily: totalThisMonth / now.getDate(),
    }
  }, [expenses, categoryData, getTotalExpenses])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <AuthHeader />

        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {getGreeting()}, {user?.name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">Here's your expense overview for today.</p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Stats - Spans 2 columns on large screens */}
            <div className="lg:col-span-2">
              <DashboardStats data={dashboardData} loading={loading} />
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <QuickActions />
            </div>

            {/* Today's Summary */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Today
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold text-foreground">₹{dashboardData.totalToday.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{dashboardData.todayExpenses.length} expenses</p>
                    </div>
                    {dashboardData.todayExpenses.length > 0 ? (
                      <div className="space-y-2">
                        {dashboardData.todayExpenses.slice(0, 2).map((expense) => (
                          <div key={expense.id} className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground truncate">
                              {expense.description || expense.category}
                            </span>
                            <span className="font-medium">₹{expense.amount}</span>
                          </div>
                        ))}
                        {dashboardData.todayExpenses.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{dashboardData.todayExpenses.length - 2} more
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No expenses today</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Breakdown - Spans 2 columns */}
            <div className="lg:col-span-2">
              <CategoryChart data={categoryData} loading={loading} />
            </div>

            {/* Monthly Trend */}
            <div className="lg:col-span-2">
              <MonthlyTrend expenses={expenses} loading={loading} />
            </div>

            {/* Recent Expenses - Spans full width */}
            <div className="lg:col-span-4">
              <RecentExpenses expenses={getRecentExpenses(5)} loading={loading} />
            </div>

            {/* Additional Stats Cards */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-secondary" />
                    Average Daily
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{Math.round(dashboardData.avgDaily).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-accent" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-foreground">{dashboardData.categoryTotals.length}</p>
                  <p className="text-sm text-muted-foreground">Active this month</p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Top Categories This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardData.categoryTotals
                      .sort((a, b) => b.total - a.total)
                      .slice(0, 3)
                      .map((category, index) => {
                        const categoryKey = category.id || category.name || `category-${index}`
                        return (
                        <div key={categoryKey} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ backgroundColor: category.color }}>
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{category.name}</p>
                              <p className="text-xs text-muted-foreground">{category.count || 0} expenses</p>
                            </div>
                          </div>
                          <p className="font-semibold text-foreground">₹{(category.total || 0).toLocaleString()}</p>
                        </div>
                        )
                      })}
                    {dashboardData.categoryTotals.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No expenses this month</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          {expenses.length === 0 && (
            <Card className="mt-8 text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Start Tracking Your Expenses</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add your first expense to see insights, trends, and take control of your spending habits.
                </p>
                <Link href="/expenses">
                  <Button size="lg">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Your First Expense
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
