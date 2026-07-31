import { NextResponse } from "next/server";
import { ListingService } from "@/backend/services/listing.service";
import { getCurrentUser } from "@/backend/utils/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawListings = await ListingService.getSellerListings(user.id);

    // Format listings and attach buyer info from orderItems
    const listings = rawListings.map((item: any) => {
      const buyersMap = new Map<string, any>();

      if (item.orderItems && Array.isArray(item.orderItems)) {
        item.orderItems.forEach((orderItem: any) => {
          if (orderItem.order && orderItem.order.user) {
            const buyer = orderItem.order.user;
            if (!buyersMap.has(buyer.id)) {
              buyersMap.set(buyer.id, {
                id: buyer.id,
                name: buyer.name,
                email: buyer.email,
                college: buyer.college,
                quantity: orderItem.quantity,
                pricePaid: orderItem.price,
                orderDate: orderItem.createdAt || orderItem.order.createdAt,
                orderStatus: orderItem.order.status,
              });
            }
          }
        });
      }

      return {
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price ? (typeof item.price === "number" ? item.price : parseFloat(item.price.toString())) : 0,
        condition: item.condition,
        category: item.category,
        stock: item.stock,
        status: item.status,
        listingType: item.listingType,
        verified: item.verified,
        createdAt: item.createdAt,
        buyers: Array.from(buyersMap.values()),
      };
    });

    return NextResponse.json({ listings }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error instanceof Error ? error.message : String(error)) || "Failed to fetch seller listings" },
      { status: 500 }
    );
  }
}
