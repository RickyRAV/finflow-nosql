"use client"

import { useEffect, useState } from "react"
import { Sankey, Tooltip } from "recharts"

interface SankeyNode {
  name: string;
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

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#77c878"
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
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [data] = useState<SankeyData>({
    nodes: [
      { name: "Visit" },
      { name: "Direct-Favourite" },
      { name: "Page-Click" },
      { name: "Detail-Favourite" },
      { name: "Lost" }
    ],
    links: [
      { source: 0, target: 1, value: 3728.3 },
      { source: 0, target: 2, value: 354170 },
      { source: 2, target: 3, value: 62429 },
      { source: 2, target: 4, value: 291741 }
    ]
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (hasError) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <p className="text-muted-foreground">Unable to load flow diagram</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[500px] items-center justify-center">
        <p className="text-muted-foreground">Loading flow diagram...</p>
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full">
      <Sankey
        width={960}
        height={500}
        data={data}
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
        <Tooltip />
      </Sankey>
    </div>
  );
}

