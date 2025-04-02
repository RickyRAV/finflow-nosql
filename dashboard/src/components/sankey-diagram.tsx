"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useTransactionStore } from "@/lib/store/transaction-store"

// Dynamically import Recharts components with no SSR
const RechartsComponents = dynamic(() => import("./recharts-sankey"), { ssr: false })

interface SankeyNode {
  name: string;
  type?: string;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

interface SankeyData {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

const MyCustomNode = (props: any) => {
  const { x, y, width, height, payload } = props;
  
  // Different colors based on node type (income, expense, category)
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

export function SankeyDiagram() {
  const { transactions, fetchTransactions, isLoading, error } = useTransactionStore();
  const [sankeyData, setSankeyData] = useState<SankeyData>({ nodes: [], links: [] });

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    if (transactions.length > 0) {
      generateSankeyData(transactions);
    }
  }, [transactions]);

  const generateSankeyData = (transactions) => {
    const nodes: SankeyNode[] = [];
    const links: SankeyLink[] = [];
    
    const nodeIndices = new Map<string, number>();
    
    nodes.push({ name: "Income", type: "income" });
    nodeIndices.set("Income", 0);
    
    const categories = new Set<string>();
    transactions.forEach(tx => {
      if (tx.categoryId) {
        categories.add(tx.categoryId);
      }
    });
    
    Array.from(categories).forEach((category, index) => {
      nodes.push({ name: category, type: "category" });
      nodeIndices.set(category, nodes.length - 1);
    });
    
    nodes.push({ name: "Expenses", type: "expense" });
    nodeIndices.set("Expenses", nodes.length - 1);
    
    const categoryTotals = new Map<string, number>();
    const categoryExpenseTotals = new Map<string, number>();
    
    transactions.forEach(tx => {
      if (!tx.categoryId) return;
      
      if (tx.type === "income") {
        const currentTotal = categoryTotals.get(tx.categoryId) || 0;
        categoryTotals.set(tx.categoryId, currentTotal + tx.amount);
      } else if (tx.type === "expense") {
        const currentTotal = categoryExpenseTotals.get(tx.categoryId) || 0;
        categoryExpenseTotals.set(tx.categoryId, currentTotal + tx.amount);
      }
    });
    
    categoryTotals.forEach((value, category) => {
      if (value > 0) {
        links.push({
          source: nodeIndices.get("Income") || 0,
          target: nodeIndices.get(category) || 0,
          value: value
        });
      }
    });
    
    categoryExpenseTotals.forEach((value, category) => {
      if (value > 0) {
        links.push({
          source: nodeIndices.get(category) || 0,
          target: nodeIndices.get("Expenses") || 0,
          value: value
        });
      }
    });
    
    setSankeyData({ nodes, links });
  };

  if (error) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <p className="text-muted-foreground">Error loading flow diagram: {error}</p>
      </div>
    );
  }

  if (isLoading || transactions.length === 0) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <p className="text-muted-foreground">Loading flow diagram...</p>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full overflow-x-auto">
      <RechartsComponents sankeyData={sankeyData} />
    </div>
  );
}

