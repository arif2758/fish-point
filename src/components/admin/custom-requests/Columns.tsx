"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ICustomRequest, IUser } from "@/types"; // ✅ Import from index.ts
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<ICustomRequest>[] = [
  {
    accessorKey: "requestId",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-mono text-xs">{row.getValue("requestId")}</div>
    ),
  },
  {
    accessorKey: "requestedFishName",
    header: "Fish Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("requestedFishName")}</div>
    ),
  },
  {
    accessorKey: "userId", // Direct access
    header: "Customer",
    cell: ({ row }) => {
      // ✅ Type Assertion for Populated User
      const user = row.original.userId as IUser;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{user?.name || "Unknown"}</span>
          <span className="text-xs text-muted-foreground">
            {user?.phone || "N/A"}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "preferredWeight",
    header: "Weight",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      let color = "bg-slate-500";
      if (status === "pending")
        color = "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
      if (status === "price_offered")
        color = "bg-blue-500/20 text-blue-600 border-blue-500/30";
      if (status === "confirmed")
        color = "bg-green-500/20 text-green-600 border-green-500/30";

      return (
        <Badge className={`${color} capitalize border hover:${color}`}>
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const request = row.original;

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
            className="bg-card/95 backdrop-blur-xl border-border shadow-xl z-50"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/custom-requests/${request.requestId}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Eye className="h-4 w-4" /> View Details
              </Link>
            </DropdownMenuItem>
            {request.status === "pending" && (
              <DropdownMenuItem className="gap-2 text-blue-500 cursor-pointer">
                <MessageSquare className="h-4 w-4" /> Offer Price
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
