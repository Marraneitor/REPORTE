'use client';

export const STORAGE_KEYS = {
  CUSTOMERS: 'sr-burger-customers',
  CART: 'sr-burger-cart',
  SELECTED_CUSTOMER: 'sr-burger-selected-customer',
  INGREDIENTS: 'sr-burger-ingredients',
  PURCHASES: 'sr-burger-purchases',
  INGREDIENT_USAGE: 'sr-burger-ingredient-usage',
  SALES: 'sr-burger-sales',
  PRODUCTS: 'sr-burger-products',
  PRODUCT_IMAGES: 'sr-burger-product-images',
  PRODUCTS_WITH_IMAGES: 'sr-burger-products-with-images'
} as const;

export function getStoredData<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage:`, error);
    return defaultValue;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage:`, error);
  }
}
