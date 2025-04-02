import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Category } from "../api-client"

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  error: string | null

  fetchCategories: () => Promise<void>
  addCategory: (category: Omit<Category, "id">) => Promise<Category>
  updateCategory: (id: string, data: Omit<Category, "id">) => Promise<Category>
  deleteCategory: (id: string) => Promise<void>
  getCategoriesByType: (type: "income" | "expense" | "transfer" | "all") => Category[]
}

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "salary",
    name: "Salary",
    type: "income",
    color: "#4CAF50",
    isDefault: true,
  },
  {
    id: "freelance",
    name: "Freelance",
    type: "income",
    color: "#8BC34A",
    isDefault: true,
  },
  {
    id: "investments",
    name: "Investments",
    type: "income",
    color: "#009688",
    isDefault: true,
  },
  {
    id: "food",
    name: "Food",
    type: "expense",
    color: "#F44336",
    isDefault: true,
  },
  {
    id: "groceries",
    name: "Groceries",
    type: "expense",
    color: "#FF5722",
    isDefault: true,
  },
  {
    id: "housing",
    name: "Housing",
    type: "expense",
    color: "#795548",
    isDefault: true,
  },
  {
    id: "transportation",
    name: "Transportation",
    type: "expense",
    color: "#607D8B",
    isDefault: true,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    type: "expense",
    color: "#9C27B0",
    isDefault: true,
  },
  {
    id: "transfer",
    name: "Transfer",
    type: "transfer",
    color: "#2196F3",
    isDefault: true,
  },
];

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      categories: DEFAULT_CATEGORIES,
      isLoading: false,
      error: null,

      fetchCategories: async () => {
        set({ isLoading: true, error: null })

        try {
          await new Promise(resolve => setTimeout(resolve, 300))
          
          const { categories } = get()
          if (categories.length === 0) {
            set({ categories: DEFAULT_CATEGORIES })
          }
          
          set({ isLoading: false })
        } catch (error) {
          console.error("Error fetching categories:", error)
          set({
            error: error instanceof Error ? error.message : "An unknown error occurred",
            isLoading: false,
          })
        }
      },

      addCategory: async (categoryData) => {
        set({ isLoading: true, error: null })

        try {
          await new Promise(resolve => setTimeout(resolve, 300))

          const newCategory: Category = {
            ...categoryData,
            id: `cat_${Date.now()}`,
          }

          set(state => ({
            categories: [...state.categories, newCategory],
            isLoading: false,
          }))

          return newCategory
        } catch (error) {
          console.error("Error adding category:", error)
          set({
            error: error instanceof Error ? error.message : "An unknown error occurred",
            isLoading: false,
          })
          throw error
        }
      },

      updateCategory: async (id, data) => {
        set({ isLoading: true, error: null })

        try {
          await new Promise(resolve => setTimeout(resolve, 300))

          const category = get().categories.find(c => c.id === id)
          if (!category) {
            throw new Error("Category not found")
          }

          const updatedCategory: Category = {
            ...category,
            ...data,
            id,
          }

          set(state => ({
            categories: state.categories.map(
              category => (category.id === id ? updatedCategory : category)
            ),
            isLoading: false,
          }))

          return updatedCategory
        } catch (error) {
          console.error("Error updating category:", error)
          set({
            error: error instanceof Error ? error.message : "An unknown error occurred",
            isLoading: false,
          })
          throw error
        }
      },

      deleteCategory: async (id) => {
        set({ isLoading: true, error: null })

        try {
          await new Promise(resolve => setTimeout(resolve, 300))

          const category = get().categories.find(c => c.id === id)
          if (category?.isDefault) {
            throw new Error("Cannot delete default categories")
          }

          set(state => ({
            categories: state.categories.filter(category => category.id !== id),
            isLoading: false,
          }))
        } catch (error) {
          console.error("Error deleting category:", error)
          set({
            error: error instanceof Error ? error.message : "An unknown error occurred",
            isLoading: false,
          })
          throw error
        }
      },

      getCategoriesByType: (type) => {
        const { categories } = get()
        return type === "all"
          ? categories
          : categories.filter(category => category.type === type)
      },
    }),
    {
      name: "categories-storage",
    }
  )
)

