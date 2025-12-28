import { Order } from "@/types/order";
import { columns } from "@/components/admin/orders/Columns"; // PascalCase Import
import { DataTable } from "@/components/admin/orders/DataTable"; // PascalCase Import

// Dummy Data (English)
const orders: Order[] = [
  {
    id: "ORD-171542",
    customer: {
      name: "Rahim Uddin",
      phone: "01712345678",
      address: "Mirpur 10",
    },
    products: [{ name: "Pangas", quantity: 2, price: 300 }],
    totalAmount: 630,
    paymentMethod: "cod",
    status: "pending",
    date: "2024-03-15",
  }, 
  {
    id: "ORD-171543",
    customer: { name: "Karim Mia", phone: "01812345678", address: "Dhanmondi" },
    products: [{ name: "Hilsha", quantity: 1, price: 1500 }],
    totalAmount: 1530,
    paymentMethod: "bkash",
    status: "processing",
    date: "2024-03-14",
  },
];

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders List</h2>
          <p className="text-muted-foreground">
            Manage and track all customer orders here.
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={orders} filterKey="id" />
    </div>
  );
}
