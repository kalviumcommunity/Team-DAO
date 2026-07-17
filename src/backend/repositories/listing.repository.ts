import { db } from "../lib/db";
import { Prisma, Condition, ListingStatus, ListingType } from "@prisma/client";

export class ListingRepository {
  static async findById(id: string) {
    return db.listing.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
            role: true,
          },
        },
      },
    });
  }

  static async findAll(filters: {
    category?: string;
    condition?: Condition;
    status?: ListingStatus;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    listingType?: ListingType;
  }) {
    const where: Prisma.ListingWhereInput = {};

    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.category) {
      where.category = {
        equals: filters.category,
        mode: "insensitive",
      };
    }
    if (filters.condition) {
      where.condition = filters.condition;
    }
    if (filters.listingType) {
      where.listingType = filters.listingType;
    }
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    return db.listing.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
            college: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async create(data: Prisma.ListingUncheckedCreateInput) {
    return db.listing.create({
      data,
    });
  }

  static async update(id: string, data: Prisma.ListingUncheckedUpdateInput) {
    return db.listing.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return db.listing.delete({
      where: { id },
    });
  }
}
