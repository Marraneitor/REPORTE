"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

interface SalesChartProps {
  period: string;
}

const emptyData = [
  { time: "No Data", burgers: 0, hotdogs: 0, desserts: 0 },
];

export function SalesChart({ period }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={emptyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="time" 
          className="text-sm" 
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          className="text-sm"
          tick={{ fill: 'hsl(var(--muted-foreground))' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px'
          }}
          formatter={(value: number) => [`$${value}`, undefined]}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="burgers"
          stroke="hsl(var(--chart-1))"
          name="Burgers"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="hotdogs"
          stroke="hsl(var(--chart-2))"
          name="Hot Dogs"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="desserts"
          stroke="hsl(var(--chart-3))"
          name="Desserts"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}