"use client";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const data = [
  { name: "Sat", sales: 4000 },
  { name: "Sun", sales: 3000 },
  { name: "Mon", sales: 2000 },
  { name: "Tue", sales: 2780 },
  { name: "Wed", sales: 1890 },
  { name: "Thu", sales: 2390 },
  { name: "Fri", sales: 3490 },
];

export function SalesChart() {
  return (
    <div className="h-87.5 w-full pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="oklch(var(--primary))"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="oklch(var(--primary))"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="oklch(var(--border) / 0.4)"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "oklch(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => `৳${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(var(--popover))",
              border: "1px solid oklch(var(--border))",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="oklch(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
