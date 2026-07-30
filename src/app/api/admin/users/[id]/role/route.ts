import { NextResponse } from "next/server";
import { requireSuperAdmin } from "@/backend/middleware/rbac";
import { AdminService } from "@/backend/services/admin.service";
import { UserRole } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user: currentAdmin, response } = await requireSuperAdmin(req);
  if (response) return response;
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { role } = body;

    if (!role || !Object.values(UserRole).includes(role)) {
      return NextResponse.json({ error: "Invalid role specified" }, { status: 400 });
    }

    const updatedUser = await AdminService.updateUserRole(currentAdmin.id, id, role as UserRole);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update role";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
