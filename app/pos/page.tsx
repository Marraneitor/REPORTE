"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Search, Plus, Minus, Trash, User, Menu, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { CustomerCard } from "@/components/pos/customer-card";
import { ProductCard } from "@/components/pos/product-card";
import { QuickCustomerForm } from "@/components/pos/quick-customer-form";
import { PRODUCTS } from "@/lib/data/products";
import { getStoredData, setStoredData, STORAGE_KEYS } from "@/lib/local-storage";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { useSales } from "@/lib/context/sales-context";

interface Product {
  nombre: string;
  categoria: string;
  precioVenta: number;
  descripcion: string;
  disponible: boolean;
  imagen?: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
  points: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

type PaymentMethod = "cash" | "card";

interface Category {
  id: string;
  label: string;
}

const CATEGORIES: Category[] = [
  { id: "all", label: "Todos" },
  { id: "Entradas", label: "Entradas" },
  { id: "Hamburguesas", label: "Hamburguesas" },
  { id: "Hot Dogs", label: "Hot Dogs" },
  { id: "Complementos", label: "Complementos" },
];

export default function POSPage() {
  const { t } = useTranslation();
  const { addSale } = useSales();
  const [products, setProducts] = useState<Product[]>(() => {
    const storedImages = getStoredData<Record<string, string>>(STORAGE_KEYS.PRODUCT_IMAGES, {});
    return PRODUCTS.map(p => ({
      ...p,
      imagen: storedImages[p.nombre]
    }));
  });
  const [cart, setCart] = useState<CartItem[]>(() => getStoredData(STORAGE_KEYS.CART, []));
  const [customers, setCustomers] = useState<Customer[]>(() => 
    getStoredData(STORAGE_KEYS.CUSTOMERS, [])
  );
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(() => 
    getStoredData(STORAGE_KEYS.SELECTED_CUSTOMER, null)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);

  // Guardar cambios en el carrito
  useEffect(() => {
    setStoredData(STORAGE_KEYS.CART, cart);
  }, [cart]);

  // Guardar cambios en los clientes
  useEffect(() => {
    if (customers.length > 0) {
      setStoredData(STORAGE_KEYS.CUSTOMERS, customers);
    }
  }, [customers]);

  // Guardar cliente seleccionado
  useEffect(() => {
    if (selectedCustomer) {
      setStoredData(STORAGE_KEYS.SELECTED_CUSTOMER, selectedCustomer);
    } else {
      localStorage.removeItem(STORAGE_KEYS.SELECTED_CUSTOMER);
    }
  }, [selectedCustomer]);

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearchTerm("");
  };

  const handleNewCustomer = (data: { name: string; phone: string; address: string }) => {
    const newCustomer: Customer = {
      id: Date.now(),
      ...data,
      points: 0
    };
    setCustomers(prev => [...prev, newCustomer]);
    setSelectedCustomer(newCustomer);
    setShowNewCustomerForm(false);
    toast.success("Cliente agregado con éxito");
  };

  // Manejadores de carrito
  const addToCart = (product: Product) => {
    if (!product.disponible) {
      toast.error("Producto no disponible");
      return;
    }

    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.product.nombre === product.nombre);
      
