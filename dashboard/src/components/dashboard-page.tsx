"use client"

import { useState } from "react"
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "./main-nav"
import { TransactionsList } from "./transactions-list"
import { SpendingByCategory } from "./spending-by-category"
import { MonthlyChart } from "./monthly-chart"
import { SankeyDiagram } from "./sankey-diagram"
import { AddTransactionModal } from "./add-transaction-modal"

export function DashboardPage() {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <AddTransactionModal open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen} />
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <ArrowUpIcon className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">$3,450</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <ArrowDownIcon className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">$2,180</div>
                  <p className="text-xs text-muted-foreground">+10.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                  <DollarSignIcon className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">$1,270</div>
                  <p className="text-xs text-muted-foreground">+42.5% from last month</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-7">
              <Card className="col-span-7 md:col-span-4">
                <CardHeader>
                  <CardTitle>Money Flow</CardTitle>
                  <CardDescription>Visualize how your money flows from income to expenses</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <SankeyDiagram />
                </CardContent>
              </Card>
              <Card className="col-span-7 md:col-span-3">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                  <CardDescription>Your spending distribution across categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <SpendingByCategory />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-7 md:col-span-4">
                <CardHeader>
                  <CardTitle>Monthly Income vs Expenses</CardTitle>
                  <CardDescription>Compare your income and expenses over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <MonthlyChart />
                </CardContent>
              </Card>
              <Card className="col-span-7 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your most recent financial activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionsList limit={5} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-7">
                <CardHeader>
                  <CardTitle>Advanced Analytics</CardTitle>
                  <CardDescription>Detailed analysis of your financial patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded-md">
                    <p className="text-muted-foreground">Advanced analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

