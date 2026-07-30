import { NextResponse } from "next/server";
import { requireAdmin } from "@/backend/middleware/rbac";
import { AdminService } from "@/backend/services/admin.service";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  try {
    const { id } = await params;
    const user = await AdminService.getUserDetails(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Fetch user details error:", error);
    return NextResponse.json({ error: "Failed to fetch user details" }, { status: 500 });
  }
}
