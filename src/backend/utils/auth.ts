import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET || "fallback-secret-key-change-me";
  if (process.env.NODE_ENV === "production" && secret === "fallback-secret-key-change-me") {
    throw new Error("CRITICAL SECURITY ERROR: JWT_SECRET environment variable is not defined in production.");
  }
  return secret;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  college: string;
  role: "STUDENT" | "VERIFIER" | "ADMIN";
}

export async function getCurrentUser(req: Request | NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = req.headers.get("authorization");
    let token = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      // Try to fallback to reading from cookie if any
      const cookieHeader = req.headers.get("cookie");
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split(";").map((c) => {
            const parts = c.trim().split("=");
            return [parts[0], parts.slice(1).join("=")];
          })
        );
        token = cookies["token"] || "";
      }
    }

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, getJwtSecret()) as {
      userId: string;
      email: string;
      role: string;
    };

    const user = await UserRepository.findById(decoded.userId);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      college: user.college,
      role: user.role as "STUDENT" | "VERIFIER" | "ADMIN",
    };
  } catch {
    return null;
  }
}
