"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, List, BarChart3, Users } from "lucide-react"

export function QuickActions() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Link href="/expenses" className="block">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </Link>

          <Link href="/expenses" className="block">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <List className="w-4 h-4 mr-2" />
              View All Expenses
            </Button>
          </Link>

          <Link href="/dashboard" className="block">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </Button>
          </Link>

          <Link href="/community" className="block">
            <Button variant="outline" className="w-full justify-start bg-transparent">
              <Users className="w-4 h-4 mr-2" />
              Community
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
