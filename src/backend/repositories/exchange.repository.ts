import { db } from "../lib/db";
import { Prisma, ExchangeStatus } from "@prisma/client";

export class ExchangeRepository {
  static async findById(id: string) {
    return db.exchangeRequest.findUnique({
      where: { id },
      include: {
        sender: {
          select: { id: true, name: true, email: true, college: true },
        },
        receiver: {
          select: { id: true, name: true, email: true, college: true },
        },
        offeredProduct: true,
        requestedProduct: true,
      },
    });
  }

  static async findIncomingRequests(userId: string) {
    return db.exchangeRequest.findMany({
      where: { receiverId: userId },
      include: {
        sender: {
          select: { id: true, name: true, email: true, college: true },
        },
        offeredProduct: true,
        requestedProduct: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async findOutgoingRequests(userId: string) {
    return db.exchangeRequest.findMany({
      where: { senderId: userId },
      include: {
        receiver: {
          select: { id: true, name: true, email: true, college: true },
        },
        offeredProduct: true,
        requestedProduct: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async create(data: Prisma.ExchangeRequestUncheckedCreateInput) {
    return db.exchangeRequest.create({
      data,
    });
  }

  static async updateStatus(id: string, status: ExchangeStatus) {
    return db.exchangeRequest.update({
      where: { id },
      data: { status },
    });
  }
}
