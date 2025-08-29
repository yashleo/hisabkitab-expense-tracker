"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "lucide-react"

interface CategoryData {
  id: string
  name: string
  color: string
  total: number
  count: number
}

interface CategoryChartProps {
  data: CategoryData[]
  loading: boolean
}

export function CategoryChart({ data, loading }: CategoryChartProps) {
  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg animate-pulse"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-20 animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-16 animate-pulse"></div>
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

  const total = data.reduce((sum, category) => sum + category.total, 0)

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChart className="w-5 h-5 text-primary" />
          Category Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            {data
              .sort((a, b) => b.total - a.total)
              .map((category) => {
                const percentage = total > 0 ? (category.total / total) * 100 : 0
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center`} style={{ backgroundColor: category.color }}>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{category.name}</p>
                          <p className="text-xs text-muted-foreground">{category.count} expenses</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₹{category.total.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className={`h-2 rounded-full ${category.color}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <div className="text-center py-8">
            <PieChart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No expenses to categorize yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
