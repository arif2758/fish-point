import { IProduct } from "@/types";
import { columns } from "@/components/admin/products/Columns";
import { DataTable } from "@/components/admin/orders/DataTable"; // Reusing DataTable component
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

// Dummy Data (Replace with API fetch)
const products: IProduct[] = [
  {
    productId: "PROD-001",
    title: "তাজা রুই মাছ",
    name_en: "Fresh Rui Fish",
    slug: "rui-fish",
    category: "River",
    basePrice: 500,
    discountPercentage: 10,
    salePrice: 450,
    stockKg: 50,
    fishType: "rohu",
    published: true,
    mainImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000",
    // ... add other required fields for TS validation
  } as IProduct, // Type assertion for dummy data
];

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            Manage your inventory and product listings.
          </p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link href="/dashboard/products/add">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={products} filterKey="title" />
    </div>
  );
}
