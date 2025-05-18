"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getStoredData, setStoredData, STORAGE_KEYS } from "@/lib/local-storage";
import { PRODUCTS, Product } from "@/lib/data/products";
import type { Ingredient } from "@/lib/data/ingredients";
import { toast } from "sonner";

interface IngredientUsage {
  id: number;
  date: string;
  ingredientName: string;
  unit: string;
  quantity: number;
  saleId: number;
  productName: string;
}

export interface SaleItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Sale {
  id: number;
  date: string;
  customer: {
    id: number;
    name: string;
  };
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "cash" | "card";
  cashReceived?: number;
  change?: number;
}

interface SalesContextType {
  sales: Sale[];
  addSale: (sale: Sale) => void;
  updateSales: (updatedSales: Sale[]) => void;
  removeSale: (saleId: number) => void;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

function validateStock(items: SaleItem[]): boolean {
  const storedIngredients = getStoredData<Ingredient[]>(STORAGE_KEYS.INGREDIENTS, []);
  const requiredStock: Record<string, number> = {};

  // Calcular el stock necesario para todos los productos
  for (const item of items) {
    const product = PRODUCTS.find(p => p.nombre === item.name);
    if (!product) continue;

    for (const ingredient of product.ingredientes) {
      const required = ingredient.cantidad * item.quantity;
      requiredStock[ingredient.nombre] = (requiredStock[ingredient.nombre] || 0) + required;
    }
  }

  // Verificar si hay suficiente stock
  for (const [ingredientName, required] of Object.entries(requiredStock)) {
    const ingredient = storedIngredients.find(i => i.nombre === ingredientName);
    if (!ingredient || ingredient.stock < required) {
      toast.error(`Stock insuficiente de ${ingredientName}`);
      return false;
    }
  }

  return true;
}

function calculateIngredientUsage(items: SaleItem[], saleId: number, saleDate: string): IngredientUsage[] {
  // Usar un objeto para acumular el uso de ingredientes
  const usageMap: Record<string, IngredientUsage> = {};

  for (const item of items) {
    const product = PRODUCTS.find(p => p.nombre === item.name);
    if (!product) continue;

    for (const ingredient of product.ingredientes) {
      const quantity = ingredient.cantidad * item.quantity;
      const key = `${ingredient.nombre}-${ingredient.unidad}`;

      if (usageMap[key]) {
        // Si ya existe el ingrediente, sumar la cantidad
        usageMap[key].quantity += quantity;
      } else {
        // Si es nuevo, crear el registro
        usageMap[key] = {
          id: Date.now() + Math.random(),
          date: saleDate,
          ingredientName: ingredient.nombre,
          unit: ingredient.unidad,
          quantity: quantity,
          saleId: saleId,
          productName: item.name
        };
      }
    }
  }

  // Convertir el mapa de uso a un array
  return Object.values(usageMap);
}

function updateIngredientStock(usageItems: IngredientUsage[]) {
  const storedIngredients = getStoredData<Ingredient[]>(STORAGE_KEYS.INGREDIENTS, []);
  if (!storedIngredients.length) return;

  // Agrupar el uso por ingrediente
  const usageByIngredient = usageItems.reduce<Record<string, number>>((acc, item) => {
    acc[item.ingredientName] = (acc[item.ingredientName] || 0) + item.quantity;
    return acc;
  }, {});
  
  const updatedIngredients = storedIngredients.map(ingredient => {
    const usage = usageByIngredient[ingredient.nombre] || 0;
    const newStock = Math.max(0, ingredient.stock - usage);
    
    return {
      ...ingredient,
      stock: newStock
    };
  });

  setStoredData(STORAGE_KEYS.INGREDIENTS, updatedIngredients);
}

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>(() => {
    if (typeof window !== 'undefined') {
      return getStoredData<Sale[]>(STORAGE_KEYS.SALES, []);
    }
    return [];
  });
  // Guardar o limpiar ventas cuando cambien
  useEffect(() => {
    if (sales.length === 0) {
      // Si no hay ventas, limpiar el storage
      setStoredData(STORAGE_KEYS.SALES, []);
      // También limpiar el uso de ingredientes
      setStoredData(STORAGE_KEYS.INGREDIENT_USAGE, []);
    } else {
      setStoredData(STORAGE_KEYS.SALES, sales);
    }
  }, [sales]);

  const addSale = (sale: Sale) => {
    try {
      // Validar stock antes de proceder
      if (!validateStock(sale.items)) {
        throw new Error("Stock insuficiente para completar la venta");
      }

      // Calcular uso de ingredientes
      const usage = calculateIngredientUsage(sale.items, sale.id, sale.date);

      // Actualizar stock de ingredientes
      updateIngredientStock(usage);

      // Guardar uso de ingredientes
      const storedUsage = getStoredData<IngredientUsage[]>(STORAGE_KEYS.INGREDIENT_USAGE, []);
      setStoredData(STORAGE_KEYS.INGREDIENT_USAGE, [...storedUsage, ...usage]);

      // Agregar la venta
      setSales(prev => {
        const newSales = [sale, ...prev];
        setStoredData(STORAGE_KEYS.SALES, newSales);
        return newSales;
      });

      toast.success("Venta completada con éxito");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al procesar la venta");
      throw error;
    }
  };

  const updateSales = (updatedSales: Sale[]) => {
    setSales(updatedSales);
    setStoredData(STORAGE_KEYS.SALES, updatedSales);
  };
  const removeSale = (saleId: number) => {
    // Eliminar el uso de ingredientes asociado a esta venta
    const storedUsage = getStoredData<IngredientUsage[]>(STORAGE_KEYS.INGREDIENT_USAGE, []);
    const updatedUsage = storedUsage.filter(usage => usage.saleId !== saleId);
    setStoredData(STORAGE_KEYS.INGREDIENT_USAGE, updatedUsage);

    // Recalcular el stock de ingredientes
    const storedIngredients = getStoredData<Ingredient[]>(STORAGE_KEYS.INGREDIENTS, []);
    if (storedIngredients.length > 0) {
      // Agrupar todo el uso de ingredientes actualizado
      const totalUsageByIngredient = updatedUsage.reduce<Record<string, number>>((acc, item) => {
        acc[item.ingredientName] = (acc[item.ingredientName] || 0) + item.quantity;
        return acc;
      }, {});

      // Actualizar el stock basado en las compras y el uso actualizado
      const purchases = getStoredData<Array<{
        ingredient: { name: string };
        quantity: number;
      }>>(STORAGE_KEYS.PURCHASES, []);

      const purchasesByIngredient = purchases.reduce<Record<string, number>>((acc, purchase) => {
        acc[purchase.ingredient.name] = (acc[purchase.ingredient.name] || 0) + purchase.quantity;
        return acc;
      }, {});

      // Actualizar el stock de cada ingrediente
      const updatedIngredients = storedIngredients.map(ingredient => {
        const totalPurchased = purchasesByIngredient[ingredient.nombre] || 0;
        const totalUsed = totalUsageByIngredient[ingredient.nombre] || 0;
        return {
          ...ingredient,
          stock: Math.max(0, totalPurchased - totalUsed)
        };
      });

      setStoredData(STORAGE_KEYS.INGREDIENTS, updatedIngredients);
    }

    // Eliminar la venta
    setSales(prev => {
      const newSales = prev.filter(sale => sale.id !== saleId);
      setStoredData(STORAGE_KEYS.SALES, newSales);
      return newSales;
    });
  };

  const value = {
    sales,
    addSale,
    updateSales,
    removeSale
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error("useSales must be used within a SalesProvider");
  }
  return context;
}
