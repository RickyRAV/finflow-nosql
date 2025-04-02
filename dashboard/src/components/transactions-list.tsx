"use client"

import { useEffect, useState } from "react"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useTransactionStore } from "@/lib/store/transaction-store"
import { Transaction } from "@/lib/api-client"

export function TransactionsList({ limit = 5 }: { limit?: number }) {
  const { transactions, fetchTransactions, isLoading, error } = useTransactionStore()
  
  useEffect(() => {
    console.log("TransactionsList: Fetching transactions")
    fetchTransactions()
  }, [fetchTransactions])

  const recentTransactions = transactions && transactions.length > 0
    ? transactions
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
    : []

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(limit).fill(0).map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="h-9 w-9 rounded-full bg-slate-200" />
            <div className="ml-4 space-y-1 flex-1">
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="h-3 w-24 bg-slate-200 rounded" />
            </div>
            <div className="h-4 w-16 ml-auto bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">Error loading transactions: {error}</div>
  }

  if (!transactions || recentTransactions.length === 0) {
    return <div className="text-center text-muted-foreground">No transactions found</div>
  }

  return (
    <div className="space-y-4">
      {recentTransactions.map((transaction) => (
        <div key={transaction.id || transaction._key} className="flex items-center">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              transaction.type === "income" ? "bg-green-100" : "bg-red-100",
            )}
          >
            {transaction.type === "income" ? (
              <ArrowUpIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-sm text-muted-foreground">
              {transaction.categoryId} • {format(new Date(transaction.date), "MMM dd")}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <span className={transaction.type === "income" ? "text-green-500" : "text-red-500"}>
              {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

