"use client"

import { useState } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddTransactionModal } from "@/components/add-transaction-modal"

// Mock data for transactions
const transactions = [
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
  {
    id: "6",
    date: new Date("2023-04-10"),
    description: "Freelance Payment",
    category: "Income",
    amount: 450,
    type: "income",
  },
  {
    id: "7",
    date: new Date("2023-04-12"),
    description: "Restaurant Dinner",
    category: "Food",
    amount: 85.2,
    type: "expense",
  },
  {
    id: "8",
    date: new Date("2023-04-15"),
    description: "Internet Bill",
    category: "Housing",
    amount: 60,
    type: "expense",
  },
  {
    id: "9",
    date: new Date("2023-04-18"),
    description: "Uber Ride",
    category: "Transportation",
    amount: 25.3,
    type: "expense",
  },
  {
    id: "10",
    date: new Date("2023-04-20"),
    description: "Concert Tickets",
    category: "Entertainment",
    amount: 120,
    type: "expense",
  },
]

export function TransactionsTable() {
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(transactions.length / itemsPerPage)

  const paginatedTransactions = transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{format(transaction.date, "MMM dd, yyyy")}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    {transaction.type === "income" ? (
                      <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
                    )}
                    <span className={transaction.type === "income" ? "text-green-500" : "text-red-500"}>
                      ${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setIsEditTransactionOpen(true)}>
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, transactions.length)}{" "}
          of {transactions.length} transactions
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <AddTransactionModal open={isEditTransactionOpen} onOpenChange={setIsEditTransactionOpen} />
    </div>
  )
}

