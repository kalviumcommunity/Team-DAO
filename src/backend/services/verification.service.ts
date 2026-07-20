import { VerificationRepository } from "../repositories/verification.repository";
import { ListingRepository } from "../repositories/listing.repository";
import { VerificationStatus, ListingStatus } from "@prisma/client";

export class VerificationService {
  static async requestVerification(userId: string, productId: string) {
    const listing = await ListingRepository.findById(productId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.sellerId !== userId) {
      throw new Error("You do not own this listing");
    }

    return ListingRepository.update(productId, {
      status: ListingStatus.PENDING_VERIFICATION,
    });
  }

  static async getPendingListings() {
    return ListingRepository.findAll({
      status: ListingStatus.PENDING_VERIFICATION,
    });
  }

  static async verifyListing(
    verifierId: string,
    productId: string,
    status: VerificationStatus,
    remarks?: string
  ) {
    const listing = await ListingRepository.findById(productId);
    if (!listing) {
      throw new Error("Listing not found");
    }

    if (listing.status !== ListingStatus.PENDING_VERIFICATION) {
      throw new Error("Listing is not pending verification");
    }

    // Create the verification record
    const verification = await VerificationRepository.create({
      productId,
      verifierId,
      status,
      remarks,
    });

    // Update the listing status and verified flag
    if (status === VerificationStatus.APPROVED) {
      await ListingRepository.update(productId, {
        status: ListingStatus.ACTIVE,
        verified: true,
      });
    } else {
      await ListingRepository.update(productId, {
        status: ListingStatus.DEACTIVATED,
        verified: false,
      });
    }

    return verification;
  }

  static async getVerificationHistory(productId: string) {
    return VerificationRepository.findByProduct(productId);
  }
}
