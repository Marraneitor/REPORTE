"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { getStoredData, setStoredData, STORAGE_KEYS } from "@/lib/local-storage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Search, Trash2, Package } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IngredientForm } from "@/components/ingredients/ingredient-form";
import { INGREDIENTS } from "@/lib/data/ingredients";
import { toast } from "sonner";
import type { Ingredient } from "@/lib/data/ingredients";
import PurchaseForm from "@/components/ingredients/purchase-form";

export default function IngredientsPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const storedIngredients = getStoredData<Ingredient[]>(STORAGE_KEYS.INGREDIENTS, []);
    if (storedIngredients.length > 0) {
      // Combinar ingredientes guardados con los predeterminados
      return INGREDIENTS.map(defaultIng => {
        const stored = storedIngredients.find(s => s.nombre === defaultIng.nombre);
        if (stored) {
          return stored;
        }
        return defaultIng;
      }).concat(
        // Agregar ingredientes personalizados que no están en los predeterminados
        storedIngredients.filter(
          stored => !INGREDIENTS.some(defIng => defIng.nombre === stored.nombre)
        )
      );
    }
    return INGREDIENTS;
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isIngredientDialogOpen, setIsIngredientDialogOpen] = useState(false);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [activeIngredientForPurchase, setActiveIngredientForPurchase] = useState<Ingredient | null>(null);

  const filteredIngredients = ingredients.filter(
    (ingredient) => ingredient.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIngredient = (ingredient: Ingredient) => {
    const newIngredients = [...ingredients, { ...ingredient, stock: 0 }];
    setIngredients(newIngredients);
    setStoredData(STORAGE_KEYS.INGREDIENTS, newIngredients);
    setIsIngredientDialogOpen(false);
  };

  const handleUpdateIngredient = (updatedIngredient: Ingredient) => {
    const newIngredients = ingredients.map((i) => 
      i.nombre === updatedIngredient.nombre ? updatedIngredient : i
    );
    setIngredients(newIngredients);
    setStoredData(STORAGE_KEYS.INGREDIENTS, newIngredients);
    setSelectedIngredient(null);
    setIsIngredientDialogOpen(false);
  };

  const handleDeleteIngredient = (nombre: string) => {
    const newIngredients = ingredients.filter((i) => i.nombre !== nombre);
    setIngredients(newIngredients);
    setStoredData(STORAGE_KEYS.INGREDIENTS, newIngredients);
  };

  const handlePurchaseSubmit = (data: { quantity: number; price: number; date?: string; ingredientId: number }) => {
    // Actualizar ingredientes
    const updatedIngredients = ingredients.map((i) => {
      if (i.nombre === activeIngredientForPurchase?.nombre) {
        return {
          ...i,
          stock: i.stock + data.quantity,
          precioPaquete: data.price,
          precioUnitario: data.price / i.cantidadPaquete,
        };
      }
      return i;
    });
    setIngredients(updatedIngredients);
    // Guardar ingredientes actualizados
    setStoredData(STORAGE_KEYS.INGREDIENTS, updatedIngredients);

    // Guardar la compra en el historial
    const storedPurchases = getStoredData<Array<{
      id: number;
      date: string;
      ingredient: { id: number; name: string; unit: string };
      quantity: number;
      price: number;
      total: number;
    }>>(STORAGE_KEYS.PURCHASES, []);

    const newPurchase = {
      id: Date.now(),
      date: data.date || new Date().toISOString().split('T')[0],
      ingredient: {
        id: ingredients.findIndex(i => i.nombre === activeIngredientForPurchase!.nombre),
        name: activeIngredientForPurchase!.nombre,
        unit: activeIngredientForPurchase!.unidad
      },
      quantity: data.quantity,
      price: data.price,
      total: data.price * data.quantity
    };

    setStoredData(STORAGE_KEYS.PURCHASES, [...storedPurchases, newPurchase]);
    
    setIsPurchaseDialogOpen(false);
    setActiveIngredientForPurchase(null);
    toast.success(`${data.quantity} unidades agregadas al inventario`);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Sin Stock", class: "bg-red-500" };
    if (stock <= 5) return { label: "Stock Bajo", class: "bg-yellow-500" };
    return { label: "En Stock", class: "bg-green-500" };
  };

  if (!isClient) {
    return (
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Ingredientes</h2>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestión de Ingredientes</CardTitle>
                <CardDescription>
                  Cargando...
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-center justify-center">
              Cargando ingredientes...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Ingredientes</h2>
        <Dialog open={isIngredientDialogOpen} onOpenChange={setIsIngredientDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Agregar Ingrediente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedIngredient ? "Editar Ingrediente" : "Agregar Nuevo Ingrediente"}
              </DialogTitle>
              <DialogDescription>
                {selectedIngredient
                  ? "Actualizar información del ingrediente en el sistema."
                  : "Agregar un nuevo ingrediente al inventario."}
              </DialogDescription>
            </DialogHeader>
            <IngredientForm
              ingredient={selectedIngredient}
              onSubmit={selectedIngredient ? handleUpdateIngredient : handleAddIngredient}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gestión de Ingredientes</CardTitle>
              <CardDescription>
                Administrar ingredientes y sus niveles de inventario
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar ingredientes..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Cantidad por Paquete</TableHead>
                <TableHead>Precio por Paquete</TableHead>
                <TableHead>Precio Unitario</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIngredients.length > 0 ? (
                filteredIngredients.map((ingredient) => (
                  <TableRow key={ingredient.nombre}>
                    <TableCell className="font-medium">
                      {ingredient.nombre}
                    </TableCell>
                    <TableCell>{ingredient.unidad}</TableCell>
                    <TableCell>{ingredient.cantidadPaquete.toString()}</TableCell>
                    <TableCell>${Number(ingredient.precioPaquete).toFixed(2)}</TableCell>
                    <TableCell>${Number(ingredient.precioUnitario).toFixed(2)}</TableCell>
                    <TableCell>{ingredient.stock.toString()}</TableCell>
                    <TableCell>
                      <Badge className={getStockStatus(ingredient.stock).class}>
                        {getStockStatus(ingredient.stock).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          className="hover:bg-green-100 hover:text-green-600"
                          onClick={() => {
                            setActiveIngredientForPurchase(ingredient);
                            setIsPurchaseDialogOpen(true);
                          }}
                        >
                          <Package className="h-4 w-4 mr-2" /> Comprar
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedIngredient(ingredient);
                            setIsIngredientDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleDeleteIngredient(ingredient.nombre)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    No se encontraron ingredientes.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Purchase Dialog */}
      <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Compra</DialogTitle>
            <DialogDescription>
              Actualizar el inventario y precio de compra del ingrediente.
            </DialogDescription>
          </DialogHeader>
          {activeIngredientForPurchase && (
            <PurchaseForm
              ingredient={{
                id: ingredients.findIndex(i => i.nombre === activeIngredientForPurchase.nombre),
                name: activeIngredientForPurchase.nombre,
                unit: activeIngredientForPurchase.unidad,
                quantity: activeIngredientForPurchase.stock,
                price: activeIngredientForPurchase.precioPaquete,
              }}
              onSubmit={handlePurchaseSubmit}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}