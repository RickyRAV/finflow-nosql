"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddTransactionModal } from "./add-transaction-modal"

export function AddTransactionButton() {
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsAddTransactionOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Add Transaction
      </Button>
      <AddTransactionModal open={isAddTransactionOpen} onOpenChange={setIsAddTransactionOpen} />
    </>
  )
}

