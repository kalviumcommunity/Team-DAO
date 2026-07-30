import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/backend/middleware/rbac";
import { AdminService } from "@/backend/services/admin.service";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user: currentAdmin, response } = await requireSuperAdmin(req);
  if (response) return response;
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { isSuspended } = body;

    if (typeof isSuspended !== "boolean") {
      return NextResponse.json({ error: "isSuspended boolean flag is required" }, { status: 400 });
    }

    const updatedUser = await AdminService.toggleUserSuspension(currentAdmin.id, id, isSuspended);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to toggle suspension";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
