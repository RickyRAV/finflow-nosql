import { create } from "zustand"
import { apiClient, Account } from "../api-client"

interface AccountState {
  accounts: Account[]
  selectedAccountId: string | null
  isLoading: boolean
  error: string | null

  fetchAccounts: () => Promise<void>
  addAccount: (account: Omit<Account, "id">) => Promise<Account>
  updateAccount: (id: string, data: Omit<Account, "id">) => Promise<Account>
  deleteAccount: (id: string) => Promise<void>
  selectAccount: (id: string | null) => void
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  selectedAccountId: null,
  isLoading: false,
  error: null,

  fetchAccounts: async () => {
    set({ isLoading: true, error: null })

    try {
      console.log('Fetching accounts from API')
      const response = await apiClient.api.v1.accounts.$get()

      if (!response.ok) {
        throw new Error('Failed to fetch accounts')
      }

      const data = await response.json() as Account[]
      console.log('Accounts received:', data)
      set({
        accounts: data,
        isLoading: false,
      })
    } catch (error) {
      console.error("Error fetching accounts:", error)
      set({
        error: error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      })
    }
  },

  addAccount: async (accountData) => {
    set({ isLoading: true, error: null })

    try {
      console.log('Adding account to API:', accountData)
      const response = await apiClient.api.v1.accounts.$post({
        json: accountData
      })

      if (!response.ok) {
        throw new Error('Failed to add account')
      }

      const newAccount = await response.json() as Account
      console.log('Account added:', newAccount)
      set((state) => ({
        accounts: [...state.accounts, newAccount],
        isLoading: false,
      }))

      return newAccount
    } catch (error) {
      console.error("Error adding account:", error)
      set({
        error: error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      })
      throw error
    }
  },

  updateAccount: async (id, data) => {
    set({ isLoading: true, error: null })

    try {
      console.log('Updating account in API:', id, data)
      const response = await apiClient.api.v1.accounts[':id'].$put({
        param: { id },
        json: data
      })

      if (!response.ok) {
        throw new Error('Failed to update account')
      }

      const updatedAccount = await response.json() as Account
      console.log('Account updated:', updatedAccount)
      set((state) => ({
        accounts: state.accounts.map((account) =>
          account.id === id ? updatedAccount : account
        ),
        isLoading: false,
      }))

      return updatedAccount
    } catch (error) {
      console.error("Error updating account:", error)
      set({
        error: error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      })
      throw error
    }
  },

  deleteAccount: async (id) => {
    set({ isLoading: true, error: null })

    try {
      console.log('Deleting account from API:', id)
      const response = await apiClient.api.v1.accounts[':id'].$delete({
        param: { id }
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      console.log('Account deleted:', id)
      set((state) => ({
        accounts: state.accounts.filter((account) => account.id !== id),
        selectedAccountId: state.selectedAccountId === id ? null : state.selectedAccountId,
        isLoading: false,
      }))
    } catch (error) {
      console.error("Error deleting account:", error)
      set({
        error: error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      })
      throw error
    }
  },

  selectAccount: (id) => {
    set({ selectedAccountId: id })
  },
}))

