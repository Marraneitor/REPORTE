"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/overview";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { Button } from "@/components/ui/button";
import { CalendarIcon, LucideShoppingBag, LucideUsers, Package, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { useEffect, useState } from "react";
import { getStoredData, STORAGE_KEYS } from "@/lib/local-storage";
import { PRODUCTS } from "@/lib/data/products";

interface Sale {
  id: number;
  date: string;
  total: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
  }>;
}

interface Customer {
  id: number;
  createdAt: string;
}

interface DashboardStats {
  totalSales: number;
  salesGrowth: number;
  activeCustomers: number;
  customerGrowth: number;
  activeProducts: number;
  productGrowth: number;
  activeOrders: number;
  orderGrowth: number;
  totalItems: number;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    salesGrowth: 0,
    activeCustomers: 0,
    customerGrowth: 0,
    activeProducts: 0,
    productGrowth: 0,
    activeOrders: 0,
    orderGrowth: 0,
    totalItems: 0
  });

  useEffect(() => {
    // Get stored data
    const sales = getStoredData<Sale[]>(STORAGE_KEYS.SALES, []);
    const customers = getStoredData<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
    
    // Calculate available products
    const availableProducts = PRODUCTS.filter(p => p.disponible).length;

    // Calculate time ranges
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);

    // Calculate current month metrics
    const currentMonthSales = sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= lastMonth && saleDate <= now;
    });

    const currentMonthTotal = currentMonthSales.reduce((sum, sale) => sum + sale.total, 0);
    const totalItemsSold = currentMonthSales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

    // Calculate previous month metrics for comparison
    const previousMonthSales = sales
      .filter(s => {
        const saleDate = new Date(s.date);
        return saleDate >= new Date(lastMonth.getFullYear(), lastMonth.getMonth() - 1, lastMonth.getDate()) &&
               saleDate < lastMonth;
      })
      .reduce((sum, sale) => sum + sale.total, 0);

    // Calculate customer metrics
    const activeCustomers = customers.length;
    const previousMonthCustomers = customers
      .filter(c => new Date(c.createdAt) < lastMonth)
      .length;

    // Calculate orders in last 24h
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const activeOrders = sales.filter(s => new Date(s.date) >= last24Hours).length;
    const previousHourOrders = sales.filter(s => {
      const saleDate = new Date(s.date);
      return saleDate >= lastHour && saleDate < new Date(now.getTime() - 60 * 60 * 1000);
    }).length;

    setStats({
      totalSales: currentMonthTotal,
      salesGrowth: previousMonthSales ? ((currentMonthTotal - previousMonthSales) / previousMonthSales) * 100 : 0,
      activeCustomers,
      customerGrowth: previousMonthCustomers ? ((activeCustomers - previousMonthCustomers) / previousMonthCustomers) * 100 : 0,
      activeProducts: availableProducts,
      productGrowth: 0,
      activeOrders,
      orderGrowth: previousHourOrders,
      totalItems: totalItemsSold
    });
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("common.dashboard")}</h2>
          <div className="flex items-center w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {t("common.today")}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t("reports.overview")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("reports.analytics")}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="w-full">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">
                    {t("sales.totalSales")}
                  </CardTitle>
                  <LucideShoppingBag className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl md:text-3xl font-bold">${stats.totalSales.toFixed(2)}</div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-2 gap-1">
                    <p className="text-sm text-muted-foreground">
                      {stats.salesGrowth >= 0 ? "+" : ""}{stats.salesGrowth.toFixed(1)}% {t("common.fromLastMonth")}
                    </p>
                    <p className="text-sm font-medium">
                      {stats.totalItems} items vendidos
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("customers.activeCustomers")}</CardTitle>
                  <LucideUsers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeCustomers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.customerGrowth >= 0 ? "+" : ""}{stats.customerGrowth.toFixed(1)}% {t("common.fromLastMonth")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("products.activeProducts")}
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeProducts}</div>
                  <p className="text-xs text-muted-foreground">
                    {t("products.availableProducts")}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {t("products.top")}
                  </CardTitle>
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {PRODUCTS.filter(p => p.disponible)[0]?.nombre || "N/A"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Producto más vendido
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
              <Card className="w-full lg:col-span-4">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{t("reports.overview")}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 md:pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="w-full lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{t("sales.recentSales")}</CardTitle>
                  <CardDescription className="text-sm">
                    {t("sales.recentSalesDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            {/* Analytics content goes here */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}