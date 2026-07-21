import { NextResponse } from "next/server";
import { VerificationService } from "@/backend/services/verification.service";
import { getCurrentUser } from "@/backend/utils/auth";
import { VerificationStatus } from "@prisma/client";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // id represents the productId to verify
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "VERIFIER" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Only verifiers or admins can verify listings" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { status, remarks } = body;

    if (!status || !Object.values(VerificationStatus).includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${Object.values(VerificationStatus).join(", ")}` },
        { status: 400 }
      );
    }

    const verification = await VerificationService.verifyListing(
      user.id,
      id,
      status,
      remarks
    );

    return NextResponse.json({ verification }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to process verification" },
      { status: 400 }
    );
  }
}
