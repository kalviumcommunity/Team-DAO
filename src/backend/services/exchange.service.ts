import { ExchangeRepository } from "../repositories/exchange.repository";
import { ListingRepository } from "../repositories/listing.repository";
import { ExchangeStatus, ListingStatus } from "@prisma/client";

export class ExchangeService {
  static async createRequest(
    senderId: string,
    receiverId: string,
    offeredProductId: string,
    requestedProductId: string
  ) {
    const offeredProduct = await ListingRepository.findById(offeredProductId);
    const requestedProduct = await ListingRepository.findById(requestedProductId);

    if (!offeredProduct || !requestedProduct) {
      throw new Error("One or both products not found");
    }

    if (offeredProduct.status !== ListingStatus.ACTIVE || requestedProduct.status !== ListingStatus.ACTIVE) {
      throw new Error("Both products must be active for exchange");
    }

    if (offeredProduct.sellerId !== senderId) {
      throw new Error("You do not own the offered product");
    }

    if (requestedProduct.sellerId !== receiverId) {
      throw new Error("The receiver does not own the requested product");
    }

    if (senderId === receiverId) {
      throw new Error("You cannot exchange products with yourself");
    }

    return ExchangeRepository.create({
      senderId,
      receiverId,
      offeredProductId,
      requestedProductId,
      status: ExchangeStatus.PENDING,
    });
  }

  static async getIncomingRequests(userId: string) {
    return ExchangeRepository.findIncomingRequests(userId);
  }

  static async getOutgoingRequests(userId: string) {
    return ExchangeRepository.findOutgoingRequests(userId);
  }

  static async respondToRequest(userId: string, requestId: string, status: ExchangeStatus) {
    const request = await ExchangeRepository.findById(requestId);
    if (!request) {
      throw new Error("Exchange request not found");
    }

    if (request.receiverId !== userId) {
      throw new Error("Not authorized to respond to this request");
    }

    if (request.status !== ExchangeStatus.PENDING) {
      throw new Error(`Request has already been processed (current status: ${request.status})`);
    }

    if (status === ExchangeStatus.APPROVED) {
      // Approve request
      const updatedRequest = await ExchangeRepository.updateStatus(requestId, ExchangeStatus.APPROVED);

      // Mark both products as EXCHANGED/SOLD
      await ListingRepository.update(request.offeredProductId, { status: ListingStatus.EXCHANGED });
      await ListingRepository.update(request.requestedProductId, { status: ListingStatus.EXCHANGED });

      return updatedRequest;
    } else {
      // Reject or cancel request
      return ExchangeRepository.updateStatus(requestId, status);
    }
  }
}
