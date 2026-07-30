import { AdminRepository } from "../repositories/admin.repository";
import { UserRole, ListingStatus, OrderStatus, Condition, ListingType } from "@prisma/client";

export class AdminService {
  static async getDashboardOverview() {
    return AdminRepository.getDashboardStats();
  }

  static async getUsers(query?: { search?: string; role?: string; page?: number; limit?: number }) {
    return AdminRepository.findAllUsers(query);
  }

  static async getUserDetails(id: string) {
    return AdminRepository.findUserById(id);
  }

  static async updateUserRole(adminId: string, targetUserId: string, newRole: UserRole) {
    if (adminId === targetUserId) {
      throw new Error("Super Admins cannot change their own role.");
    }

    const updatedUser = await AdminRepository.updateUserRole(targetUserId, newRole);

    await AdminRepository.createAuditLog({
      adminId,
      action: "UPDATE_USER_ROLE",
      targetType: "User",
      targetId: targetUserId,
      details: `Updated role of ${updatedUser.name} (${updatedUser.email}) to ${newRole}`,
    });

    return updatedUser;
  }

  static async toggleUserSuspension(adminId: string, targetUserId: string, suspend: boolean) {
    if (adminId === targetUserId) {
      throw new Error("Admins cannot suspend their own account.");
    }

    const updatedUser = await AdminRepository.toggleUserSuspension(targetUserId, suspend);

    await AdminRepository.createAuditLog({
      adminId,
      action: suspend ? "SUSPEND_USER" : "ACTIVATED_USER",
      targetType: "User",
      targetId: targetUserId,
      details: `${suspend ? "Suspended" : "Activated"} user ${updatedUser.name} (${updatedUser.email})`,
    });

    return updatedUser;
  }

  static async getProducts(query?: { search?: string; category?: string; status?: string; page?: number; limit?: number }) {
    return AdminRepository.findAllProducts(query);
  }

  static async createProduct(adminId: string, data: {
    title: string;
    description: string;
    price: number;
    category: string;
    condition: Condition;
    stock: number;
    sellerId?: string;
    listingType?: ListingType;
    brand?: string;
    images?: string[];
  }) {
    const computedStatus = data.stock <= 0 ? ListingStatus.SOLD : ListingStatus.ACTIVE;
    const product = await AdminRepository.createProduct({
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      condition: data.condition || Condition.GOOD,
      stock: data.stock,
      seller: { connect: { id: data.sellerId || adminId } },
      status: computedStatus,
      listingType: data.listingType || ListingType.SALE,
      brand: data.brand || null,
      images: data.images || [],
    });

    await AdminRepository.createInventoryLog({
      listingId: product.id,
      previousStock: 0,
      newStock: product.stock,
      updatedById: adminId,
    });

    await AdminRepository.createAuditLog({
      adminId,
      action: "CREATE_PRODUCT",
      targetType: "Listing",
      targetId: product.id,
      details: `Created product "${product.title}" with stock ${product.stock}`,
    });

    return product;
  }

  static async updateProduct(adminId: string, productId: string, data: {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    condition?: Condition;
    stock?: number;
    status?: ListingStatus;
    brand?: string;
    images?: string[];
  }) {
    // If stock is changing, handle automatic status transition and inventory log
    if (typeof data.stock === "number") {
      if (data.stock <= 0) {
        data.status = ListingStatus.SOLD;
      } else if (data.stock > 0 && data.status !== ListingStatus.DEACTIVATED) {
        data.status = ListingStatus.ACTIVE;
      }

      const existing = await AdminRepository.findAllProducts({ search: productId, limit: 1 });
      const currentProduct = existing.products.find((p) => p.id === productId);
      if (currentProduct && currentProduct.stock !== data.stock) {
        await AdminRepository.createInventoryLog({
          listingId: productId,
          previousStock: currentProduct.stock,
          newStock: data.stock,
          updatedById: adminId,
        });
      }
    }

    const updated = await AdminRepository.updateProduct(productId, data);

    await AdminRepository.createAuditLog({
      adminId,
      action: "UPDATE_PRODUCT",
      targetType: "Listing",
      targetId: productId,
      details: `Updated product "${updated.title}"`,
    });

    return updated;
  }

  static async softDeleteProduct(adminId: string, productId: string) {
    const deleted = await AdminRepository.softDeleteProduct(productId);

    await AdminRepository.createAuditLog({
      adminId,
      action: "DELETE_PRODUCT",
      targetType: "Listing",
      targetId: productId,
      details: `Soft-deleted product "${deleted.title}" (status set to DEACTIVATED)`,
    });

    return deleted;
  }

  static async getInventoryLogs() {
    return AdminRepository.findAllInventoryLogs();
  }

  static async getOrders(query?: { search?: string; status?: string }) {
    return AdminRepository.findAllOrders(query);
  }

  static async updateOrderStatus(adminId: string, orderId: string, status: OrderStatus) {
    const updated = await AdminRepository.updateOrderStatus(orderId, status);

    await AdminRepository.createAuditLog({
      adminId,
      action: "UPDATE_ORDER_STATUS",
      targetType: "Order",
      targetId: orderId,
      details: `Updated status of Order #${orderId.substring(0, 8)} to ${status}`,
    });

    return updated;
  }

  static async getAuditLogs() {
    return AdminRepository.findAllAuditLogs();
  }
}
