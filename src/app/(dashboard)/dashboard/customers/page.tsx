import { IUser } from "@/types";
import { columns } from "@/components/admin/customers/Columns";
import { DataTable } from "@/components/admin/orders/DataTable"; // Reusing dynamic table

// Dummy Data (Later replace with fetch from UserCollectionModel)
const customers: IUser[] = [
  {
    _id: "u1",
    name: "Ariful Islam",
    phone: "01712345678",
    email: "arif@example.com",
    role: "customer",
    createdAt: new Date("2024-01-10"),
  },
  {
    _id: "u2",
    name: "Sonia Akter",
    phone: "01812345678",
    email: "sonia@example.com",
    role: "customer",
    createdAt: new Date("2024-02-15"),
  },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            View and manage your registered customers.
          </p>
        </div>
      </div>

      {/* Search by Name */}
      <DataTable columns={columns} data={customers} filterKey="name" />
    </div>
  );
}
