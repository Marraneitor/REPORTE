"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/i18n-context";
import { useState, useRef } from "react";

interface ProductCardProps {
  product: {
    nombre: string;
    categoria: string;
    precioVenta: number;
    descripcion: string;
    disponible: boolean;
    imagen?: string;
  };
  onAddToCart: (product: any) => void;
  onImageChange?: (productName: string, imageUrl: string) => void;
}

export function ProductCard({ product, onAddToCart, onImageChange }: ProductCardProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(product.imagen);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setImagePreview(imageUrl);
        onImageChange?.(product.nombre, imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "hamburguesas":
        return "bg-red-500";
      case "hot dogs":
        return "bg-yellow-500";
      case "postres":
        return "bg-pink-500";
      case "entradas":
        return "bg-orange-500";
      case "complementos":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!product.disponible) {
    return null;
  }

  return (
    <Card className="overflow-hidden border hover:shadow-md transition-shadow group">
      <CardContent className="p-0">
        <div
          className="relative h-32 bg-muted bg-center bg-cover group-hover:opacity-90 transition-opacity cursor-pointer"
          style={{
            backgroundImage: imagePreview
              ? `url(${imagePreview})`
              : "linear-gradient(to bottom right, var(--muted), var(--muted-foreground))",
          }}
          onClick={handleImageClick}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <ImageIcon className="h-6 w-6 text-white" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        <div className={`h-1 ${getCategoryColor(product.categoria)}`} />
        <div className="p-3 space-y-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium leading-tight text-sm truncate flex-1">
              {product.nombre}
            </h3>
            <Badge className={`${getCategoryColor(product.categoria)} text-[10px] shrink-0`}>
              {product.categoria}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {product.descripcion}
          </p>
          <div className="flex items-center justify-between gap-2 pt-1">
            <p className="text-lg font-bold">${product.precioVenta.toFixed(2)}</p>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}