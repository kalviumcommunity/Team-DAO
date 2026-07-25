import { CartRepository } from "../repositories/cart.repository";
import { ListingRepository } from "../repositories/listing.repository";
import { WishlistRepository } from "../repositories/wishlist.repository";

export class CartService {
  static async getUserCart(userId: string) {
    return CartRepository.findByUser(userId);
  }

  static async addToCart(userId: string, listingId: string, quantity: number = 1) {
    const listing = await ListingRepository.findById(listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.status !== "ACTIVE") {
      throw new Error("This listing is not active");
    }

    if (listing.stock <= 0) {
      throw new Error("This listing is out of stock");
    }

    // Get current item in cart to calculate total requested quantity
    const existingCartItem = await CartRepository.findByUserAndListing(userId, listingId);
    const totalQuantity = (existingCartItem?.quantity ?? 0) + quantity;

    if (listing.stock < totalQuantity) {
      throw new Error(`Cannot add to cart. Only ${listing.stock} items available in stock.`);
    }

    // Perform upsert or create/update
    const cartItem = await CartRepository.addOrUpdate(userId, listingId, quantity);

    // Optimistically remove from wishlist
    try {
      await WishlistRepository.deleteByUserAndListing(userId, listingId);
    } catch {
      // Ignore if not in wishlist
    }

    return cartItem;
  }

  static async updateQuantity(userId: string, listingId: string, quantity: number) {
    if (quantity <= 0) {
      return CartRepository.deleteByUserAndListing(userId, listingId);
    }

    const listing = await ListingRepository.findById(listingId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.stock < quantity) {
      throw new Error(`Only ${listing.stock} items available in stock`);
    }

    const existing = await CartRepository.findByUserAndListing(userId, listingId);
    if (!existing) {
      throw new Error("Cart item not found");
    }

    return CartRepository.updateQuantity(existing.id, quantity);
  }

  static async removeFromCart(userId: string, listingId: string) {
    return CartRepository.deleteByUserAndListing(userId, listingId);
  }
}
