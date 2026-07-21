import { NextResponse } from "next/server";
import { ListingService } from "@/backend/services/listing.service";
import { getCurrentUser } from "@/backend/utils/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = await ListingService.getListingById(id);
    return NextResponse.json({ listing }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Listing not found" },
      { status: 404 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await ListingService.updateListing(user.id, user.role, id, body);
    return NextResponse.json({ listing: updated }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to update listing" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await ListingService.deleteListing(user.id, user.role, id);
    return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to delete listing" },
      { status: 400 }
    );
  }
}
