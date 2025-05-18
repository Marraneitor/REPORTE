"use client";

import { createContext, useContext, useState } from "react";
import { es } from "./es";

type Language = "es";
type Translations = typeof es;

interface I18nContextType {
  language: Language;
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language] = useState<Language>("es");

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = es;
    
    for (const k of keys) {
      if (value[k] === undefined) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
      value = value[k];
    }
    
    return value;
  };

  return (
    <I18nContext.Provider value={{ language, t, setLanguage: () => {} }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
}
