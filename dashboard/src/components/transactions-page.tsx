"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, FilterIcon, SearchIcon } from "lucide-react"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MainNav } from "./main-nav"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Slider } from "./ui/slider"
import { TransactionsTable } from "./transactions-table"
import { useTransactionStore } from "@/lib/store/transaction-store"

export function TransactionsPage() {
  const { setFilters, fetchTransactions, filters, resetFilters } = useTransactionStore()

  const [startDate, setStartDate] = useState<Date | undefined>(filters.startDate ? new Date(filters.startDate) : undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(filters.endDate ? new Date(filters.endDate) : undefined)
  const [category, setCategory] = useState<string>(filters.categoryId || "all")
  const [type, setType] = useState<string>(filters.type || "all")
  const [amountRange, setAmountRange] = useState([0, 5000])
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const formatDateForApi = (date?: Date) => {
    if (!date) return undefined
    return format(date, "yyyy-MM-dd")
  }

  const applyFilters = () => {
    const newFilters = {
      startDate: formatDateForApi(startDate),
      endDate: formatDateForApi(endDate),
      categoryId: category !== "all" ? category : undefined,
      type: (type !== "all" ? type : "all") as "all" | "income" | "expense" | "transfer",
      page: "1", 
    }
    
    setFilters(newFilters)
    fetchTransactions()
  }

  const handleResetFilters = () => {
    resetFilters()
    setStartDate(undefined)
    setEndDate(undefined)
    setCategory("all")
    setType("all")
    setAmountRange([0, 5000])
    setSearchQuery("")
    fetchTransactions()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Narrow down your transactions by applying filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="grid gap-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="search" 
                    type="search" 
                    placeholder="Search transactions..." 
                    className="pl-8" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDate"
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "yyyy-MM-dd") : <span>Start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="endDate"
                      variant={"outline"}
                      className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "yyyy-MM-dd") : <span>End date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="investments">Investments</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Transaction Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 md:col-span-2">
                <div className="flex items-center justify-between">
                  <Label>Amount Range</Label>
                  <span className="text-sm text-muted-foreground">
                    ${amountRange[0]} - ${amountRange[1]}
                  </span>
                </div>
                <Slider defaultValue={[0, 5000]} max={5000} step={100} onValueChange={setAmountRange} />
              </div>
              <div className="flex items-end gap-4 md:col-span-2">
                <Button className="w-full md:w-auto" onClick={applyFilters}>
                  <FilterIcon className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
                <Button variant="outline" className="w-full md:w-auto" onClick={handleResetFilters}>
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <TransactionsTable />
      </div>
    </div>
  )
}

