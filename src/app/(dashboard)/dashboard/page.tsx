import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingBag, Users, Activity, LucideIcon } from "lucide-react"

// Interface for StatsCard props
interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  description: string;
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
          Dashboard Overview
        </h2>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Revenue" 
          value="৳ 45,231" 
          icon={DollarSign} 
          description="+20.1% from last month" 
        />
        <StatsCard 
          title="Orders" 
          value="+573" 
          icon={ShoppingBag} 
          description="+180 new orders" 
        />
        <StatsCard 
          title="Customers" 
          value="+2,350" 
          icon={Users} 
          description="+19% new customers" 
        />
        <StatsCard 
          title="Active Now" 
          value="+573" 
          icon={Activity} 
          description="+201 active users" 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card/40 backdrop-blur-lg border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-50 flex items-center justify-center text-muted-foreground">
               (Chart Component Here)
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 bg-card/40 backdrop-blur-lg border-white/10 shadow-lg">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <p className="text-sm text-muted-foreground">No recent orders.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatsCard({ title, value, icon: Icon, description }: StatsCardProps) {
  return (
    <Card className="bg-card/40 backdrop-blur-lg border-white/10 shadow-md hover:shadow-lg transition-all hover:bg-card/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">
           <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}