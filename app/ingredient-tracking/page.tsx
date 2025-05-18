"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/sales/date-range-picker";
import { DateRange } from "react-day-picker";
import { IngredientUsage } from "@/components/reports/ingredient-usage";
import { ChartBar, Package2, ArchiveX, AlertCircle } from "lucide-react";

export default function IngredientTrackingPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Package2 className="h-8 w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Seguimiento de Ingredientes
          </h1>
        </div>
        <DateRangePicker date={dateRange} onChange={setDateRange} />
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle className="text-xl">Uso de Ingredientes</CardTitle>
          <CardDescription>
            Monitoreo detallado del consumo de ingredientes basado en las ventas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <IngredientUsage />
        </CardContent>
      </Card>
    </div>
  );
}
