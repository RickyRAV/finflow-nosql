import { create } from 'zustand'
import { apiClient } from '@/lib/api-client'

// Types based on your API schema
type AccountType = 'checking' | 'savings' | 'credit' | 'investment' | 'cash'

interface Account {
  id: string
  name: string
  type: AccountType
  balance: number
  currency: string
  isActive: boolean
  description?: string
}

interface AccountStore {
  accounts: Account[]
  isLoading: boolean
  error: string | null
  // Actions
  fetchAccounts: () => Promise<void>
  createAccount: (account: Omit<Account, 'id'>) => Promise<void>
  updateAccount: (id: string, account: Omit<Account, 'id'>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
}

export const useAccountStore = create<AccountStore>((set) => ({
  accounts: [],
  isLoading: false,
  error: null,

  fetchAccounts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.accounts.get()
      const data = await response.json()
      set({ accounts: data, isLoading: false })
    } catch (error) {
      set({ error: 'Failed to fetch accounts', isLoading: false })
    }
  },

  createAccount: async (account) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.accounts.create(account)
      const newAccount = await response.json()
      set(state => ({
        accounts: [...state.accounts, newAccount],
        isLoading: false
      }))
    } catch (error) {
      set({ error: 'Failed to create account', isLoading: false })
    }
  },

  updateAccount: async (id, account) => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.accounts.update(id, account)
      const updatedAccount = await response.json()
      set(state => ({
        accounts: state.accounts.map(acc => 
          acc.id === id ? updatedAccount : acc
        ),
        isLoading: false
      }))
    } catch (error) {
      set({ error: 'Failed to update account', isLoading: false })
    }
  },

  deleteAccount: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await apiClient.accounts.delete(id)
      set(state => ({
        accounts: state.accounts.filter(acc => acc.id !== id),
        isLoading: false
      }))
    } catch (error) {
      set({ error: 'Failed to delete account', isLoading: false })
    }
  }
})) 