"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Ingredient } from "@/lib/data/ingredients";

const productSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  categoria: z.string({
    required_error: "Por favor selecciona una categoría.",
  }),
  precioVenta: z.coerce
    .number()
    .min(0, {
      message: "El precio debe ser un número positivo.",
    }),
  descripcion: z.string(),
});

type ProductFormProps = {
  product?: any;
  ingredients: Ingredient[];
  onSubmit: (data: any) => void;
};

interface SelectedIngredient {
  id: string;
  nombre: string;
  unidad: string;
  cantidad: number;
}

export function ProductForm({ product, ingredients, onSubmit }: ProductFormProps) {
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState<string | null>(null);
  const [currentQuantity, setCurrentQuantity] = useState<string>("0");
  const [totalCost, setTotalCost] = useState<number>(0);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: "",
      categoria: "",
      precioVenta: 0,
      descripcion: "",
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        nombre: product.nombre,
        categoria: product.categoria,
        precioVenta: product.precioVenta,
        descripcion: product.descripcion,
      });
      setSelectedIngredients(product.ingredientes || []);
    }
  }, [product, form]);

  useEffect(() => {
    // Calcular costo total basado en los ingredientes seleccionados
    let cost = 0;
    for (const item of selectedIngredients) {
      const ingredient = ingredients.find((i) => i.nombre === item.nombre);
      if (ingredient) {
        cost += ingredient.precioUnitario * item.cantidad;
      }
    }
    setTotalCost(cost);
  }, [selectedIngredients, ingredients]);

  const handleAddIngredient = () => {
    if (!currentIngredient || parseFloat(currentQuantity) <= 0) return;
    const ingredient = ingredients.find((i) => i.nombre === currentIngredient);
    if (!ingredient) return;

    // Verificar si el ingrediente ya existe
    const existingIndex = selectedIngredients.findIndex(
      (i) => i.nombre === currentIngredient
    );
    if (existingIndex >= 0) {
      // Actualizar ingrediente existente
      const updated = [...selectedIngredients];
      updated[existingIndex] = {
        ...updated[existingIndex],
        cantidad: parseFloat(currentQuantity),
      };
      setSelectedIngredients(updated);
    } else {
      // Agregar nuevo ingrediente
      setSelectedIngredients([
        ...selectedIngredients,
        {
          id: ingredient.nombre,
          nombre: ingredient.nombre,
          unidad: ingredient.unidad,
          cantidad: parseFloat(currentQuantity),
        },
      ]);
    }

    // Resetear selección
    setCurrentIngredient(null);
    setCurrentQuantity("0");
  };

  const handleRemoveIngredient = (nombre: string) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i.nombre !== nombre));
  };

  const handleSubmit = (data: z.infer<typeof productSchema>) => {
    if (selectedIngredients.length === 0) {
      return alert("Por favor agrega al menos un ingrediente al producto.");
    }
    onSubmit({
      ...data,
      nombre: data.nombre,
      costoProduccion: totalCost,
      ingredientes: selectedIngredients,
    });
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
                  <FormLabel>Nombre del Producto</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del producto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Entradas">Entradas</SelectItem>
                        <SelectItem value="Hamburguesas">Hamburguesas</SelectItem>
                        <SelectItem value="Hot Dogs">Hot Dogs</SelectItem>
                        <SelectItem value="Complementos">Complementos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="precioVenta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio de Venta</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0.00"
                        {...field}
                        step="0.01"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el producto..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Ingredientes</h4>
            <div className="flex items-center gap-2 mb-4">
              <Select onValueChange={(value) => setCurrentIngredient(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecciona un ingrediente" />
                </SelectTrigger>
                <SelectContent>
                  {ingredients.map((ingredient) => (
                    <SelectItem key={ingredient.nombre} value={ingredient.nombre}>
                      {ingredient.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                value={currentQuantity}
                onChange={(e) => setCurrentQuantity(e.target.value)}
                step="0.01"
                min="0"
              />
              <Button type="button" onClick={handleAddIngredient}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {selectedIngredients.length > 0 ? (
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm font-medium mb-2">Ingredientes Seleccionados:</div>
                  <div className="space-y-2">
                    {selectedIngredients.map((item) => {
                      const ingredient = ingredients.find((i) => i.nombre === item.nombre);
                      const itemCost = ingredient ? ingredient.precioUnitario * item.cantidad : 0;
                      return (
                        <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                          <div>
                            <span className="font-medium">{item.nombre}</span>
                            <div className="text-sm text-muted-foreground">
                              {item.cantidad} {item.unidad} - ${itemCost.toFixed(2)}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveIngredient(item.nombre)}
                          >
                            ×
                          </Button>
                        </div>
                      );
                    })}
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between">
                        <span className="font-medium">Costo Total:</span>
                        <span>${totalCost.toFixed(2)}</span>
                      </div>
                      {form.getValues("precioVenta") > 0 && (
                        <div className="flex justify-between mt-1">
                          <span className="font-medium">Margen de Ganancia:</span>
                          <span>
                            {(
                              ((form.getValues("precioVenta") - totalCost) /
                                form.getValues("precioVenta")) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center p-4 bg-muted rounded-md">
                No hay ingredientes seleccionados.
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button type="submit">
              {product ? "Actualizar Producto" : "Crear Producto"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}