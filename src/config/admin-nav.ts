import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  MessageSquareMore,
  Truck,
  BarChart3,
  FileText,
} from "lucide-react";

export const adminNav = {
  user: {
    name: "Admin",
    email: "admin@fishpoint.com",
    avatar: "",
  },
  main: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Orders",
      url: "/dashboard/orders", // Updated URL structure
      icon: ShoppingBag,
      badge: "new",
    },
    {
      title: "Products",
      url: "/dashboard/products", // Updated URL structure
      icon: Package,
    },
    {
      title: "Custom Requests",
      url: "/dashboard/custom-requests",
      icon: MessageSquareMore,
    },
    {
      title: "Delivery",
      url: "/dashboard/delivery",
      icon: Truck,
    },
  ],
  analytics: [
    {
      title: "Reports",
      url: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      title: "Customers",
      url: "/dashboard/customers",
      icon: Users,
    },
    {
      title: "Invoices",
      url: "/dashboard/invoices",
      icon: FileText,
    },
  ],
};
