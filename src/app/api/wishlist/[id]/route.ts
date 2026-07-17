import { NextResponse } from "next/server";
import { WishlistService } from "@/backend/services/wishlist.service";
import { getCurrentUser } from "@/backend/utils/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Here, id represents the listingId to remove from wishlist
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await WishlistService.removeFromWishlist(user.id, id);
    return NextResponse.json({ message: "Item removed from wishlist" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to remove item from wishlist" },
      { status: 400 }
    );
  }
}
