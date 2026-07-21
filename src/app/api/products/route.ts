import { NextResponse } from "next/server";
import { ListingService } from "@/backend/services/listing.service";
import { getCurrentUser } from "@/backend/utils/auth";
import { Condition, ListingStatus, ListingType } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const condition = (searchParams.get("condition") as Condition) || undefined;
    const status = (searchParams.get("status") as ListingStatus) || ListingStatus.ACTIVE; // default to ACTIVE listings
    const search = searchParams.get("search") || undefined;
    const minPriceStr = searchParams.get("minPrice");
    const maxPriceStr = searchParams.get("maxPrice");
    const minPrice = minPriceStr ? parseFloat(minPriceStr) : undefined;
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;
    const listingType = (searchParams.get("listingType") as ListingType) || undefined;

    const listings = await ListingService.getListings({
      category,
      condition,
      status,
      search,
      minPrice,
      maxPrice,
      listingType,
    });

    return NextResponse.json({ listings }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      price,
      condition,
      durationUsed,
      category,
      stock,
      listingType,
      exchangeAvailable,
    } = body;

    if (!title || price === undefined || !condition || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, price, condition, category" },
        { status: 400 }
      );
    }

    const listing = await ListingService.createListing(user.id, {
      title,
      description,
      price: parseFloat(price),
      condition,
      durationUsed,
      category,
      stock: stock ? parseInt(stock) : undefined,
      listingType,
      exchangeAvailable,
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to create listing" },
      { status: 400 }
    );
  }
}
