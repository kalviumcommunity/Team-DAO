import { ListingRepository } from "../repositories/listing.repository";
import { Condition, ListingStatus, ListingType } from "@prisma/client";

export class ListingService {
  static async createListing(
    userId: string,
    data: {
      title: string;
      description: string;
      price: number;
      condition: Condition;
      durationUsed?: string;
      category: string;
      stock?: number;
      listingType?: ListingType;
      exchangeAvailable?: boolean;
    }
  ) {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error("Title is required");
    }
    if (data.price < 0) {
      throw new Error("Price cannot be negative");
    }
    if (data.stock !== undefined && data.stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    return ListingRepository.create({
      title: data.title,
      description: data.description,
      price: data.price,
      condition: data.condition,
      durationUsed: data.durationUsed || null,
      category: data.category,
      stock: data.stock ?? 1,
      listingType: data.listingType ?? ListingType.SALE,
      exchangeAvailable: data.exchangeAvailable ?? false,
      sellerId: userId,
      status: ListingStatus.ACTIVE,
      verified: false,
    });
  }

  static async getListings(filters: {
    category?: string;
    condition?: Condition;
    status?: ListingStatus;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    listingType?: ListingType;
  }) {
    return ListingRepository.findAll(filters);
  }

  static async getListingById(id: string) {
    const listing = await ListingRepository.findById(id);
    if (!listing) {
      throw new Error("Listing not found");
    }
    return listing;
  }

  static async updateListing(
    userId: string,
    userRole: string,
    id: string,
    data: {
      title?: string;
      description?: string;
      price?: number;
      condition?: Condition;
      durationUsed?: string;
      category?: string;
      stock?: number;
      status?: ListingStatus;
      listingType?: ListingType;
      exchangeAvailable?: boolean;
    }
  ) {
    const listing = await ListingRepository.findById(id);
    if (!listing) {
      throw new Error("Listing not found");
    }

    // Check authorization: only owner or ADMIN/VERIFIER can edit
    if (listing.sellerId !== userId && userRole !== "ADMIN" && userRole !== "VERIFIER") {
      throw new Error("Not authorized to update this listing");
    }

    if (data.price !== undefined && data.price < 0) {
      throw new Error("Price cannot be negative");
    }
    if (data.stock !== undefined && data.stock < 0) {
      throw new Error("Stock cannot be negative");
    }

    return ListingRepository.update(id, data);
  }

  static async deleteListing(userId: string, userRole: string, id: string) {
    const listing = await ListingRepository.findById(id);
    if (!listing) {
      throw new Error("Listing not found");
    }

    // Check authorization: only owner or ADMIN can delete
    if (listing.sellerId !== userId && userRole !== "ADMIN") {
      throw new Error("Not authorized to delete this listing");
    }

    return ListingRepository.delete(id);
  }
}
