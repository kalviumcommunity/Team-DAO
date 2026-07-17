import { NextResponse } from "next/server";
import { WishlistService } from "@/backend/services/wishlist.service";
import { getCurrentUser } from "@/backend/utils/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await WishlistService.getUserWishlist(user.id);
    return NextResponse.json({ wishlist: items }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch wishlist" },
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
    const { listingId } = body;

    if (!listingId) {
      return NextResponse.json({ error: "listingId is required" }, { status: 400 });
    }

    const item = await WishlistService.addToWishlist(user.id, listingId);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to add to wishlist" },
      { status: 400 }
    );
  }
}
