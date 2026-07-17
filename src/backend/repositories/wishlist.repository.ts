import { db } from "../lib/db";

export class WishlistRepository {
  static async findByUser(userId: string) {
    return db.wishlistItem.findMany({
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
    return db.wishlistItem.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId,
        },
      },
    });
  }

  static async add(userId: string, listingId: string) {
    return db.wishlistItem.create({
      data: {
        userId,
        listingId,
      },
    });
  }

  static async delete(id: string) {
    return db.wishlistItem.delete({
      where: { id },
    });
  }

  static async deleteByUserAndListing(userId: string, listingId: string) {
    return db.wishlistItem.deleteMany({
      where: {
        userId,
        listingId,
      },
    });
  }
}
