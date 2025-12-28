"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IProduct } from "@/types"; // Ensure correct import path
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<IProduct>[] = [
  {
    accessorKey: "mainImage",
    header: "Image",
    cell: ({ row }) => (
      <div className="relative h-10 w-10 overflow-hidden rounded-md border border-white/10">
        <Image
          src={row.getValue("mainImage")}
          alt={row.original.title}
          fill
          className="object-cover"
        />
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium truncate max-w-37.5">
          {row.getValue("title")}
        </span>
        <span className="text-xs text-muted-foreground truncate max-w-37.5">
          {row.original.name_en}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "fishType",
    header: "Category",
    cell: ({ row }) => (
      <Badge variant="secondary" className="capitalize">
        {row.getValue("fishType")}
      </Badge>
    ),
  },
  {
    accessorKey: "salePrice",
    header: "Price",
    cell: ({ row }) => (
      <div className="font-medium">
        ৳ {row.getValue("salePrice")}
        {row.original.discountPercentage > 0 && (
          <span className="ml-1 text-xs text-red-400">
            (-{row.original.discountPercentage}%)
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "stockKg",
    header: "Stock",
    cell: ({ row }) => {
      const stock = row.getValue("stockKg") as number;
      return (
        <Badge variant={stock > 0 ? "outline" : "destructive"}>
          {stock > 0 ? `${stock} kg` : "Out of Stock"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "published",
    header: "Status",
    cell: ({ row }) => {
      const isPublished = row.getValue("published");
      return (
        <Badge
          className={
            isPublished
              ? "bg-green-500/10 text-green-600 hover:bg-green-500/20"
              : "bg-gray-500/10 text-gray-600"
          }
        >
          {isPublished ? "Active" : "Draft"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

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
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/products/${product.productId}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Edit className="h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/products/${product.slug}`}
                target="_blank"
                className="flex items-center gap-2 cursor-pointer"
              >
                <Eye className="h-4 w-4" /> View Live
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-red-500">
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
