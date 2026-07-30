import { NextResponse } from "next/server";
import { requireAdmin } from "@/backend/middleware/rbac";
import { AdminService } from "@/backend/services/admin.service";
import { OrderStatus } from "@prisma/client";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user: currentAdmin, response } = await requireAdmin(req);
  if (response) return response;
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: "Valid OrderStatus is required" }, { status: 400 });
    }

    const updatedOrder = await AdminService.updateOrderStatus(currentAdmin.id, id, status as OrderStatus);
    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
