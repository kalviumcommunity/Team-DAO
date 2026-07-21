import { NextResponse } from "next/server";
import { ExchangeService } from "@/backend/services/exchange.service";
import { getCurrentUser } from "@/backend/utils/auth";
import { ExchangeStatus } from "@prisma/client";

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
    const { status } = body;

    if (!status || !Object.values(ExchangeStatus).includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${Object.values(ExchangeStatus).join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await ExchangeService.respondToRequest(user.id, id, status);
    return NextResponse.json({ request: updated }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to respond to exchange request" },
      { status: 400 }
    );
  }
}
