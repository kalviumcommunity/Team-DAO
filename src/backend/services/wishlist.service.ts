import { WishlistRepository } from "../repositories/wishlist.repository";
import { ListingRepository } from "../repositories/listing.repository";

export class WishlistService {
  static async getUserWishlist(userId: string) {
    return WishlistRepository.findByUser(userId);
  }

  static async addToWishlist(userId: string, listingId: string) {
    const listing = await ListingRepository.findById(listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    // Check if user already wishlisted this listing
    const existing = await WishlistRepository.findByUserAndListing(userId, listingId);
    if (existing) {
      return existing; // Already in wishlist, return it
    }

    return WishlistRepository.add(userId, listingId);
  }

  static async removeFromWishlist(userId: string, listingId: string) {
    return WishlistRepository.deleteByUserAndListing(userId, listingId);
  }
}
