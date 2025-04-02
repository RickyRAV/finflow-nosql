"use client"

import { useState, useEffect } from "react"

// Mock data for monthly income vs expenses
const data = [
  {
    name: "Nov",
    income: 3200,
    expenses: 2400,
  },
  {
    name: "Dec",
    income: 3100,
    expenses: 2500,
  },
  {
    name: "Jan",
    income: 3400,
    expenses: 2300,
  },
  {
    name: "Feb",
    income: 3000,
    expenses: 2100,
  },
  {
    name: "Mar",
    income: 3200,
    expenses: 2400,
  },
  {
    name: "Apr",
    income: 3450,
    expenses: 2180,
  },
]

export function MonthlyChart() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">Loading chart...</p>
      </div>
    )
  }

  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map((item) => Math.max(item.income, item.expenses)))

  return (
    <div className="h-[300px]">
      <div className="flex h-full flex-col">
        <div className="flex-1">
          <div className="flex h-full items-end justify-between">
            {data.map((item, index) => (
              <div key={index} className="flex w-1/6 flex-col items-center">
                <div className="relative w-full px-1">
                  <div
                    className="w-full rounded-t-sm bg-green-500"
                    style={{
                      height: `${(item.income / maxValue) * 200}px`,
                    }}
                  />
                  <div
                    className="mt-1 w-full rounded-t-sm bg-red-500"
                    style={{
                      height: `${(item.expenses / maxValue) * 200}px`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 grid grid-cols-6 text-center">
          {data.map((item, index) => (
            <div key={index} className="text-xs font-medium">
              {item.name}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center space-x-4">
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 bg-green-500" />
            <span className="text-xs">Income</span>
          </div>
          <div className="flex items-center">
            <div className="mr-2 h-3 w-3 bg-red-500" />
            <span className="text-xs">Expenses</span>
          </div>
        </div>
      </div>
    </div>
  )
}

