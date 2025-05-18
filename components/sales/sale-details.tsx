"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, Trash2 } from "lucide-react";
import { useSales } from "@/lib/context/sales-context";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { toast } from "sonner";

interface SaleDetailsProps {
  sale: {
    id: number;
    date: string;
    customer: {
      id: number;
      name: string;
    };
    items: Array<{
      id: number;
      name: string;
      price: number;
      quantity: number;
    }>;
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod: string;
  };
}

export function SaleDetails({ sale }: SaleDetailsProps) {
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

  const { removeSale } = useSales();
  const { t } = useTranslation();

  const handleDelete = () => {
    if (window.confirm(t("sales.confirmDelete") || "¿Estás seguro de que deseas eliminar esta venta?")) {
      removeSale(sale.id);
      // Cerrar el diálogo después de eliminar
      (document.querySelector("[data-dialog-close]") as HTMLButtonElement)?.click();
      toast.success(t("sales.deleted") || "Venta eliminada correctamente");
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">Customer Information</h3>
                <p>{sale.customer.name}</p>
                <p className="text-sm text-muted-foreground">Customer ID: {sale.customer.id}</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {t("sales.deleteSale") || "Delete Sale"}
              </Button>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Order Items</h3>
            <div className="space-y-2">
              {sale.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <span>{item.name}</span>
                    <span className="text-muted-foreground ml-2">
                      x{item.quantity}
                    </span>
                  </div>
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${sale.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Discount:</span>
              <span>-${sale.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mt-2 text-lg font-bold">
              <span>Total:</span>
              <span>${sale.total.toFixed(2)}</span>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="flex justify-between text-sm">
            <div>
              <p><span className="font-medium">Date:</span> {formatDate(sale.date)}</p>
              <p className="capitalize"><span className="font-medium">Payment Method:</span> {sale.paymentMethod}</p>
            </div>
            <div>
              <p><span className="font-medium">Order ID:</span> {sale.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline" size="sm">
          <FileDown className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}