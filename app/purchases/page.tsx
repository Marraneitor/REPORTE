"use client";

import { useState, useEffect } from "react";
import { getStoredData, STORAGE_KEYS } from "@/lib/local-storage";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, FileDown, Plus, Search, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DateRangePicker } from "@/components/sales/date-range-picker";

// Purchase data type and initial empty state
type Purchase = {
  id: number;
  date: string;
  ingredient: {
    id: number;
    name: string;
    unit: string;
  };
  quantity: number;
  price: number;
  total: number;
};

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  // Cargar compras desde localStorage
  useEffect(() => {
    const storedPurchases = getStoredData<Purchase[]>(STORAGE_KEYS.PURCHASES, []);
    setPurchases(storedPurchases);
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch = purchase.ingredient.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesDateRange = 
      (!dateRange.from || new Date(purchase.date) >= dateRange.from) &&
      (!dateRange.to || new Date(purchase.date) <= dateRange.to);
    
    return matchesSearch && matchesDateRange;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTotalPurchases = () => {
    return filteredPurchases.reduce((sum, purchase) => sum + purchase.total, 0);
  };

  return (
    <div className="flex flex-col ml-0 md:ml-64">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Purchases</h2>
          <Button>
            <FileDown className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${getTotalPurchases().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                For selected period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredPurchases.length}</div>
              <p className="text-xs text-muted-foreground">
                Total purchases
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Purchase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${filteredPurchases.length ? (getTotalPurchases() / filteredPurchases.length).toFixed(2) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                Per transaction
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <CardTitle>Purchase Records</CardTitle>
                <CardDescription>
                  Track ingredient purchases and inventory additions
                </CardDescription>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search ingredients..."
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DateRangePicker
                  date={dateRange}
                  onChange={(date) => date && setDateRange(date)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Ingredient</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Price per Unit</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchases.length > 0 ? (
                  filteredPurchases.map((purchase) => (
                    <TableRow key={purchase.id}>
                      <TableCell>{formatDate(purchase.date)}</TableCell>
                      <TableCell className="font-medium">{purchase.ingredient.name}</TableCell>
                      <TableCell>{purchase.quantity}</TableCell>
                      <TableCell>{purchase.ingredient.unit}</TableCell>
                      <TableCell>${purchase.price.toFixed(2)}</TableCell>
                      <TableCell>${purchase.total.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No purchases found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}