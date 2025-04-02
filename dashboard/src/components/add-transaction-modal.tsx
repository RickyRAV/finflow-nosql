"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { useTransactionStore } from "@/lib/store/transaction-store"
import { useCategoryStore } from "@/lib/store/category-store"
import { useAccountStore } from "@/lib/store/account-store"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const transactionFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  description: z.string(),
  categoryId: z.string().min(1, "Category is required"),
  date: z.date(),
  type: z.enum(["income", "expense", "transfer"]),
  accountId: z.string().min(1, "Account is required"),
})

type TransactionFormValues = z.infer<typeof transactionFormSchema>

export function AddTransactionModal({
  open,
  onOpenChange,
  transactionToEdit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactionToEdit?: any
}) {
  const { addTransaction, updateTransaction } = useTransactionStore()
  const { categories, fetchCategories } = useCategoryStore()
  const { accounts, fetchAccounts } = useAccountStore()

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: "",
      description: "",
      categoryId: "",
      date: new Date(),
      type: "expense",
      accountId: "",
    },
  })

  useEffect(() => {
    if (transactionToEdit) {
      form.reset({
        amount: transactionToEdit.amount.toString(),
        description: transactionToEdit.description,
        categoryId: transactionToEdit.category,
        date: new Date(transactionToEdit.date),
        type: transactionToEdit.type,
        accountId: transactionToEdit.accountId,
      })
    } else {
      form.reset({
        amount: "",
        description: "",
        categoryId: "",
        date: new Date(),
        type: "expense",
        accountId: accounts.length > 0 ? (accounts[0].id || accounts[0]._key || "") : "",
      })
    }
  }, [transactionToEdit, form, accounts])

  useEffect(() => {
    console.log("AddTransactionModal: Fetching categories and accounts")
    const loadData = async () => {
      try {
        if (categories.length === 0) {
          await fetchCategories()
        }
        
        if (accounts.length === 0) {
          await fetchAccounts()
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    
    loadData()
  }, [fetchCategories, fetchAccounts, categories.length, accounts.length])

  const [openCategoryCombobox, setOpenCategoryCombobox] = useState(false)

  async function onSubmit(data: TransactionFormValues) {
    try {
      const formattedDate = format(data.date, "yyyy-MM-dd")
      
      const amount = Number.parseFloat(data.amount)
      if (isNaN(amount) || amount <= 0) {
        console.error("Amount must be a positive number")
        alert("Amount must be a positive number")
        return
      }
      
      const transactionData = {
        ...data,
        amount: amount,
        date: formattedDate,
      }
      
      console.log("Submitting transaction data:", transactionData)
      
      if (transactionToEdit) {
        await updateTransaction(transactionToEdit.id || transactionToEdit._key || "", transactionData)
      } else {
        await addTransaction(transactionData)
      }
      
      onOpenChange(false)
      form.reset()
      console.log(transactionToEdit ? "Transaction updated" : "Transaction added")
      alert(transactionToEdit ? "Transaction updated" : "Transaction added")
    } catch (error) {
      console.error("Error saving transaction:", error)
      alert(`Failed to ${transactionToEdit ? "update" : "add"} transaction`)
    }
  }

  const getIdValue = (item: any): string => {
    return (item.id || item._key || "").toString();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{transactionToEdit ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          <DialogDescription>Enter the details of your transaction below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <Input className="pl-7" placeholder="0.00" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Grocery shopping" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Category</FormLabel>
                  <Popover open={openCategoryCombobox} onOpenChange={setOpenCategoryCombobox}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                        >
                          {field.value
                            ? categories.find((category) => getIdValue(category) === field.value)?.name
                            : "Select category"}
                          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search category..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map((category) => (
                              <CommandItem
                                value={getIdValue(category)}
                                key={getIdValue(category)}
                                onSelect={() => {
                                  form.setValue("categoryId", getIdValue(category))
                                  setOpenCategoryCombobox(false)
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    getIdValue(category) === field.value ? "opacity-100" : "opacity-0",
                                  )}
                                />
                                {category.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={getIdValue(account)} value={getIdValue(account)}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{transactionToEdit ? "Update" : "Save"} Transaction</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

