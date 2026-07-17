import { db } from "../lib/db";
import { VerificationStatus, Prisma } from "@prisma/client";

export class VerificationRepository {
  static async findById(id: string) {
    return db.verification.findUnique({
      where: { id },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, name: true, college: true },
            },
          },
        },
        verifier: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  static async findByProduct(productId: string) {
    return db.verification.findMany({
      where: { productId },
      include: {
        verifier: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async findAllPending() {
    return db.verification.findMany({
      where: { status: VerificationStatus.PENDING },
      include: {
        product: {
          include: {
            seller: {
              select: { id: true, name: true, college: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  static async create(data: Prisma.VerificationUncheckedCreateInput) {
    return db.verification.create({
      data,
    });
  }

  static async update(id: string, status: VerificationStatus, remarks?: string) {
    return db.verification.update({
      where: { id },
      data: {
        status,
        remarks,
      },
    });
  }
}
