"use client";

import { useTranslation } from "@/lib/i18n/i18n-context";
import { useEffect, useState } from "react";
import { getStoredData, STORAGE_KEYS } from "@/lib/local-storage";
import { Avatar } from "@/components/ui/avatar";

interface SaleItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Sale {
  id: number;
  date: string;
  items: SaleItem[];
  total: number;
  customer?: {
    id: number;
    name: string;
  };
}

export function RecentSales() {
  const { t } = useTranslation();
  const [recentSales, setRecentSales] = useState<Sale[]>([]);

  useEffect(() => {
    const sales = getStoredData<Sale[]>(STORAGE_KEYS.SALES, []);
    const sortedSales = [...sales]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    setRecentSales(sortedSales);
  }, []);

  if (recentSales.length === 0) {
    return (
      <div className="space-y-8 p-6 text-center text-muted-foreground">
        <p>{t("sales.noRecentSales") || "No recent sales to display"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {recentSales.map((sale) => (
        <div key={sale.id} className="flex items-center p-2 hover:bg-muted/50 rounded-lg transition-colors">
          <Avatar className="h-10 w-10">
            <div className="flex h-full w-full items-center justify-center bg-primary text-primary-foreground text-base font-medium">
              {sale.customer ? sale.customer.name.charAt(0).toUpperCase() : "G"}
            </div>
          </Avatar>
          <div className="ml-4 flex-1 min-w-0">
            <p className="text-base font-medium leading-none truncate mb-1">
              {sale.customer ? sale.customer.name : "Guest"}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p>{new Date(sale.date).toLocaleDateString()}</p>
              <p className="font-medium text-primary">
                +${sale.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}