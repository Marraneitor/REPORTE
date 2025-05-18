"use client";

import { useState, useEffect, useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getStoredData, STORAGE_KEYS } from "@/lib/local-storage";
import { INGREDIENTS } from "@/lib/data/ingredients";
import { Package2, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IngredientUsageData {
  name: string;
  usage: number;
  stock: number;
  cost: number;
}

interface IngredientUsage {
  id: number;
  date: string;
  ingredientName: string;
  unit: string;
  quantity: number;
  saleId: number;
  productName: string;
}

function getStockStatus(stock: number) {
  if (stock === 0) return { label: "Sin Stock", class: "bg-destructive text-destructive-foreground", icon: AlertCircle };
  if (stock <= 5) return { label: "Stock Bajo", class: "bg-warning text-warning-foreground", icon: TrendingDown };
  return { label: "En Stock", class: "bg-success text-success-foreground", icon: TrendingUp };
}

export function IngredientUsage() {
  const [usageData, setUsageData] = useState<IngredientUsageData[]>([]);
  const [totalUsage, setTotalUsage] = useState(0);
  const [mostUsed, setMostUsed] = useState<{name: string; quantity: number; unit: string}>({ name: '', quantity: 0, unit: '' });
  const [leastUsed, setLeastUsed] = useState<{name: string; quantity: number; unit: string}>({ name: '', quantity: 0, unit: '' });
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    // Get stored usage and ingredients data
    const storedUsage = getStoredData<IngredientUsage[]>(STORAGE_KEYS.INGREDIENT_USAGE, []);
    const storedIngredients = getStoredData<typeof INGREDIENTS>(STORAGE_KEYS.INGREDIENTS, INGREDIENTS);

    // Calculate total usage per ingredient
    const usageByIngredient = new Map<string, { quantity: number; unit: string }>();
    
    storedUsage.forEach(item => {
      const current = usageByIngredient.get(item.ingredientName) || { quantity: 0, unit: item.unit };
      usageByIngredient.set(item.ingredientName, {
        quantity: current.quantity + item.quantity,
        unit: item.unit
      });
    });

    // Calcular métricas globales
    const totalUsg = Array.from(usageByIngredient.values()).reduce((sum, { quantity }) => sum + quantity, 0);
    setTotalUsage(Math.round(totalUsg));

    // Encontrar ingrediente más y menos usado
    const usageEntries = Array.from(usageByIngredient.entries())
      .sort((a, b) => b[1].quantity - a[1].quantity);

    if (usageEntries.length > 0) {
      const [mostUsedName, mostUsedData] = usageEntries[0];
      const [leastUsedName, leastUsedData] = usageEntries[usageEntries.length - 1];
      
      setMostUsed({ 
        name: mostUsedName, 
        quantity: Math.round(mostUsedData.quantity), 
        unit: mostUsedData.unit 
      });
      setLeastUsed({ 
        name: leastUsedName, 
        quantity: Math.round(leastUsedData.quantity), 
        unit: leastUsedData.unit 
      });
    }

    // Contar ingredientes con stock bajo
    const lowStock = storedIngredients.filter(i => i.stock <= 5).length;
    setLowStockCount(lowStock);

    // Create chart data
    const data: IngredientUsageData[] = storedIngredients.map(ingredient => {
      const usage = usageByIngredient.get(ingredient.nombre)?.quantity || 0;
      let stock = ingredient.stock;
      
      // Para papas gajo, convertir el stock a porciones
      if (ingredient.nombre === "PAPAS GAJO") {
        stock = stock / 140;
      }
      
      return {
        name: ingredient.nombre,
        usage: usage,
        stock: stock,
        cost: usage * (ingredient.nombre === "PAPAS GAJO" ? ingredient.precioUnitario * 140 : ingredient.precioUnitario)
      };
    });

    setUsageData(data);
  }, []);

  // Sort data by usage
  const sortedData = useMemo(() => {
    return [...usageData].sort((a, b) => b.usage - a.usage);
  }, [usageData]);

  // Format data for chart
  const chartData = useMemo(() => {
    return sortedData.slice(0, 10).map(item => ({
      name: item.name,
      usage: item.usage,
      stock: item.stock
    }));
  }, [sortedData]);

  return (
    <div className="grid gap-6">
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              fontSize={12}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "hsl(var(--shadow)) 0px 4px 12px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="usage"
              name="Uso"
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="stock"
              name="Stock"
              stroke="hsl(var(--secondary))"
              strokeWidth={2.5}
              dot={{ fill: "hsl(var(--secondary))", r: 4 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] w-full rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ingrediente</TableHead>
                  <TableHead className="text-right">Uso Total</TableHead>
                  <TableHead className="text-right">Stock Actual</TableHead>
                  <TableHead className="text-right">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((item) => {
                  const status = getStockStatus(item.stock);
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={item.name} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.usage.toFixed(0)}</TableCell>
                      <TableCell className="text-right">{item.stock.toFixed(0)}</TableCell>
                      <TableCell className="text-right">
                        <Badge className={status.class + " inline-flex items-center gap-1"}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}