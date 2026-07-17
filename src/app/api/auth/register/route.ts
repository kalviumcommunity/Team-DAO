import { NextResponse } from "next/server";
import { AuthService } from "@/backend/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, college, role } = body;

    if (!name || !email || !password || !college) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, password, college" },
        { status: 400 }
      );
    }

    const result = await AuthService.register({ name, email, password, college, role });
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An error occurred during registration" },
      { status: 400 }
    );
  }
}
