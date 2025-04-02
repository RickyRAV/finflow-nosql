import { create } from "zustand"
import { apiClient, Transaction } from "../api-client"

interface TransactionFilters {
  startDate?: string
  endDate?: string
  categoryId?: string
  type?: "income" | "expense" | "transfer" | "all"
  page?: string
  limit?: string
}

// API response format
interface TransactionResponse {
  data: Transaction[]
  total: number
  page: number
  limit: number
}

interface TransactionState {
  transactions: Transaction[]
  totalCount: number
  currentPage: number
  pageLimit: number
  filters: TransactionFilters
  isLoading: boolean
  error: string | null

  fetchTransactions: () => Promise<void>
  addTransaction: (transaction: Omit<Transaction, "id">) => Promise<Transaction>
  updateTransaction: (id: string, data: Omit<Transaction, "id">) => Promise<Transaction>
  deleteTransaction: (id: string) => Promise<void>
  setFilters: (filters: Partial<TransactionFilters>) => void
  resetFilters: () => void
}

// Sample transactions for demo
const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "tx_1",
    date: "2024-04-01",
    description: "Rent Payment",
    categoryId: "housing",
    amount: 1200,
    type: "expense",
    accountId: "default-checking",
    tags: ["housing", "monthly"],
    notes: "Monthly rent payment"
  },
  {
    id: "tx_2",
    date: "2024-04-02",
    description: "Salary Deposit",
    categoryId: "salary",
    amount: 3000,
    type: "income",
    accountId: "default-checking",
    tags: ["salary", "monthly"],
    notes: "Monthly salary deposit"
  },
  {
    id: "tx_3",
    date: "2024-04-03",
    description: "Grocery Shopping",
    categoryId: "food",
    amount: 150.75,
    type: "expense",
    accountId: "default-checking",
    tags: ["food", "groceries"],
    notes: "Weekly grocery shopping"
  },
  {
    id: "tx_4",
    date: "2024-04-05",
    description: "Gas Station",
    categoryId: "transportation",
    amount: 45.5,
    type: "expense",
    accountId: "default-checking",
    tags: ["transportation", "car"],
    notes: "Monthly fuel"
  },
  {
    id: "tx_5",
    date: "2024-04-07",
    description: "Movie Tickets",
    categoryId: "entertainment",
    amount: 30,
    type: "expense",
    accountId: "default-checking",
    tags: ["entertainment", "movies"],
    notes: "Weekend movie"
  },
  {
    id: "tx_6",
    date: "2024-04-10",
    description: "Freelance Payment",
    categoryId: "freelance",
    amount: 450,
    type: "income",
    accountId: "default-checking",
    tags: ["freelance", "income"],
    notes: "Web development project payment"
  }
];

function filterTransactions(transactions: Transaction[], filters: TransactionFilters): Transaction[] {
  return transactions.filter(tx => {
    if (filters.startDate && new Date(tx.date) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(tx.date) > new Date(filters.endDate)) {
      return false;
    }
    
    if (filters.categoryId && tx.categoryId !== filters.categoryId) {
      return false;
    }
    
    if (filters.type && filters.type !== 'all' && tx.type !== filters.type) {
      return false;
    }
    
    return true;
  });
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  totalCount: 0,
  currentPage: 1,
  pageLimit: 20,
  filters: {
    type: "all",
  },
  isLoading: false,
  error: null,

  fetchTransactions: async () => {
    set({ isLoading: true, error: null })

    try {
      const { filters } = get()
      const queryParams: Record<string, string> = {}
      
      if (filters.startDate) queryParams.startDate = filters.startDate
      if (filters.endDate) queryParams.endDate = filters.endDate
      if (filters.categoryId) queryParams.categoryId = filters.categoryId
      if (filters.type && filters.type !== 'all') queryParams.type = filters.type
      if (filters.page) queryParams.page = filters.page
      if (filters.limit) queryParams.limit = filters.limit

      console.log('Fetching transactions from API:', queryParams)
      const response = await apiClient.api.v1.transactions.$get({
        query: queryParams
      })

      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }

      const responseData = await response.json() as TransactionResponse
      console.log('Transactions received:', responseData)
      
      const { data, total, page, limit } = responseData
      
      set({
        transactions: data,
        totalCount: total,
        currentPage: page,
        pageLimit: limit,
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching transactions:", error)
      set({
        error: error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      })
    }
  },

  addTransaction: async (transactionData) => {
    set({ isLoading: true, error: null })

    try {
      console.log('Adding transaction to API:', transactionData)
      const response = await apiClient.api.v1.transactions.$post({
        json: transactionData
      })

      if (!response.ok) {
        throw new Error('Failed to add transaction')
      }

      const newTransaction = await response.json() as Transaction
      console.log('Transaction added:', newTransaction)
      set((state) => ({
        transactions: [...state.transactions, newTransaction],
        isLoading: false,
      }))

      return newTransaction
    } catch (error) {
      console.error("Error adding transaction:", error)
      set({
        error: error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      })
      throw error
    }
  },

  updateTransaction: async (id, data) => {
  set({ isLoading: true, error: null })

  try {
    console.log('Updating transaction in API:', id, data)
    const response = await apiClient.api.v1.transactions[':id'].$put({
      param: { id },
      json: data
    })

    if (!response.ok) {
      throw new Error('Failed to update transaction')
    }

    const updatedTransaction = await response.json() as Transaction
    console.log('Transaction updated:', updatedTransaction)
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        (transaction._key === id || transaction.id === id) ? updatedTransaction : transaction
      ),
      isLoading: false,
    }))
    
    return updatedTransaction
  } catch (error) {
    console.error("Error updating transaction:", error)
    set({
      error: error instanceof Error ? error.message : "An unknown error occurred",
      isLoading: false,
    })
    throw error
  }
},

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null })

    try {
      console.log('Deleting transaction from API:', id)
      const response = await apiClient.api.v1.transactions[':id'].$delete({
        param: { id }
      })

      if (!response.ok) {
        throw new Error('Failed to delete transaction')
      }

      console.log('Transaction deleted:', id)
      set((state) => ({
        transactions: state.transactions.filter((transaction) => 
          transaction._key !== id && transaction.id !== id
        ),
        isLoading: false,
      }))
      
      get().fetchTransactions()
    } catch (error) {
      console.error("Error deleting transaction:", error)
      set({
        error: error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      })
      throw error
    }
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    }))
  },

  resetFilters: () => {
    set({
      filters: {
        type: "all",
      },
    })
  },
}))

