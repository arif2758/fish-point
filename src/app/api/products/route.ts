import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ProductCollectionModel from "@/models/ProductCollection";

// Type definitions
interface FilterQuery {
  published: boolean;
  fishType?: { $in: string[] };
  fishSizeKg?: { $in: string[] };
  cuttingSize?: { $in: string[] };
  salePricePerKg?: { $gte?: number; $lte?: number };
  availableSources?: { $in: string[] };
  isOutOfStock?: boolean;
  stockKg?: { $gt: number };
  $text?: { $search: string };
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    // Build filter query
    const filter: FilterQuery = { published: true };

    // Fish Type Filter
    const fishType = searchParams.get("fishType");
    if (fishType) {
      filter.fishType = { $in: fishType.split(",") };
    }

    // Size Filter
    const fishSizeKg = searchParams.get("fishSizeKg");
    if (fishSizeKg) {
      filter.fishSizeKg = { $in: fishSizeKg.split(",") };
    }

    // Cutting Size Filter
    const cuttingSize = searchParams.get("cuttingSize");
    if (cuttingSize) {
      filter.cuttingSize = { $in: cuttingSize.split(",") };
    }

    // Price Range Filter
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    if (minPrice || maxPrice) {
      filter.salePricePerKg = {};
      if (minPrice) filter.salePricePerKg.$gte = Number(minPrice);
      if (maxPrice) filter.salePricePerKg.$lte = Number(maxPrice);
    }

    // Source Filter
    const source = searchParams.get("source");
    if (source) {
      filter.availableSources = { $in: source.split(",") };
    }

    // Stock Status Filter
    const inStock = searchParams.get("inStock");
    if (inStock === "true") {
      filter.isOutOfStock = false;
      filter.stockKg = { $gt: 0 };
    }

    // Search Query
    const search = searchParams.get("search");
    if (search) {
      filter.$text = { $search: search };
    }

    // Sorting - ✅ Fixed Type
    const sortBy = searchParams.get("sortBy") || "featured";
    const sort: Record<string, 1 | -1> = {};

    switch (sortBy) {
      case "price-asc":
        sort.salePricePerKg = 1;
        break;
      case "price-desc":
        sort.salePricePerKg = -1;
        break;
      case "popular":
        sort.unitsSold = -1;
        break;
      case "rating":
        sort.averageRating = -1;
        break;
      case "newest":
        sort.createdAt = -1;
        break;
      default:
        sort.isFeatured = -1;
        sort.unitsSold = -1;
    }

    // Pagination
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const skip = (page - 1) * limit;

    // Execute Query
    const [products, total] = await Promise.all([
      ProductCollectionModel.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-__v")
        .lean(),
      ProductCollectionModel.countDocuments(filter),
    ]);

    // Get filter options (for sidebar)
    const [fishTypes, fishSizes, cuttingSizes, sources] = await Promise.all([
      ProductCollectionModel.distinct("fishType", { published: true }),
      ProductCollectionModel.distinct("fishSizeKg", { published: true }),
      ProductCollectionModel.distinct("cuttingSize", { published: true }),
      ProductCollectionModel.aggregate([
        { $match: { published: true } },
        { $unwind: "$availableSources" },
        { $group: { _id: "$availableSources" } },
      ]),
    ]);

    // Get price range
    const priceRange = await ProductCollectionModel.aggregate([
      { $match: { published: true } },
      {
        $group: {
          _id: null,
          min: { $min: "$salePricePerKg" },
          max: { $max: "$salePricePerKg" },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        filters: {
          fishTypes: fishTypes.sort(),
          fishSizes: fishSizes.sort(),
          cuttingSizes: cuttingSizes.sort(),
          sources: sources.map((s: { _id: string }) => s._id).sort(),
          priceRange: priceRange[0] || { min: 0, max: 2000 },
        },
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}