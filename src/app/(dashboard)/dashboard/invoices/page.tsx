import { columns, IInvoice } from "@/components/admin/invoices/Columns";
import { DataTable } from "@/components/admin/orders/DataTable";

const invoices: IInvoice[] = [
  {
    id: "INV-2024-001",
    orderId: "ORD-9901",
    customerName: "Rahim Islam",
    amount: 2450,
    date: "2024-03-20",
    status: "paid",
  },
  {
    id: "INV-2024-002",
    orderId: "ORD-9902",
    customerName: "Sonia Akter",
    amount: 1200,
    date: "2024-03-21",
    status: "unpaid",
  },
  {
    id: "INV-2024-003",
    orderId: "ORD-9903",
    customerName: "Arif Karim",
    amount: 4500,
    date: "2024-03-22",
    status: "paid",
  },
];

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Invoices</h2>
        <p className="text-muted-foreground">
          Manage and print your billing invoices.
        </p>
      </div>

      <DataTable columns={columns} data={invoices} filterKey="id" />
    </div>
  );
}
