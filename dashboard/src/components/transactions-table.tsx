"use client"

import { useEffect, useState } from "react"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
  RepeatIcon,
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
import { useTransactionStore } from "@/lib/store/transaction-store"

export function TransactionsTable() {
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  
  const { 
    transactions, 
    totalCount, 
    currentPage, 
    pageLimit, 
    isLoading, 
    error,
    fetchTransactions, 
    deleteTransaction,
    setFilters 
  } = useTransactionStore()

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const totalPages = Math.ceil(totalCount / pageLimit)

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setIsEditTransactionOpen(true)
  }

  const handlePageChange = (page) => {
    setFilters({ page: page.toString() })
    fetchTransactions()
  }

  const handleEditModalChange = (open: boolean) => {
    setIsEditTransactionOpen(open)
    
    if (!open) {
      setEditingTransaction(null)
      fetchTransactions()
    }
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case "income":
        return <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
      case "expense":
        return <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
      case "transfer":
        return <RepeatIcon className="mr-1 h-4 w-4 text-blue-500" />
      default:
        return <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
    }
  }

  const getAmountColor = (type) => {
    switch (type) {
      case "income":
        return "text-green-500"
      case "expense":
        return "text-red-500"
      case "transfer":
        return "text-blue-500"
      default:
        return "text-red-500"
    }
  }

  return (
    <div className="space-y-4">
      {isLoading && <div className="text-center">Loading transactions...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      
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
            {transactions.map((transaction) => (
              <TableRow key={transaction._id || transaction.id}>
                <TableCell>{format(new Date(transaction.date), "MMM dd, yyyy")}</TableCell>
                <TableCell>{transaction.description || "No description"}</TableCell>
                <TableCell>{transaction.categoryId}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    {getTransactionIcon(transaction.type)}
                    <span className={getAmountColor(transaction.type)}>
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
                      <DropdownMenuItem onClick={() => handleEditTransaction(transaction)}>
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => deleteTransaction(transaction._key || transaction.id)}>
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
          Showing {transactions.length > 0 ? ((currentPage - 1) * pageLimit + 1) : 0} to{" "}
          {Math.min(currentPage * pageLimit, totalCount)}{" "}
          of {totalCount} transactions
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeftIcon className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <AddTransactionModal 
        open={isEditTransactionOpen} 
        onOpenChange={handleEditModalChange}
        transactionToEdit={editingTransaction}
      />
    </div>
  )
}

