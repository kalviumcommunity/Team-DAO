import { db } from "../lib/db";
import { Prisma } from "@prisma/client";

export class UserRepository {
  static async findByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
    });
  }

  static async findById(id: string) {
    return db.user.findUnique({
      where: { id },
    });
  }

  static async create(data: Prisma.UserCreateInput) {
    return db.user.create({
      data,
    });
  }

  static async update(id: string, data: Prisma.UserUpdateInput) {
    return db.user.update({
      where: { id },
      data,
    });
  }
}
