import { create } from "zustand"
import { persist } from "zustand/middleware"
import { User } from "../api-client"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  register: (email: string, name: string, password: string) => Promise<void>
  logout: () => void
  checkAuthStatus: () => void
}

// Demo users for testing
const DEMO_USERS = [
  {
    id: "user1",
    email: "user@example.com",
    name: "Demo User",
    password: "password123"
  }
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })

        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const user = DEMO_USERS.find(u => u.email === email)
          
          if (!user || user.password !== password) {
            throw new Error('Invalid email or password')
          }

          const userData: User = {
            id: user.id,
            email: user.email,
            name: user.name
          }

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          console.error("Login error:", error)
          set({
            error: error instanceof Error ? error.message : "An unknown error occurred",
            isLoading: false,
          })
          throw error
        }
      },

      register: async (email, name, password) => {
        set({ isLoading: true, error: null })

        try {
          await new Promise(resolve => setTimeout(resolve, 500))
          
          if (DEMO_USERS.some(u => u.email === email)) {
            throw new Error('User with this email already exists')
          }

          const newUser: User = {
            id: `user${Date.now()}`,
            email,
            name
          }

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          console.error("Registration error:", error)
          set({
            error: error instanceof Error ? error.message : "An unknown error occurred",
            isLoading: false,
          })
          throw error
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        })
      },

      checkAuthStatus: () => {
        const storage = localStorage.getItem('auth-storage')
        if (storage) {
          try {
            const data = JSON.parse(storage)
            if (data.state.user && data.state.isAuthenticated) {
              set({
                user: data.state.user,
                isAuthenticated: true
              })
              return
            }
          } catch (e) {
            console.error("Failed to parse auth data from storage")
          }
        }
        
        set({
          user: null,
          isAuthenticated: false
        })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)



