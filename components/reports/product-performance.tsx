"use client";

import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
const emptyData = [{ name: "No Data", value: 100 }];

export function ProductPerformance() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-lg font-semibold mb-4">Revenue Distribution</div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emptyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name }) => name}
                >
                  <Cell fill="hsl(var(--muted))" />
                </Pie>
                <Tooltip
                  content={() => null}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-lg font-semibold mb-4">Top Products</div>
          <div className="text-center py-8 text-muted-foreground">
            No sales data available
          </div>
        </CardContent>
      </Card>
    </div>
  );
}