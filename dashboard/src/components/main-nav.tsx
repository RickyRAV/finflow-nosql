"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCardIcon, HomeIcon, TagIcon, DollarSignIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { AddTransactionButton } from "@/components/add-transaction-button"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center font-bold text-xl mr-4">
          <DollarSignIcon className="mr-2 h-6 w-6 text-green-500" />
          <span>FinFlow</span>
        </div>
        <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
          <Link
            href="/"
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/transactions"
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === "/transactions" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <CreditCardIcon className="mr-2 h-4 w-4" />
            Transactions
          </Link>
          <Link
            href="/categories"
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              pathname === "/categories" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <TagIcon className="mr-2 h-4 w-4" />
            Categories
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <AddTransactionButton />
        </div>
      </div>
    </div>
  )
}

