import { NextResponse } from "next/server";
import { requireAdmin } from "@/backend/middleware/rbac";
import { AdminService } from "@/backend/services/admin.service";

export async function GET(req: Request) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const role = searchParams.get("role") || undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;

    const data = await AdminService.getUsers({ search, role, page, limit });
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Fetch users error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
