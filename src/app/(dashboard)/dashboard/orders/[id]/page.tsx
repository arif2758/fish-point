// src/app/(dashboard)/dashboard/orders/[id]/page.tsx
import { notFound } from "next/navigation";
import { Order } from "@/types/order"; // Ensure Order type includes payment details
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Phone,
  MapPin,
  User,
  CreditCard,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Printer,
} from "lucide-react";

// Dummy Data Function (Replace with API call later)
async function getOrder(id: string): Promise<Order | null> {
  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Return dummy data matching the ID
  return {
    id: id,
    customer: {
      name: "Karim Mia",
      phone: "01812345678",
      address: "House 12, Road 5, Dhanmondi, Dhaka",
    },
    products: [
      { name: "Hilsha (Padma)", quantity: 1, price: 1500 },
      { name: "Rui (Large)", quantity: 2, price: 450 },
    ],
    totalAmount: 2400,
    paymentMethod: "bkash",
    status: "processing", // pending | processing | delivered | cancelled
    date: "2024-03-14",
    // Payment details (Optional based on method)
    paymentDetails: {
      senderNumber: "01987654321",
      trxId: "TXN123456789",
    },
  } as Order;
}

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) return notFound();

  // Status Color Logic
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "processing":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "delivered":
        return "bg-green-500/10 text-green-600 border-green-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            Order #{order.id}
            <Badge className={`capitalize ${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
          </h2>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Calendar className="h-4 w-4" /> Placed on {order.date}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
          {order.status === "pending" && (
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Truck className="h-4 w-4" /> Process Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Order Items & Payment */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-sm">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.products.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center">
                        🐟
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} kg x ৳{item.price}
                        </p>
                      </div>
                    </div>
                    <p className="font-bold">৳ {item.quantity * item.price}</p>
                  </div>
                ))}

                <div className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>৳ {order.totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Delivery Charge
                    </span>
                    <span>৳ 30</span>
                  </div>
                  <Separator className="my-2 bg-white/10" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      ৳ {order.totalAmount + 30}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Verification Section */}
          <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Payment Method
                  </p>
                  <Badge
                    variant="outline"
                    className="uppercase font-bold tracking-wider"
                  >
                    {order.paymentMethod}
                  </Badge>
                </div>

                {/* Show details only for Mobile Payments */}
                {order.paymentMethod !== "cod" && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Sender Number
                      </p>
                      <p className="font-mono font-medium text-lg">
                        {order.paymentDetails?.senderNumber}
                      </p>
                    </div>
                    <div className="sm:col-span-2 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-xs text-yellow-600 mb-1 font-bold uppercase">
                        Transaction ID (TrxID)
                      </p>
                      <div className="flex items-center gap-3">
                        <p className="font-mono text-xl font-bold tracking-widest text-yellow-700 dark:text-yellow-400">
                          {order.paymentDetails?.trxId}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                        >
                          <CopyIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer Details */}
        <div className="space-y-6">
          <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-sm">
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{order.customer.name}</p>
                  <p className="text-sm text-muted-foreground">Customer</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{order.customer.phone}</p>
                  <p className="text-sm text-muted-foreground">Contact</p>
                </div>
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium leading-relaxed">
                    {order.customer.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Delivery Address
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-card/40 backdrop-blur-md border-white/10 shadow-sm">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Delivered
              </Button>
              <Button variant="destructive" className="w-full">
                <XCircle className="mr-2 h-4 w-4" /> Cancel Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
