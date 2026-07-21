import { NextResponse } from "next/server";
import { CartService } from "@/backend/services/cart.service";
import { getCurrentUser } from "@/backend/utils/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // id represents listingId
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { quantity } = body;

    if (quantity === undefined) {
      return NextResponse.json({ error: "quantity is required" }, { status: 400 });
    }

    const item = await CartService.updateQuantity(user.id, id, parseInt(quantity));
    return NextResponse.json({ item }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to update cart item quantity" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // id represents listingId
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await CartService.removeFromCart(user.id, id);
    return NextResponse.json({ message: "Item removed from cart" }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to remove item from cart" },
      { status: 400 }
    );
  }
}
