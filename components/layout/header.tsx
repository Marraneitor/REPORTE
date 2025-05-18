"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu as Burger, ChevronDown, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/i18n-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { t } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        isScrolled
          ? "border-b bg-background"
          : "bg-background/0 dark:bg-background/0"
      )}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="hidden items-center space-x-2 md:flex">
            <span className="hidden text-xl font-bold sm:inline-block">
              Sr & SraBurger Manager
            </span>
          </Link>
          <div className="md:hidden">
            <Button
              variant="ghost"
              className="px-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Burger className="h-5 w-5" />
              <span className="sr-only">{t("common.toggleMenu")}</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/products"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t("common.products")}
            </Link>
            <Link
              href="/ingredients"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t("common.ingredients")}
            </Link>
            <Link
              href="/sales"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t("common.sales")}
            </Link>
            <Link
              href="/reports"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {t("common.reports")}
            </Link>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <span>{t("common.menu")}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href="/profile">{t("common.profile")}</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/settings">{t("common.settings")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
          <Button size="icon" variant="ghost">
            <ShoppingCart className="h-5 w-5" />
            <span className="sr-only">{t("pos.cart")}</span>
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b py-4">
          <div className="container space-y-1">
            <Link
              href="/"
              className="block px-2 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/pos"
              className="block px-2 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Point of Sale
            </Link>
            <Link
              href="/customers"
              className="block px-2 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Customers
            </Link>
            <Link
              href="/ingredients"
              className="block px-2 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ingredients
            </Link>
            <Link
              href="/products"
              className="block px-2 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/sales"
              className="block px-2 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sales
            </Link>
            <Link
              href="/purchases"
              className="block px-2 py-2 text-sm font-medium hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Purchases
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}