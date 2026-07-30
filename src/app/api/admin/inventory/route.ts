import { NextResponse } from "next/server";
import { requireAdmin } from "@/backend/middleware/rbac";
import { AdminService } from "@/backend/services/admin.service";

export async function GET(req: Request) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  try {
    const logs = await AdminService.getInventoryLogs();
    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error("Fetch inventory logs error:", error);
    return NextResponse.json({ error: "Failed to fetch inventory logs" }, { status: 500 });
  }
}
