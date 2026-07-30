import { NextResponse } from "next/server";
import { AuthService } from "@/backend/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await AuthService.login({ email, password });
    const response = NextResponse.json(result, { status: 200 });

    // Set cookie for browser session handling
    response.cookies.set("token", result.token, {
      httpOnly: false,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : String(error)) || "Invalid credentials" },
      { status: 401 }
    );
  }
}
