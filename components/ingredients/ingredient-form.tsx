"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Ingredient } from "@/lib/data/ingredients";

const ingredientSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  unidad: z.string({
    required_error: "Por favor selecciona una unidad.",
  }),
  cantidadPaquete: z.coerce.number().min(0, {
    message: "La cantidad debe ser un número positivo.",
  }),
  precioPaquete: z.coerce.number().min(0, {
    message: "El precio debe ser un número positivo.",
  }),
  precioUnitario: z.coerce.number().min(0, {
    message: "El precio unitario debe ser un número positivo.",
  }),
  stock: z.coerce.number().default(0),
});

type IngredientFormProps = {
  ingredient?: Ingredient | null;
  onSubmit: (data: Ingredient) => void;
};

export function IngredientForm({ ingredient, onSubmit }: IngredientFormProps) {
  const form = useForm<z.infer<typeof ingredientSchema>>({
    resolver: zodResolver(ingredientSchema),
    defaultValues: {
      nombre: "",
      unidad: "",
      cantidadPaquete: 0,
      precioPaquete: 0,
      precioUnitario: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (ingredient) {
      form.reset({
        nombre: ingredient.nombre,
        unidad: ingredient.unidad,
        cantidadPaquete: ingredient.cantidadPaquete,
        precioPaquete: ingredient.precioPaquete,
        precioUnitario: ingredient.precioUnitario,
        stock: ingredient.stock || 0,
      });
    }
  }, [ingredient, form]);

  const handleSubmit = (data: z.infer<typeof ingredientSchema>) => {
    onSubmit(data);
  };

  // Función para calcular automáticamente el precio unitario
  const calculateUnitPrice = (precioPaquete: number, cantidadPaquete: number) => {
    if (cantidadPaquete > 0) {
      const precioUnitario = precioPaquete / cantidadPaquete;
      form.setValue("precioUnitario", Number(precioUnitario.toFixed(2)));
    }
  };

  return (
    <div className="grid gap-6 py-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Ingrediente</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del ingrediente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="unidad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una unidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unidad">Unidad</SelectItem>
                      <SelectItem value="g">Gramos</SelectItem>
                      <SelectItem value="kg">Kilogramos</SelectItem>
                      <SelectItem value="mL">Mililitros</SelectItem>
                      <SelectItem value="L">Litros</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cantidadPaquete"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad por Paquete</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field} 
                      step="1" 
                      min="0" 
                      onChange={(e) => {
                        field.onChange(e);
                        calculateUnitPrice(
                          form.getValues("precioPaquete"),
                          parseFloat(e.target.value) || 0
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="precioPaquete"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio por Paquete</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      step="0.01" 
                      min="0" 
                      onChange={(e) => {
                        field.onChange(e);
                        calculateUnitPrice(
                          parseFloat(e.target.value) || 0,
                          form.getValues("cantidadPaquete")
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="precioUnitario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio Unitario</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      step="0.01" 
                      min="0" 
                      readOnly 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Actual</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field} 
                      step="1" 
                      min="0"
                      readOnly 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6 flex justify-end">
            <Button type="submit">
              {ingredient ? "Actualizar Ingrediente" : "Crear Ingrediente"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}