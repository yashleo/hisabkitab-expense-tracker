"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"

interface DashboardStatsProps {
  data: {
    totalThisMonth: number
    totalPrevMonth: number
    totalAllTime: number
    monthlyChange: number
    expenseCount: number
  }
  loading: boolean
}

export function DashboardStats({ data, loading }: DashboardStatsProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse"></div>
                <div className="h-8 bg-muted rounded animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const isPositiveChange = data.monthlyChange >= 0
  const changeColor = isPositiveChange ? "text-red-500" : "text-green-500"
  const ChangeIcon = isPositiveChange ? TrendingUp : TrendingDown

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Expense Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* This Month */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-muted-foreground">This Month</p>
            </div>
            <p className="text-3xl font-bold text-foreground">₹{data.totalThisMonth.toLocaleString()}</p>
            <div className="flex items-center gap-2">
              <ChangeIcon className={`w-4 h-4 ${changeColor}`} />
              <span className={`text-sm font-medium ${changeColor}`}>{Math.abs(data.monthlyChange).toFixed(1)}%</span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          </div>

          {/* All Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-secondary" />
              <p className="text-sm font-medium text-muted-foreground">All Time</p>
            </div>
            <p className="text-3xl font-bold text-foreground">₹{data.totalAllTime.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{data.expenseCount} total expenses</p>
          </div>

          {/* Last Month */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Last Month</p>
            <p className="text-2xl font-bold text-muted-foreground">₹{data.totalPrevMonth.toLocaleString()}</p>
          </div>

          {/* Average */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Monthly Average</p>
            <p className="text-2xl font-bold text-muted-foreground">
              ₹
              {data.expenseCount > 0
                ? Math.round(data.totalAllTime / Math.max(1, new Date().getMonth() + 1)).toLocaleString()
                : "0"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
