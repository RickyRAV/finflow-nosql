"use client"

import React from "react"
import { Sankey, Tooltip } from "recharts"

const MyCustomNode = (props: any) => {
  const { x, y, width, height, payload } = props;
  
  // Different colors based on node type
  let fill = "#77c878"; // Default green
  
  if (payload.type === "income") {
    fill = "#4ade80"; // Green for income
  } else if (payload.type === "expense") {
    fill = "#f87171"; // Red for expense
  } else if (payload.type === "category") {
    fill = "#60a5fa"; // Blue for categories
  }

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
        fillOpacity="0.8"
      />
      <text
        x={x + width + 6}
        y={y + height / 2}
        textAnchor="start"
        dominantBaseline="middle"
        className="text-sm font-medium"
      >
        {payload.name}
      </text>
    </g>
  );
};

export default function RechartsComponents({ sankeyData }) {
  return (
    <Sankey
      width={960}
      height={500}
      data={sankeyData}
      node={<MyCustomNode />}
      nodePadding={50}
      margin={{
        left: 200,
        right: 200,
        top: 100,
        bottom: 100,
      }}
      link={{ stroke: '#77c878' }}
    >
      <Tooltip 
        formatter={(value) => `$${value.toFixed(2)}`}
        labelFormatter={(name) => name}
      />
    </Sankey>
  );
} 