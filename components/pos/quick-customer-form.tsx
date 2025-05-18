"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/i18n/i18n-context";

const customerSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  phone: z.string().min(7, {
    message: "El teléfono debe tener al menos 7 caracteres.",
  }),
  address: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
});

type CustomerFormData = z.infer<typeof customerSchema>;

interface QuickCustomerFormProps {
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
}

export function QuickCustomerForm({ onSubmit, onCancel }: QuickCustomerFormProps) {
  const { t } = useTranslation();
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customers.name") || "Nombre"}</FormLabel>
              <FormControl>
                <Input autoFocus placeholder={t("customers.namePlaceholder") || "Nombre del cliente"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customers.phone") || "Teléfono"}</FormLabel>
              <FormControl>
                <Input placeholder={t("customers.phonePlaceholder") || "Número de teléfono"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("customers.address") || "Dirección"}</FormLabel>
              <FormControl>
                <Input placeholder={t("customers.addressPlaceholder") || "Dirección del cliente"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("common.cancel") || "Cancelar"}
          </Button>
          <Button type="submit">
            {t("customers.add") || "Agregar Cliente"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
