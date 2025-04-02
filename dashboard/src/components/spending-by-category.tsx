"use client"

import { useState, useEffect } from "react"

// Mock data for spending by category
const data = [
  { name: "Food", value: 25, color: "#10b981" },
  { name: "Housing", value: 35, color: "#3b82f6" },
  { name: "Transportation", value: 15, color: "#6366f1" },
  { name: "Entertainment", value: 10, color: "#8b5cf6" },
  { name: "Others", value: 15, color: "#ec4899" },
]

export function SpendingByCategory() {
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

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="h-[300px]">
      <div className="flex h-full flex-col justify-center">
        <div className="mb-4 flex justify-center">
          <div className="relative h-40 w-40">
            <svg viewBox="0 0 100 100" className="h-full w-full">
              {data.map((item, index) => {
                // Calculate the pie slice
                const startAngle =
                  index > 0 ? (data.slice(0, index).reduce((sum, d) => sum + d.value, 0) / total) * 360 : 0
                const endAngle = startAngle + (item.value / total) * 360

                // Convert to radians
                const startRad = ((startAngle - 90) * Math.PI) / 180
                const endRad = ((endAngle - 90) * Math.PI) / 180

                // Calculate the path
                const x1 = 50 + 40 * Math.cos(startRad)
                const y1 = 50 + 40 * Math.sin(startRad)
                const x2 = 50 + 40 * Math.cos(endRad)
                const y2 = 50 + 40 * Math.sin(endRad)

                // Determine if the arc should be drawn the long way around
                const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

                // Create the path
                const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

                return <path key={index} d={path} fill={item.color} stroke="#fff" strokeWidth="1" />
              })}
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="mr-2 h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

