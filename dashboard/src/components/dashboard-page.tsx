"use client"

import { useState, useEffect } from "react"
import { ArrowDownIcon, ArrowUpIcon, DollarSignIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MainNav } from "./main-nav"
import { TransactionsList } from "./transactions-list"
import { SpendingByCategory } from "./spending-by-category"
import { MonthlyChart } from "./monthly-chart"
import { SankeyDiagram } from "./sankey-diagram"
import { AddTransactionModal } from "./add-transaction-modal"
import { useAccountStore } from "@/lib/store/account-store"
import { useTransactionStore } from "@/lib/store/transaction-store"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import { apiClient } from "@/lib/api-client"

export function DashboardPage() {
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  
  const { accounts, fetchAccounts, isLoading: accountsLoading, error: accountsError } = useAccountStore()
  const { transactions, fetchTransactions, isLoading: transactionsLoading, error: transactionsError } = useTransactionStore()
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.api.v1.accounts.$get()
      .then(res => {
        console.log('Direct fetch response:', res)
        return res.json()
      })
      .then(data => console.log('Direct fetch data:', data))
      .catch(err => console.error('Direct fetch error:', err))

    Promise.all([fetchAccounts(), fetchTransactions()])
      .then(() => setLoading(false))
      .catch(error => {
        console.error('Error loading dashboard data:', error)
        setLoading(false)
      })
  }, [fetchAccounts, fetchTransactions])

  const totalIncome = transactions
    ? transactions.filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
    : 0
  
  const totalExpenses = transactions
    ? transactions.filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
    : 0
  
  const balance = accounts
    ? accounts.reduce((sum, account) => sum + account.balance, 0)
    : 0

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowAddTransaction(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Transaction
            </Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Income
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">${loading ? '...' : totalIncome.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Expenses
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">${loading ? '...' : totalExpenses.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +10% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Current Balance
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">${loading ? '...' : balance.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Money Flow</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <MonthlyChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <SpendingByCategory />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-1">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Showing the most recent 5 transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TransactionsList limit={5} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <SpendingByCategory />
                </CardContent>
              </Card>
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Money Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <SankeyDiagram />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <AddTransactionModal 
        open={showAddTransaction}
        onOpenChange={setShowAddTransaction}
      />
    </div>
  )
}

