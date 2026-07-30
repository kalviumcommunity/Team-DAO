import { db } from "../lib/db";
import { UserRole, ListingStatus, OrderStatus, Prisma } from "@prisma/client";

export class AdminRepository {
  static async getDashboardStats() {
    const [totalUsers, totalListings, totalOrders, revenueAggregate, lowStockListings, recentOrders] =
      await Promise.all([
        db.user.count(),
        db.listing.count({ where: { status: { not: ListingStatus.DEACTIVATED } } }),
        db.order.count(),
        db.order.aggregate({
          _sum: { totalAmount: true },
          where: { status: { notIn: [OrderStatus.CANCELLED, OrderStatus.REFUNDED] } },
        }),
        db.listing.findMany({
          where: {
            stock: { lte: 5 },
            status: ListingStatus.ACTIVE,
          },
          take: 10,
          select: {
            id: true,
            title: true,
            stock: true,
            price: true,
            category: true,
          },
        }),
        db.order.findMany({
          take: 6,
          orderBy: { createdAt: "desc" },
          include: {
            user: { select: { name: true, email: true } },
            items: { include: { listing: { select: { title: true } } } },
          },
        }),
      ]);

    return {
      totalUsers,
      totalProducts: totalListings,
      totalOrders,
      totalRevenue: revenueAggregate._sum.totalAmount || 0,
      lowStockAlerts: lowStockListings,
      recentOrders,
    };
  }

  static async findAllUsers(query?: { search?: string; role?: string; page?: number; limit?: number }) {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (query?.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { email: { contains: query.search, mode: "insensitive" } },
        { college: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query?.role && query.role !== "ALL") {
      where.role = query.role as UserRole;
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          college: true,
          role: true,
          isSuspended: true,
          createdAt: true,
          _count: { select: { listings: true, orders: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return { users, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async findUserById(id: string) {
    return db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        role: true,
        isSuspended: true,
        createdAt: true,
        updatedAt: true,
        listings: { select: { id: true, title: true, price: true, status: true, createdAt: true } },
        orders: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
            items: { include: { listing: { select: { title: true } } } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  static async updateUserRole(userId: string, role: UserRole) {
    return db.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  static async toggleUserSuspension(userId: string, isSuspended: boolean) {
    return db.user.update({
      where: { id: userId },
      data: { isSuspended },
      select: { id: true, name: true, email: true, isSuspended: true },
    });
  }

  static async findAllProducts(query?: { search?: string; category?: string; status?: string; page?: number; limit?: number }) {
    const page = query?.page || 1;
    const limit = query?.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ListingWhereInput = {};
    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
        { category: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query?.category && query.category !== "ALL") {
      where.category = query.category;
    }
    if (query?.status && query.status !== "ALL") {
      where.status = query.status as ListingStatus;
    }

    const [products, total] = await Promise.all([
      db.listing.findMany({
        where,
        include: {
          seller: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.listing.count({ where }),
    ]);

    return { products, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async createProduct(data: Prisma.ListingCreateInput) {
    return db.listing.create({ data });
  }

  static async updateProduct(id: string, data: Prisma.ListingUpdateInput) {
    return db.listing.update({
      where: { id },
      data,
    });
  }

  static async softDeleteProduct(id: string) {
    return db.listing.update({
      where: { id },
      data: { status: ListingStatus.DEACTIVATED },
    });
  }

  static async findAllInventoryLogs() {
    return db.inventoryLog.findMany({
      include: {
        listing: { select: { id: true, title: true } },
        updatedBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { timestamp: "desc" },
      take: 100,
    });
  }

  static async createInventoryLog(data: { listingId: string; previousStock: number; newStock: number; updatedById: string }) {
    return db.inventoryLog.create({
      data: {
        listingId: data.listingId,
        previousStock: data.previousStock,
        newStock: data.newStock,
        updatedById: data.updatedById,
      },
    });
  }

  static async findAllOrders(query?: { search?: string; status?: string }) {
    const where: Prisma.OrderWhereInput = {};
    if (query?.status && query.status !== "ALL") {
      where.status = query.status as OrderStatus;
    }
    if (query?.search) {
      where.OR = [
        { id: { contains: query.search, mode: "insensitive" } },
        { user: { name: { contains: query.search, mode: "insensitive" } } },
        { user: { email: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    return db.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: { include: { listing: { select: { id: true, title: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateOrderStatus(id: string, status: OrderStatus) {
    return db.order.update({
      where: { id },
      data: { status },
      include: { user: { select: { name: true, email: true } } },
    });
  }

  static async findAllAuditLogs() {
    return db.auditLog.findMany({
      include: {
        admin: { select: { id: true, name: true, email: true, role: true } },
      },
      orderBy: { timestamp: "desc" },
      take: 100,
    });
  }

  static async createAuditLog(data: { adminId: string; action: string; targetType: string; targetId?: string; details?: string }) {
    return db.auditLog.create({ data });
  }
}
