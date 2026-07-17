import { db } from "../lib/db";

export class CartRepository {
  static async findByUser(userId: string) {
    return db.cartItem.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                college: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async findByUserAndListing(userId: string, listingId: string) {
    return db.cartItem.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });
  }

  static async addOrUpdate(userId: string, listingId: string, quantity: number) {
    return db.cartItem.upsert({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        userId,
        listingId,
        quantity,
      },
    });
  }

  static async updateQuantity(id: string, quantity: number) {
    return db.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  static async delete(id: string) {
    return db.cartItem.delete({
      where: { id },
    });
  }

  static async deleteByUserAndListing(userId: string, listingId: string) {
    return db.cartItem.deleteMany({
      where: {
        userId,
        listingId,
      },
    });
  }

  static async clearCart(userId: string) {
    return db.cartItem.deleteMany({
      where: { userId },
    });
  }
}
