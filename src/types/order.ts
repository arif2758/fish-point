// src/types/order.ts
export type OrderStatus = "pending" | "processing" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  products: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: "cod" | "bkash" | "nagad" | "rocket";
  status: OrderStatus;
  date: string;
  // New Optional Fields
  paymentDetails?: {
    senderNumber: string;
    trxId: string;
  };
}
