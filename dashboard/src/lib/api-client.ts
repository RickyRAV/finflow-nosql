const BASE_URL = 'http://localhost:8787/api/v1'

export const apiClient = {
  accounts: {
    get: () => fetch(`${BASE_URL}/accounts`),
    create: (data: any) => fetch(`${BASE_URL}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    update: (id: string, data: any) => fetch(`${BASE_URL}/accounts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
    delete: (id: string) => fetch(`${BASE_URL}/accounts/${id}`, {
      method: 'DELETE'
    })
  },
  transactions: {
    get: (params?: { page?: string; limit?: string; startDate?: string; endDate?: string; type?: 'income' | 'expense' | 'transfer'; categoryId?: string }) => {
      const searchParams = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value)
        })
      }
      return fetch(`${BASE_URL}/transactions?${searchParams.toString()}`)
    },
    create: (data: { amount: number; description: string; date: string; categoryId: string; type: 'income' | 'expense' | 'transfer'; accountId: string; tags?: string[]; notes?: string; recurringId?: string }) => 
      fetch(`${BASE_URL}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }),
    update: (id: string, data: { amount: number; description: string; date: string; categoryId: string; type: 'income' | 'expense' | 'transfer'; accountId: string; tags?: string[]; notes?: string; recurringId?: string }) => 
      fetch(`${BASE_URL}/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
  }
}