"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const purchaseSchema = z.object({
  quantity: z.coerce.number()
    .min(1, { message: "La cantidad debe ser mayor que 0" })
    .refine((value) => {
      return Number.isInteger(value);
    }, { message: "La cantidad debe ser un número entero" }),
  price: z.coerce.number()
    .min(0, { message: "El precio debe ser un número positivo." }),
  date: z.string().optional(),
});

interface PurchaseFormProps {
  ingredient: {
    id: number;
    name: string;
    unit: string;
    quantity: number;
    price: number;
  };
  onSubmit: (data: z.infer<typeof purchaseSchema> & { ingredientId: number }) => void;
};

export default function PurchaseForm({ ingredient, onSubmit }: PurchaseFormProps) {
  const form = useForm<z.infer<typeof purchaseSchema>>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      quantity: 1,
      price: ingredient.price,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const handleSubmit = (data: z.infer<typeof purchaseSchema>) => {
    onSubmit({
      ...data,
      ingredientId: ingredient.id,
    });
    form.reset();
  };

  return (
    <div>
      <div className="mb-4 p-4 bg-muted rounded-md">
        <h3 className="font-medium text-lg">{ingredient.name}</h3>
        <p className="text-sm text-muted-foreground">
          Inventario actual: {ingredient.quantity} {ingredient.unit}
        </p>
        <p className="text-sm text-muted-foreground">
          Último precio de compra: ${ingredient.price.toFixed(2)} por {ingredient.unit}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input type="number" step="1" min="1" {...field} />
                </FormControl>
                <FormDescription>Cantidad en {ingredient.unit}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio por Unidad</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>Costo actual por {ingredient.unit}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Compra</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-4">
            <Button type="submit">Registrar Compra</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}