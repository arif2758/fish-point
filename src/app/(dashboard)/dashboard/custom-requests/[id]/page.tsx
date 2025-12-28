import { notFound } from "next/navigation";
import { ICustomRequest, IUser } from "@/types"; // ✅ Correct Import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, DollarSign, Send } from "lucide-react";
import Image from "next/image";

// Dummy Fetch
async function getRequest(id: string): Promise<ICustomRequest | null> {
  // Simulate API Response with Populated User
  return {
    _id: "1",
    requestId: id,
    userId: {
      _id: "u1",
      name: "Rahim Uddin",
      phone: "01711111111",
      role: "customer",
    } as IUser, // ✅ Explicitly cast as IUser
    requestedFishName: "Big Chitol Fish (River)",
    preferredWeight: "Minimum 5kg",
    budgetLimit: 5500,
    status: "pending",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a42a4571da?q=80&w=1000",
    ],
    createdAt: "2024-03-20",
  };
}

export default async function RequestDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getRequest(id);

  if (!request) return notFound();

  // ✅ Safe User Access
  const user = request.userId as IUser;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            Request #{request.requestId}
            <Badge variant="secondary" className="capitalize">
              {request.status.replace("_", " ")}
            </Badge>
          </h2>
          <p className="text-muted-foreground mt-1">
            Requested on {request.createdAt as string}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: Request Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-xl border border-border/60">
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Fish Name
                  </p>
                  <p className="text-lg font-bold">
                    {request.requestedFishName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Preferred Weight
                  </p>
                  <p className="text-lg font-bold">{request.preferredWeight}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Budget Limit
                  </p>
                  <p className="text-lg font-bold text-primary">
                    {request.budgetLimit
                      ? `৳ ${request.budgetLimit}`
                      : "No Limit"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action: Offer Price (Only if pending) */}
          {request.status === "pending" && (
            <Card className="bg-card/50 backdrop-blur-xl border border-border/60">
              <CardHeader>
                <CardTitle>Admin Action</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Offer Price (Total)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        className="pl-9 h-11 bg-background"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Admin Note (Optional)</Label>
                    <Textarea
                      placeholder="Write a message to the customer..."
                      className="bg-background"
                    />
                  </div>
                  <Button className="w-full h-11 font-bold shadow-md">
                    <Send className="mr-2 h-4 w-4" /> Send Offer
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Customer & Media */}
        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-xl border border-border/60">
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">Customer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold">{user.phone}</p>
                  <p className="text-sm text-muted-foreground">Contact</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reference Image */}
          {request.images.length > 0 && (
            <Card className="bg-card/50 backdrop-blur-xl border border-border/60 overflow-hidden">
              <CardHeader>
                <CardTitle>Reference Image</CardTitle>
              </CardHeader>
              <div className="aspect-video relative w-full bg-muted">
                <Image
                  src={request.images[0]}
                  alt="Reference"
                  className="object-cover w-full h-full"
                />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
