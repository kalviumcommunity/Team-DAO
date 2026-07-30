import { NextResponse } from "next/server";
import { requireAdmin } from "@/backend/middleware/rbac";
import { AdminService } from "@/backend/services/admin.service";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user: currentAdmin, response } = await requireAdmin(req);
  if (response) return response;
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const updatedProduct = await AdminService.updateProduct(currentAdmin.id, id, body);
    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user: currentAdmin, response } = await requireAdmin(req);
  if (response) return response;
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deletedProduct = await AdminService.softDeleteProduct(currentAdmin.id, id);
    return NextResponse.json({ success: true, product: deletedProduct });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
