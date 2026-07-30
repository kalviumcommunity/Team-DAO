import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, AuthenticatedUser } from "../utils/auth";
import { UserRole } from "@prisma/client";

export interface RBACResult {
  user: AuthenticatedUser | null;
  response: NextResponse | null;
}

export async function requireRole(
  req: Request | NextRequest,
  allowedRoles: UserRole[]
): Promise<RBACResult> {
  const user = await getCurrentUser(req);

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized: Authentication required" }, { status: 401 }),
    };
  }

  if (user.isSuspended) {
    return {
      user: null,
      response: NextResponse.json({ error: "Forbidden: Account is suspended" }, { status: 403 }),
    };
  }

  if (!allowedRoles.includes(user.role)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Forbidden: You do not have permission to access this resource" },
        { status: 403 }
      ),
    };
  }

  return { user, response: null };
}

export async function requireAdmin(req: Request | NextRequest): Promise<RBACResult> {
  return requireRole(req, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
}

export async function requireSuperAdmin(req: Request | NextRequest): Promise<RBACResult> {
  return requireRole(req, [UserRole.SUPER_ADMIN]);
}
