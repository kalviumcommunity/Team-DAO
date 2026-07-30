import { NextResponse } from "next/server";
import { requireAdmin } from "@/backend/middleware/rbac";
import { AdminService } from "@/backend/services/admin.service";

export async function GET(req: Request) {
  const { user, response } = await requireAdmin(req);
  if (response) return response;

  try {
    const stats = await AdminService.getDashboardOverview();
    return NextResponse.json({ success: true, stats, currentUser: user });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return NextResponse.json({ error: "Failed to load dashboard overview" }, { status: 500 });
  }
}
