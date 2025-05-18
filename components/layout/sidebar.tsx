"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Layers,
  PackageSearch,
  Receipt,
  ShoppingBasket,
  User,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/i18n-context";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const useSidebarItems = () => {
  const { t } = useTranslation();

  return [
    {
      title: t("common.dashboard"),
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: t("common.pos"),
      href: "/pos",
      icon: <ShoppingBasket className="h-5 w-5" />,
    },
    {
      title: t("common.products"),
      href: "/products",
      icon: <PackageSearch className="h-5 w-5" />,
    },
    {
      title: t("common.ingredients"),
      href: "/ingredients",
      icon: <Layers className="h-5 w-5" />,
    },
    {
      title: t("common.customers"),
      href: "/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: t("common.sales"),
      href: "/sales",
      icon: <Receipt className="h-5 w-5" />,
    },
    {
      title: "Seguimiento",
      href: "/ingredient-tracking",
      icon: <ChevronRight className="h-5 w-5" />,
    },
    {
      title: t("common.purchases"),
      href: "/purchases",
      icon: <ShoppingBasket className="h-5 w-5" />,
    },
  ];
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const sidebarItems = useSidebarItems();

  return (
    <div
      className={cn(
        "relative border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <Button
          variant="ghost"
          className={cn(
            "absolute -right-4 top-4 z-10 h-8 w-8 rounded-full p-0",
            isCollapsed && "rotate-180"
          )}
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <nav className="flex-1 space-y-1 p-2">
          {sidebarItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent" : "transparent",
                  isCollapsed ? "justify-center" : "justify-start"
                )}
              >
                {item.icon}
                {!isCollapsed && (
                  <span className="ml-3 truncate">{item.title}</span>
                )}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}