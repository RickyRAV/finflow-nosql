"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "./main-nav"
import { CategoriesList } from "./categories-list"
import { AddCategoryModal } from "./add-category-modal"

export function CategoriesPage() {
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <Button onClick={() => setIsAddCategoryOpen(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Manage Categories</CardTitle>
            <CardDescription>Create, edit, and delete your transaction categories</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoriesList />
          </CardContent>
        </Card>
      </div>
      <AddCategoryModal open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen} />
    </div>
  )
}

