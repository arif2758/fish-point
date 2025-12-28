// src/app/(main)/cart/page.tsx
import { Metadata } from "next";
import CartPageClient from "./CartPageClient";

export const metadata: Metadata = {
  title: "কার্ট",
  description: "আপনার নির্বাচিত পণ্যগুলো দেখুন এবং অর্ডার সম্পন্ন করুন।",
};

export default function CartPage() {
  return <CartPageClient />;
}