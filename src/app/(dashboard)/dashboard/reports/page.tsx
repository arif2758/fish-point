import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesChart } from "@/components/admin/reports/SalesChart";
import {
  TrendingUp,
  ArrowUpRight,
  DollarSign,
  ShoppingBag,
} from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Reports & Analytics
        </h2>
        <p className="text-muted-foreground">
          Detailed overview of your store performance.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card/50 border-border/60">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold">৳ 1,24,500</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-full">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+12.5% from last week</span>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="bg-card/50 border-border/60">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Orders Completed
                </p>
                <p className="text-2xl font-bold">842</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-full">
                <ShoppingBag className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-blue-600 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+5.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Growth Card */}
        <Card className="bg-card/50 border-border/60">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Growth Rate
                </p>
                <p className="text-2xl font-bold">18.4%</p>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-orange-600 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>Stable performance</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Analytics Chart */}
      <Card className="bg-card/50 border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart />
        </CardContent>
      </Card>
    </div>
  );
}
