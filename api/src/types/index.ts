export type TransactionType = 'income' | 'expense' | 'transfer';
export type CategoryType = 'income' | 'expense' | 'both';

export interface Transaction {
  _key?: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  type: TransactionType;
  accountId: string;
  tags?: string[];
  notes?: string;
  recurringId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _key?: string;
  name: string;
  type: CategoryType;
  color?: string;
  icon?: string;
  parentCategoryId?: string;
  budget?: number;
}

export interface Account {
  _key?: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  isActive: boolean;
  description?: string;
}

export interface RecurringTransaction {
  _key?: string;
  amount: number;
  description: string;
  categoryId: string;
  type: TransactionType;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  lastProcessed?: string;
  accountId: string;
}

// For Sankey diagram data
export interface FlowData {
  nodes: Array<{
    id: string;
    name: string;
    type: 'category' | 'account';
  }>;
  links: Array<{
    source: string;
    target: string;
    value: number;
  }>;
} 