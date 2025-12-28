import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Clock, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeliveryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Delivery Tracking
          </h2>
          <p className="text-muted-foreground">
            Manage active shipments and logistics.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Sample Active Delivery Card */}
        <Card className="bg-card/50 backdrop-blur-xl border-border/60">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-full">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Order #ORD-9921</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Assigned to: Delivery Man (Sujon)
                </p>
              </div>
            </div>
            <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
              In Transit
            </Badge>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-bold">Dhanmondi, Road 27</p>
                    <p className="text-xs text-muted-foreground">
                      House 12, Level 4, Flat B
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs">
                    Estimated Delivery:{" "}
                    <span className="font-bold">45 mins</span>
                  </p>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <Button variant="outline" size="sm">
                  Call Customer
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Delivered
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