      if (existingItem) {
        return currentCart.map(item =>
          item.product.nombre === product.nombre
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { product, quantity: 1 }];
    });
    toast.success("Producto agregado");
  };

  const removeFromCart = (productName: string) => {
    setCart(prev => prev.filter(item => item.product.nombre !== productName));
  };

  const updateQuantity = (productName: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productName);
      return;
    }

    setCart(prev => prev.map(item =>
      item.product.nombre === productName
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const handleImageChange = (productName: string, imageUrl: string) => {
    // Actualizar el producto con la nueva imagen
    const newProducts = products.map(p =>
      p.nombre === productName ? { ...p, imagen: imageUrl } : p
    );
    setProducts(newProducts);

    // Guardar la imagen en localStorage
    const storedImages = getStoredData<Record<string, string>>(STORAGE_KEYS.PRODUCT_IMAGES, {});
    storedImages[productName] = imageUrl;
    setStoredData(STORAGE_KEYS.PRODUCT_IMAGES, storedImages);
  };

  // Calcular total
  const total = cart.reduce((sum, item) => 
    sum + (item.product.precioVenta * item.quantity), 0
  );

  // Filtrar productos y clientes
  const filteredProducts = products.filter((product) => {
    const matchesSearch = searchTerm.length === 0 || 
      product.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.categoria === selectedCategory;
    return matchesSearch && matchesCategory && product.disponible;
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone.includes(customerSearchTerm)
  );

  const handleCompleteSale = async () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    if (!selectedCustomer) {
      toast.error("Por favor selecciona un cliente");
      return;
    }

    // Calculate the sale details
    const sale = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: {
        id: selectedCustomer.id,
        name: selectedCustomer.name
      },
      items: cart.map(item => ({
        id: Date.now(),
        name: item.product.nombre,
        price: item.product.precioVenta,
        quantity: item.quantity,
        total: item.product.precioVenta * item.quantity
      })),
      subtotal: total,
      total: total,
      discount: 0, // Add default discount
      paymentMethod,
      cashReceived: paymentMethod === "cash" ? cashReceived : undefined,
      change: paymentMethod === "cash" ? cashReceived - total : undefined
    };

    try {
      addSale(sale);
      
      // Clear cart
      setCart([]);
      setSelectedCustomer(null);
      setPaymentMethod("cash");
      setCashReceived(0);
      
      toast.success("Venta completada con éxito");
    } catch (error) {
      console.error("Error completing sale:", error);
      toast.error("Error al completar la venta");
    }
  };

  // CartContent component
  const CartContent = () => {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Carrito</h2>
          {selectedCustomer ? (
            <div className="flex items-center gap-2">
              <CustomerCard customer={selectedCustomer} selected />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSelectedCustomer(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {t("pos.selectCustomer")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("pos.selectCustomer")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder={t("pos.searchCustomers")}
                      value={customerSearchTerm}
                      onChange={(e) => setCustomerSearchTerm(e.target.value)}
                    />
                  </div>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {filteredCustomers.map((customer) => (
                        <CustomerCard
                          key={customer.id}
                          customer={customer}
                          onClick={() => handleCustomerSelect(customer)}
                        />
                      ))}
                      {filteredCustomers.length === 0 && (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>{t("pos.noCustomersFound")}</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                  <Button
                    onClick={() => setShowNewCustomerForm(true)}
                    className="w-full"
                    variant="outline"
                  >
                    {t("pos.newCustomer")}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="mx-auto h-8 w-8 mb-2 opacity-50" />
                <p>Agrega productos para iniciar la venta</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <Card key={item.product.nombre}>
                    <CardContent className="p-3 flex items-start gap-3">
                      {/* Item content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm truncate">
                            {item.product.nombre}
                          </p>
                          <p className="text-sm font-medium">
                            ${(item.product.precioVenta * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ${item.product.precioVenta.toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      {/* Quantity controls */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.nombre, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="w-8 text-center text-sm tabular-nums">
                          {item.quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.product.nombre, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeFromCart(item.product.nombre)}
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        {cart.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="space-y-3">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Efectivo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Tarjeta</Label>
                </div>
              </RadioGroup>

              {paymentMethod === "cash" && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={0}
                      step="0.50"
                      value={cashReceived || ""}
                      onChange={(e) => setCashReceived(Number(e.target.value))}
                      placeholder="Efectivo recibido"
                      className="flex-1"
                    />
                  </div>
                  {cashReceived > 0 && (
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Cambio:</span>
                        <span className="font-medium">
                          ${Math.max(0, cashReceived - total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-sm">
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={handleCompleteSale}
                disabled={paymentMethod === "cash" && cashReceived < total}
              >
                {t("pos.completeSale")}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <div className="border-b">
          <div className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("pos.searchProducts")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Categories menu (mobile) */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <ScrollArea className="h-full">
                  <div className="space-y-2 p-2">
                    {CATEGORIES.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>

            {/* Categories (desktop) */}
            <div className="hidden md:flex space-x-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "secondary" : "ghost"}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Cart button (mobile) */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative md:hidden">
                  <ShoppingCart className="h-5 w-5" />
                  {cart.length > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <CartContent />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Products grid */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.nombre}
                product={product}
                onAddToCart={addToCart}
                onImageChange={handleImageChange}
              />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <p>No se encontraron productos</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Cart (desktop) */}
      <div className="hidden md:block w-[400px] border-l bg-card">
        <CartContent />
      </div>

      {/* New Customer Dialog */}
      <Dialog open={showNewCustomerForm} onOpenChange={setShowNewCustomerForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nuevo Cliente</DialogTitle>
          </DialogHeader>
          <QuickCustomerForm 
            onSubmit={handleNewCustomer} 
            onCancel={() => setShowNewCustomerForm(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}