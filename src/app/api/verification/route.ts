import { NextResponse } from "next/server";
import { VerificationService } from "@/backend/services/verification.service";
import { getCurrentUser } from "@/backend/utils/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "VERIFIER" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only verifiers or admins can view pending verifications" },
        { status: 403 }
      );
    }

    const listings = await VerificationService.getPendingListings();
    return NextResponse.json({ listings }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to fetch pending verifications" },
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
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const listing = await VerificationService.requestVerification(user.id, productId);
    return NextResponse.json({ listing }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to submit verification request" },
      { status: 400 }
    );
  }
}
