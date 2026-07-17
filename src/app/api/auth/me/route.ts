import { NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/utils/auth";

export async function GET(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({ user }, { status: 200 });
}
