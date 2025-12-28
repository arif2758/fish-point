"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Download, Eye } from "lucide-react";

// Define a simple Interface for Invoices
export interface IInvoice {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  date: string;
  status: "paid" | "unpaid";
}

export const columns: ColumnDef<IInvoice>[] = [
  {
    accessorKey: "id",
    header: "Invoice No",
    cell: ({ row }) => (
      <div className="font-mono text-xs font-bold">#{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="font-bold">৳ {row.getValue("amount")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={
            status === "paid"
              ? "bg-green-500/10 text-green-600"
              : "bg-red-500/10 text-red-600"
          }
        >
          {status.toUpperCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Printer className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
