import { NextResponse } from "next/server";
import { CartService } from "@/backend/services/cart.service";
import { getCurrentUser } from "@/backend/utils/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await CartService.getUserCart(user.id);
    return NextResponse.json({ cart: items }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to fetch cart" },
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
    const { listingId, quantity } = body;

    if (!listingId) {
      return NextResponse.json({ error: "listingId is required" }, { status: 400 });
    }

    const item = await CartService.addToCart(
      user.id,
      listingId,
      quantity ? parseInt(quantity) : 1
    );

    return NextResponse.json({ item }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to add to cart" },
      { status: 400 }
    );
  }
}
