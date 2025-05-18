"use client";

import { User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface CustomerCardProps {
  customer: {
    id: number;
    name: string;
    phone: string;
    address: string;
    points: number;
  };
  onClick?: () => void;
  selected?: boolean;
}

export function CustomerCard({ customer, onClick, selected }: CustomerCardProps) {
  const { t } = useTranslation();

  const getPointsStatus = (points: number) => {
    if (points >= 300) return { label: t("pos.customerStatus.vip"), class: "bg-green-500" };
    if (points >= 200) return { label: t("pos.customerStatus.gold"), class: "bg-yellow-500" };
    if (points >= 100) return { label: t("pos.customerStatus.silver"), class: "bg-gray-400" };
    return { label: t("pos.customerStatus.bronze"), class: "bg-amber-700" };
  };

  const status = getPointsStatus(customer.points);

  return (
    <div 
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        selected 
          ? "bg-primary/10 hover:bg-primary/15"
          : "hover:bg-primary/5"
      }`}
      onClick={onClick}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <User className="h-5 w-5 text-primary" />
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">{customer.name}</span>
            <Badge className={status.class}>{status.label}</Badge>
          </div>
          {selected && (
            <Badge variant="outline" className="ml-2">
              {t("pos.selected") || "Selected"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{customer.phone}</span>
          <span>•</span>
          <span>{t("pos.points")}: {customer.points}</span>
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {customer.address}
        </div>
      </div>
    </div>
  );
}