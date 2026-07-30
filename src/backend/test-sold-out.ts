import "dotenv/config";
import { AdminService } from "./services/admin.service";
import { ListingService } from "./services/listing.service";
import { mapDbListingToProduct } from "../frontend/lib/api";
import { UserRepository } from "./repositories/user.repository";

async function testSoldOutLogic() {
  console.log("🧪 Testing Stock Auto-Status Transition & Storefront Sync...");

  const admin = await UserRepository.findByEmail("admin@college.edu");
  if (!admin) throw new Error("Admin not found.");

  // Fetch all listings directly from service
  const listings = await ListingService.getListings({});
  if (listings.length === 0) throw new Error("No listings found in DB.");

  const target = listings[0];
  console.log("📍 Selected Target Product:", target.title, "| ID:", target.id, "| Current Stock:", target.stock);

  // 1. Set stock to 0 via AdminService
  console.log("🔄 Admin updating stock to 0...");
  const updatedToZero = await AdminService.updateProduct(admin.id, target.id, { stock: 0 });
  console.log("✅ Admin Update Result -> Stock:", updatedToZero.stock, "| Status:", updatedToZero.status);
  if (updatedToZero.status !== "SOLD") {
    throw new Error("Expected status to be SOLD when stock is 0.");
  }

  // 2. Verify Storefront mapping via mapDbListingToProduct
  const fetchedListing = await ListingService.getListingById(target.id);
  const mappedProduct = mapDbListingToProduct(fetchedListing);
  console.log("🛍️ Mapped Product -> availableStock:", mappedProduct.availableStock, "| Status:", mappedProduct.status);
  if (mappedProduct.status !== "SOLD" || mappedProduct.availableStock !== 0) {
    throw new Error("Storefront product mapping failed for SOLD item.");
  }

  // 3. Restore stock to 5 via AdminService
  console.log("🔄 Admin restoring stock to 5...");
  const updatedToFive = await AdminService.updateProduct(admin.id, target.id, { stock: 5 });
  console.log("✅ Admin Restore Result -> Stock:", updatedToFive.stock, "| Status:", updatedToFive.status);
  if (updatedToFive.status !== "ACTIVE") {
    throw new Error("Expected status to be ACTIVE when stock > 0.");
  }

  console.log("🎉 ALL SOLD OUT & ADMIN SYNC TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
}

testSoldOutLogic().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
