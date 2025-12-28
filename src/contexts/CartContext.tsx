// src/contexts/CartContext.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { IProduct } from "@/types";
import type { Cart, CartItem, CartContextType } from "@/types/cart";
import { calculateTotalPrice } from "@/lib/priceUtils";

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "fishpoint_cart";

const initialCart: Cart = {
  items: [],
  total: 0,
  itemCount: 0,
  lastUpdated: new Date(),
};

function calculateCartTotals(items: CartItem[]): Pick<Cart, "total" | "itemCount"> {
  const total = items.reduce((sum, item) => {
    return sum + calculateTotalPrice(item.product.salePrice, item.quantity);
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { total, itemCount };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Cart;
        // Convert date strings back to Date objects
        parsed.lastUpdated = new Date(parsed.lastUpdated);
        parsed.items = parsed.items.map((item) => ({
          ...item,
          addedAt: new Date(item.addedAt),
        }));
        setCart(parsed);
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Failed to save cart:", error);
      }
    }
  }, [cart, isHydrated]);

  const addToCart = useCallback(
    (
      product: IProduct,
      quantity: number,
      options?: CartItem["selectedOptions"]
    ) => {
      setCart((prevCart) => {
        const existingItemIndex = prevCart.items.findIndex(
          (item) => item.product.productId === product.productId
        );

        let newItems: CartItem[];

        if (existingItemIndex > -1) {
          // Update existing item
          newItems = [...prevCart.items];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity,
            selectedOptions: options || newItems[existingItemIndex].selectedOptions,
          };
        } else {
          // Add new item
          const newItem: CartItem = {
            product,
            quantity,
            selectedOptions: options || {},
            addedAt: new Date(),
          };
          newItems = [...prevCart.items, newItem];
        }

        const { total, itemCount } = calculateCartTotals(newItems);

        return {
          items: newItems,
          total,
          itemCount,
          lastUpdated: new Date(),
        };
      });
    },
    []
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      setCart((prevCart) => {
        const newItems = prevCart.items.filter(
          (item) => item.product.productId !== productId
        );
        const { total, itemCount } = calculateCartTotals(newItems);
        return {
          items: newItems,
          total,
          itemCount,
          lastUpdated: new Date(),
        };
      });
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.product.productId === productId ? { ...item, quantity } : item
      );
      const { total, itemCount } = calculateCartTotals(newItems);
      return {
        items: newItems,
        total,
        itemCount,
        lastUpdated: new Date(),
      };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (item) => item.product.productId !== productId
      );
      const { total, itemCount } = calculateCartTotals(newItems);
      return {
        items: newItems,
        total,
        itemCount,
        lastUpdated: new Date(),
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(initialCart);
  }, []);

  const isInCart = useCallback(
    (productId: string) => {
      return cart.items.some((item) => item.product.productId === productId);
    },
    [cart.items]
  );

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = cart.items.find(
        (item) => item.product.productId === productId
      );
      return item?.quantity || 0;
    },
    [cart.items]
  );

  const contextValue = useMemo<CartContextType>(
    () => ({
      cart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      isInCart,
      getItemQuantity,
    }),
    [cart, addToCart, updateQuantity, removeItem, clearCart, isInCart, getItemQuantity]
  );

  // Prevent hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}