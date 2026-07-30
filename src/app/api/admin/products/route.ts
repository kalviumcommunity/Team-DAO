import { NextResponse } from "next/server";
import { requireAdmin } from "@/backend/middleware/rbac";
import { AdminService } from "@/backend/services/admin.service";

export async function GET(req: Request) {
  const { response } = await requireAdmin(req);
  if (response) return response;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;

    const data = await AdminService.getProducts({ search, category, status, page, limit });
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    console.error("Fetch admin products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { user: currentAdmin, response } = await requireAdmin(req);
  if (response) return response;
  if (!currentAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, price, category, condition, stock, brand, images, sellerId } = body;

    if (!title || !description || typeof price !== "number" || !category || typeof stock !== "number") {
      return NextResponse.json({ error: "Title, description, price, category, and stock are required" }, { status: 400 });
    }

    const product = await AdminService.createProduct(currentAdmin.id, {
      title,
      description,
      price,
      category,
      condition,
      stock,
      brand,
      images,
      sellerId,
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
