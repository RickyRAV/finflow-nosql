"use client"

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Mock data for recent transactions
const recentTransactions = [
  {
    id: "1",
    date: new Date("2023-04-01"),
    description: "Rent Payment",
    category: "Housing",
    amount: 1200,
    type: "expense",
  },
  {
    id: "2",
    date: new Date("2023-04-02"),
    description: "Salary Deposit",
    category: "Income",
    amount: 3000,
    type: "income",
  },
  {
    id: "3",
    date: new Date("2023-04-03"),
    description: "Grocery Shopping",
    category: "Food",
    amount: 150.75,
    type: "expense",
  },
  {
    id: "4",
    date: new Date("2023-04-05"),
    description: "Gas Station",
    category: "Transportation",
    amount: 45.5,
    type: "expense",
  },
  {
    id: "5",
    date: new Date("2023-04-07"),
    description: "Movie Tickets",
    category: "Entertainment",
    amount: 30,
    type: "expense",
  },
]

export function TransactionsList({ limit = 5 }: { limit?: number }) {
  const transactions = recentTransactions.slice(0, limit)

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
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
              {transaction.category} • {format(transaction.date, "MMM dd")}
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

