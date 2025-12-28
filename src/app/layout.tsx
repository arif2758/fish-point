import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Fish Point - সেরা তাজা মাছের বাজার",
    template: "%s | Fish Point",
  },
  description: "অনলাইনে অর্ডার করুন তাজা মাছ। ২০ মিনিটে হোম ডেলিভারি।",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fish Point",
  },
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: [{ url: "/logo.svg" }],
  },
  openGraph: {
    title: "Fish Point - সেরা তাজা মাছের বাজার",
    description: "অনলাইনে অর্ডার করুন তাজা মাছ। ২০ মিনিটে হোম ডেলিভারি।",
    url: "https://fishpoint.com",
    siteName: "Fish Point",
    images: [
      {
        url: "/fish-point-og.png",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fish Point - সেরা তাজা মাছের বাজার",
    description: "অনলাইনে অর্ডার করুন তাজা মাছ। ২০ মিনিটে হোম ডেলিভারি।",
    images: ["/fish-point-og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {children}
          <Toaster position="top-center" />
        </CartProvider>
      </body>
    </html>
  );
}