import type { PrismaClient } from '@prisma/client';
import { getActiveUserIds, sendToUser, broadcast, type MessagePayload } from '../websocket/server';

export function startStockCheckJob(prisma: PrismaClient) {
  console.log("[Stock Check Job] Starting active-user stock check polling (every 30 seconds)...");

  // Run initial check after 5 seconds
  setTimeout(() => {
    void checkActiveUserStock(prisma);
  }, 5000);

  setInterval(() => {
    void checkActiveUserStock(prisma);
  }, 30000);
}

async function checkActiveUserStock(prisma: PrismaClient) {
  try {
    const activeUserIds = getActiveUserIds();

    console.log(`[Stock Check Job] Checking active user connections (${activeUserIds.length} active users connected)...`);

    // If no active users are connected, skip DB polling loop
    if (activeUserIds.length === 0) {
      console.log("[Stock Check Job] No active users connected via WebSocket. Skipping stock check polling.");
      return;
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId: {
          in: activeUserIds,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            stock: true,
            status: true,
            price: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log(`[Stock Check Job] Checking stock status for ${wishlistItems.length} wishlist items belonging to active users...`);

    for (const item of wishlistItems) {
      const stockCount = item.listing.stock;
      const isLowStock = stockCount === 1 || (stockCount > 0 && stockCount <= 2);
      const isOutOfStock =
        stockCount <= 0 ||
        item.listing.status === "SOLD" ||
        item.listing.status === "EXCHANGED" ||
        item.listing.status === "DEACTIVATED";

      if (isLowStock) {
        console.warn(
          `[Stock Check Job] LOW STOCK ALERT: Product "${item.listing.title}" (Available: ${stockCount}) in active user "${item.user.email}"'s wishlist is ABOUT TO BE SOLD OUT!`
        );

        const alertMessage: MessagePayload = {
          type: "stock_alert",
          alertType: "LOW_STOCK",
          title: "Hurry! Almost Sold Out",
          content: `⚡ "${item.listing.title}" in your wishlist has only ${stockCount} left in stock!`,
          productId: item.listing.id,
          productTitle: item.listing.title,
          stock: stockCount,
          userId: item.user.id,
          timestamp: new Date().toISOString(),
        };

        // Deliver instant WebSocket alert to active user socket
        const sent = sendToUser(item.user.id, alertMessage);
        if (sent === 0) {
          broadcast(alertMessage);
        }
      } else if (isOutOfStock) {
        console.warn(
          `[Stock Check Job] OUT OF STOCK ALERT: Product "${item.listing.title}" in active user "${item.user.email}"'s wishlist is SOLD OUT!`
        );

        const alertMessage: MessagePayload = {
          type: "stock_alert",
          alertType: "OUT_OF_STOCK",
          title: "Item Sold Out",
          content: `Item "${item.listing.title}" in your wishlist has been sold out.`,
          productId: item.listing.id,
          productTitle: item.listing.title,
          stock: 0,
          userId: item.user.id,
          timestamp: new Date().toISOString(),
        };

        sendToUser(item.user.id, alertMessage);
      }
    }
  } catch (error) {
    console.error("[Stock Check Job] Error checking active user wishlist stock:", error);
  }
}
