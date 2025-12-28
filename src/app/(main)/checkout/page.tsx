// src/app/(main)/checkout/page.tsx
import { Metadata } from "next";
import CheckoutPageClient from "./CheckoutPageClient";

export const metadata: Metadata = {
  title: "চেকআউট",
  description: "আপনার অর্ডার সম্পন্ন করুন। ক্যাশ অন ডেলিভারি উপলব্ধ।",
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
