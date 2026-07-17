import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { JWT_SECRET } from "../utils/auth";

export class AuthService {
  static async register(data: {
    name: string;
    email: string;
    password: string;
    college: string;
    role?: "STUDENT" | "VERIFIER" | "ADMIN";
  }) {
    // Check if email already exists
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) {
      throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await UserRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      college: data.college,
      role: data.role || "STUDENT",
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        role: user.role,
      },
      token,
    };
  }

  static async login(data: { email: string; password: string }) {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await bcrypt.compare(data.password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        role: user.role,
      },
      token,
    };
  }
}
