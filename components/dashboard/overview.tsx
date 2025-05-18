"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from "recharts";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSales, type Sale, type SaleItem } from "@/lib/context/sales-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRODUCTS } from "@/lib/data/products";

interface ProductSales {
  name: string;
  quantity: number;
  total: number;
  category?: string;
}

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--destructive))',
  'hsl(var(--success))',
  'hsl(var(--warning))',
  'hsl(var(--info))',
];

export function Overview() {
  const { t } = useTranslation();
  const { sales } = useSales();
  const [productStats, setProductStats] = useState<ProductSales[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [salesByCategory, setSalesByCategory] = useState<{ name: string; value: number }[]>([]);
  const [dailySales, setDailySales] = useState<{ date: string; total: number }[]>([]);

  useEffect(() => {
    // Resetear estados si no hay ventas
    if (!sales.length) {
      setProductStats([]);
      setTotalOrders(0);
      setTotalRevenue(0);
      setTotalItems(0);
      setSalesByCategory([]);
      setDailySales([]);
      return;
    }

    // Calcular estadísticas por producto
    const productSummary = sales.reduce<Record<string, ProductSales>>((acc, sale) => {
      sale.items.forEach(item => {
        if (!acc[item.name]) {
          const product = PRODUCTS.find(p => p.nombre === item.name);
          acc[item.name] = {
            name: item.name,
            quantity: 0,
            total: 0,
            category: product?.categoria || 'Otros'
          };
        }
        acc[item.name].quantity += item.quantity;
        acc[item.name].total += item.total || (item.price * item.quantity);
      });
      return acc;
    }, {});

    // Agrupar por categoría
    const categorySummary = Object.values(productSummary).reduce<Record<string, number>>((acc, product) => {
      const category = product.category || 'Otros';
      acc[category] = (acc[category] || 0) + product.total;
      return acc;
    }, {});

    // Calcular ventas diarias
    const dailySummary = sales.reduce<Record<string, number>>((acc, sale) => {
      const date = new Date(sale.date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + sale.total;
      return acc;
    }, {});

    // Convertir datos para los gráficos
    const sortedProducts = Object.values(productSummary)
      .sort((a, b) => b.quantity - a.quantity);

    const categoryData = Object.entries(categorySummary)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const dailyData = Object.entries(dailySummary)
      .map(([date, total]) => ({ date, total }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Actualizar estados
    setProductStats(sortedProducts);
    setSalesByCategory(categoryData);
    setDailySales(dailyData);
    setTotalOrders(sales.length);
    setTotalRevenue(sales.reduce((sum, sale) => sum + sale.total, 0));
    setTotalItems(sales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    ));
  }, [sales]);

  if (!sales.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-lg text-muted-foreground mb-2">
          Aún no hay ventas registradas
        </p>
        <p className="text-sm text-muted-foreground">
          Las estadísticas se mostrarán aquí cuando realices tu primera venta
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Resumen de métricas */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-br from-primary/20 to-background">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-sm text-muted-foreground">Órdenes Totales</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-success/20 to-background">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">Ventas Totales</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-secondary/20 to-background">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-sm text-muted-foreground">Productos Vendidos</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="trend">Tendencia</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Productos Más Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={productStats.slice(0, 10)} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <XAxis 
                      type="number"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      width={150}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [`${value} unidades`, 'Vendidos']}
                    />
                    <Bar 
                      dataKey="quantity"
                      radius={[0, 4, 4, 0]}
                    >
                      {productStats.slice(0, 10).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Categoría</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {salesByCategory.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ventas']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ventas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailySales}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ventas']}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorTotal)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Lista detallada */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Ventas por Producto</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {productStats.map((product) => (
                <div key={product.name} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.quantity} unidades • {product.category}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      ${(product.total / product.quantity).toFixed(2)} por unidad
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}