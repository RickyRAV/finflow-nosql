import { hc } from 'hono/client'
import type { AppType } from '../../../api/src'


// Create the API client
export const apiClient = hc<AppType>('http://localhost:8787/')

// Common type definitions
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface Transaction {
  id?: string
  _id?: string
  _key?: string
  _rev?: string
  date: string
  description: string
  categoryId: string
  amount: number
  type: "income" | "expense" | "transfer"
  accountId: string
  tags?: string[]
  notes?: string
  recurringId?: string
  category?: Category | null
}

export interface Account {
  id?: string
  _id?: string
  _key?: string
  _rev?: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash'
  balance: number
  currency: string
  isActive: boolean
  description?: string
}

export interface Category {
  id?: string
  _id?: string
  _key?: string
  _rev?: string
  name: string
  type: "income" | "expense" | "transfer"
  color: string
  icon?: string
  parentId?: string
  isDefault?: boolean
} 