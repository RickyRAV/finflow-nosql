"use client"

import { useState } from "react"
import { EditIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddCategoryModal } from "@/components/add-category-modal"

// Mock data for categories
const categories = [
  {
    id: "1",
    name: "Food",
    color: "#10b981",
    transactionCount: 15,
  },
  {
    id: "2",
    name: "Housing",
    color: "#3b82f6",
    transactionCount: 8,
  },
  {
    id: "3",
    name: "Transportation",
    color: "#6366f1",
    transactionCount: 12,
  },
  {
    id: "4",
    name: "Entertainment",
    color: "#8b5cf6",
    transactionCount: 6,
  },
  {
    id: "5",
    name: "Others",
    color: "#ec4899",
    transactionCount: 10,
  },
]

export function CategoriesList() {
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category)
    setIsEditCategoryOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Color</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="h-6 w-6 rounded-full" style={{ backgroundColor: category.color }} />
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.transactionCount}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TrashIcon className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AddCategoryModal open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen} category={selectedCategory} />
    </div>
  )
}

