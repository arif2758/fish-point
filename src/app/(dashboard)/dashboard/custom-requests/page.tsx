import { columns } from "@/components/admin/custom-requests/Columns";
import { DataTable } from "@/components/admin/orders/DataTable";
import { ICustomRequest, IUser } from "@/types";

// Dummy Data (Type-Safe)
const requests: ICustomRequest[] = [
  {
    _id: "1",
    requestId: "REQ-1001",
    userId: {
      _id: "u1",
      name: "Rahim",
      phone: "01711111111",
      role: "customer",
    } as IUser, // ✅ Explicit Type
    requestedFishName: "Big Chitol Fish",
    preferredWeight: "5kg+",
    budgetLimit: 5000,
    status: "pending",
    images: [],
    createdAt: "2024-03-20",
  },
  {
    _id: "2",
    requestId: "REQ-1002",
    userId: {
      _id: "u2",
      name: "Karim",
      phone: "01822222222",
      role: "customer",
    } as IUser,
    requestedFishName: "Sea Koral",
    preferredWeight: "3kg",
    status: "price_offered",
    adminOfferedPrice: 2800,
    images: [],
    createdAt: "2024-03-19",
  },
];

export default function CustomRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Custom Requests</h2>
          <p className="text-muted-foreground">
            Manage special fish requests from customers.
          </p>
        </div>
      </div>

      {/* ✅ Now type-safe */}
      <DataTable columns={columns} data={requests} filterKey="requestId" />
    </div>
  );
}
