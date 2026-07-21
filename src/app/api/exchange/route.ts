import { NextResponse } from "next/server";
import { ExchangeService } from "@/backend/services/exchange.service";
import { getCurrentUser } from "@/backend/utils/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const incoming = await ExchangeService.getIncomingRequests(user.id);
    const outgoing = await ExchangeService.getOutgoingRequests(user.id);

    return NextResponse.json({ incoming, outgoing }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to fetch exchange requests" },
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
    const { receiverId, offeredProductId, requestedProductId } = body;

    if (!receiverId || !offeredProductId || !requestedProductId) {
      return NextResponse.json(
        { error: "Missing required fields: receiverId, offeredProductId, requestedProductId" },
        { status: 400 }
      );
    }

    const request = await ExchangeService.createRequest(
      user.id,
      receiverId,
      offeredProductId,
      requestedProductId
    );

    return NextResponse.json({ request }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : "Unknown error") || "Failed to create exchange request" },
      { status: 400 }
    );
  }
}
