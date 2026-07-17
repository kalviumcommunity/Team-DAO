export function startStockCheckJob(prisma: any) {
  console.log("[Stock Check Job] Starting background stock check polling (every 30 seconds)...");

  // Run the check immediately on startup
  setTimeout(() => {
    checkStock(prisma);
  }, 5000);

  setInterval(async () => {
    await checkStock(prisma);
  }, 30000);
}

async function checkStock(prisma: any) {
  try {
    const wishlistItems = await prisma.wishlistItem.findMany({
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            stock: true,
            status: true,
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

    console.log(`[Stock Check Job] Checking stock status for ${wishlistItems.length} wishlist items...`);

    for (const item of wishlistItems) {
      const isOutOfStock =
        item.listing.stock <= 0 ||
        item.listing.status === "SOLD" ||
        item.listing.status === "EXCHANGED" ||
        item.listing.status === "DEACTIVATED";

      if (isOutOfStock) {
        console.warn(
          `[Stock Check Job] ALERT: Product "${item.listing.title}" (ID: ${item.listing.id}) in user "${item.user.email}"'s wishlist is OUT OF STOCK!`
        );
      } else {
        console.log(
          `[Stock Check Job] Product "${item.listing.title}" (ID: ${item.listing.id}) in user "${item.user.email}"'s wishlist is in stock. (Available: ${item.listing.stock})`
        );
      }
    }
  } catch (error) {
    console.error("[Stock Check Job] Error checking wishlist stock:", error);
  }
}
