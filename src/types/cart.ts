// src/types/cart.ts
import { IProduct } from "./index";

export interface CartItem {
  product: IProduct;
  quantity: number;
  selectedOptions: {
    cuttingSize?: string;
    headCut?: number;
    cuttingStyle?: string;
  };
  addedAt: Date;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
  lastUpdated: Date;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (
    product: IProduct,
    quantity: number,
    options?: CartItem["selectedOptions"]
  ) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}
