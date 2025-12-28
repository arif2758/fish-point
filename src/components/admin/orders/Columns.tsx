"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Copy,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "customer.name", // Access nested data correctly
    header: "Customer",
    cell: ({ row }) => {
      // Type-safe access to nested object
      const customer = row.original.customer;
      return (
        <div className="flex flex-col">
          <span className="font-medium">{customer.name}</span>
          <span className="text-xs text-muted-foreground">
            {customer.phone}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-BD", {
        // Changed to en-BD
        style: "currency",
        currency: "BDT",
      }).format(amount);
      return <div className="font-bold">{formatted}</div>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      return (
        <Badge variant="outline" className="uppercase text-[10px]">
          {method}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let color = "bg-slate-500";
      if (status === "pending")
        color = "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      if (status === "processing")
        color = "bg-blue-500/20 text-blue-600 border-blue-500/30";
      if (status === "delivered")
        color = "bg-green-500/20 text-green-600 border-green-500/30";
      if (status === "cancelled")
        color = "bg-red-500/20 text-red-600 border-red-500/30";

      return (
        <Badge className={`${color} capitalize border hover:${color}`}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-card/90 backdrop-blur-xl border-white/10"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(order.id)}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />


           <DropdownMenuItem asChild>
              <Link href={`/dashboard/orders/${order.id}`} className="flex items-center gap-2 cursor-pointer">
                <Eye className="h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-blue-500">
              <Truck className="h-4 w-4" /> Mark Processing
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-green-500">
              <CheckCircle className="h-4 w-4" /> Mark Delivered
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-red-500">
              <XCircle className="h-4 w-4" /> Cancel Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
