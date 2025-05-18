"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProductForm } from "@/components/products/product-form";
import { toast } from "sonner";
import { getStoredData, setStoredData, STORAGE_KEYS } from "@/lib/local-storage";
import { PRODUCTS } from "@/lib/data/products";
import { INGREDIENTS } from "@/lib/data/ingredients";
import type { Product } from "@/lib/data/products";

export default function ProductsPage() {
  const [products, setProducts] = useState(PRODUCTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Cargar productos guardados al iniciar
  useEffect(() => {
    const storedProducts = getStoredData(STORAGE_KEYS.PRODUCTS, PRODUCTS);
    setProducts(storedProducts);
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = (product: any) => {
    const newProducts = [...products, { ...product }];
    setProducts(newProducts);
    setStoredData(STORAGE_KEYS.PRODUCTS, newProducts);
    setIsDialogOpen(false);
  };

  const handleUpdateProduct = (updatedProduct: any) => {
    const newProducts = products.map((p) => 
      p.nombre === updatedProduct.nombre ? updatedProduct : p
    );
    setProducts(newProducts);
    setStoredData(STORAGE_KEYS.PRODUCTS, newProducts);
    setSelectedProduct(null);
    setIsDialogOpen(false);
  };

  const handleDeleteProduct = (nombre: string) => {
    const newProducts = products.filter((p) => p.nombre !== nombre);
    setProducts(newProducts);
    setStoredData(STORAGE_KEYS.PRODUCTS, newProducts);
  };

  const calculateMargin = (precioVenta: number, costoProduccion: number) => {
    return ((precioVenta - costoProduccion) / precioVenta) * 100;
  };

  const getMarginStatus = (margin: number) => {
    if (margin >= 60) return { label: "Excelente", class: "bg-green-500" };
    if (margin >= 45) return { label: "Bueno", class: "bg-blue-500" };
    if (margin >= 30) return { label: "Regular", class: "bg-yellow-500" };
    return { label: "Bajo", class: "bg-red-500" };
  };

  return (
    <div className="flex flex-col ml-0 md:ml-64">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Productos</h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedProduct ? "Editar Producto" : "Agregar Nuevo Producto"}</DialogTitle>
                <DialogDescription>
                  {selectedProduct
                    ? "Actualizar información del producto en el sistema."
                    : "Agregar un nuevo producto al menú."}
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                product={selectedProduct}
                ingredients={INGREDIENTS}
                onSubmit={selectedProduct ? handleUpdateProduct : handleAddProduct}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gestión de Productos</CardTitle>
                <CardDescription>
                  Administra los productos del menú y sus ingredientes
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
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
                  <TableHead>Categoría</TableHead>
                  <TableHead>Precio de Venta</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>Margen</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const margin = calculateMargin(product.precioVenta, product.costoProduccion);
                    return (
                      <TableRow key={product.nombre}>
                        <TableCell className="font-medium">{product.nombre}</TableCell>
                        <TableCell>{product.categoria}</TableCell>
                        <TableCell>${product.precioVenta.toFixed(2)}</TableCell>
                        <TableCell>${product.costoProduccion.toFixed(2)}</TableCell>
                        <TableCell>{margin.toFixed(1)}%</TableCell>
                        <TableCell>
                          <Badge className={getMarginStatus(margin).class}>
                            {getMarginStatus(margin).label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedProduct(product);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProduct(product.nombre)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No se encontraron productos.
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