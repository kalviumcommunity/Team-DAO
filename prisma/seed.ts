import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  if (process.env.NODE_ENV === "production") {
    console.log("Seeding skipped: Safety guard prevents seeding in production environment.");
    return;
  }

  console.log("Cleaning database...");
  // Delete references first to avoid foreign key constraint violations
  await prisma.auditLog.deleteMany({});
  await prisma.inventoryLog.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.exchangeRequest.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.wishlistItem.deleteMany({});
  await prisma.listing.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Database cleaned.");

  const hashedPassword = await bcrypt.hash("password123", 10);

  console.log("Seeding users...");
  const superAdmin = await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "superadmin@college.edu",
      password: hashedPassword,
      college: "Central University",
      role: "SUPER_ADMIN",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@college.edu",
      password: hashedPassword,
      college: "Central University",
      role: "ADMIN",
    },
  });

  const verifier1 = await prisma.user.create({
    data: {
      name: "Verifier Bob",
      email: "verifier1@college.edu",
      password: hashedPassword,
      college: "Central University",
      role: "VERIFIER",
    },
  });

  const verifier2 = await prisma.user.create({
    data: {
      name: "Verifier Alice",
      email: "verifier2@college.edu",
      password: hashedPassword,
      college: "Central University",
      role: "VERIFIER",
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: "Alex J.",
      email: "student1@college.edu",
      password: hashedPassword,
      college: "Central University",
      role: "STUDENT",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Sarah M.",
      email: "student2@college.edu",
      password: hashedPassword,
      college: "Central University",
      role: "STUDENT",
    },
  });

  const student3 = await prisma.user.create({
    data: {
      name: "Chris T.",
      email: "student3@college.edu",
      password: hashedPassword,
      college: "State Tech",
      role: "STUDENT",
    },
  });

  const student4 = await prisma.user.create({
    data: {
      name: "Jane D.",
      email: "student4@college.edu",
      password: hashedPassword,
      college: "State Tech",
      role: "STUDENT",
    },
  });

  console.log("Seeding listings...");
  const listing1 = await prisma.listing.create({
    data: {
      title: "Calculus: Early Transcendentals",
      description: "Standard calculus textbook, light highlighting inside. Very useful for first year calculus courses.",
      price: "45.00",
      condition: "GOOD",
      durationUsed: "6 months",
      category: "Books",
      stock: 1,
      sellerId: student1.id,
      status: "ACTIVE",
      listingType: "SALE",
      exchangeAvailable: false,
      verified: true,
    },
  });

  const listing2 = await prisma.listing.create({
    data: {
      title: "MacBook Air M2 2022",
      description: "Silver MacBook Air with M2 chip, 8GB RAM, 256GB SSD. Minor scratches on the bottom case, screen is perfect. Comes with original charger.",
      price: "850.00",
      condition: "LIKE_NEW",
      durationUsed: "1 year",
      category: "Electronics",
      stock: 1,
      sellerId: student2.id,
      status: "ACTIVE",
      listingType: "SALE",
      exchangeAvailable: true,
      verified: true,
    },
  });

  const listing3 = await prisma.listing.create({
    data: {
      title: "TI-84 Plus CE Graphing Calculator",
      description: "Black graphing calculator. Works perfectly, screen is clear. Includes charging cable.",
      price: "95.00",
      condition: "GOOD",
      durationUsed: "2 years",
      category: "Electronics",
      stock: 1,
      sellerId: student3.id,
      status: "ACTIVE",
      listingType: "SALE",
      exchangeAvailable: false,
      verified: true,
    },
  });

  const listing4 = await prisma.listing.create({
    data: {
      title: "Modern LED Desk Lamp",
      description: "Sleek LED desk lamp with adjustable brightness. Perfect for late-night studying. Minor scratch on base.",
      price: "22.00",
      condition: "GOOD",
      durationUsed: "8 months",
      category: "Furniture",
      stock: 1,
      sellerId: student1.id,
      status: "PENDING_VERIFICATION",
      listingType: "SALE",
      exchangeAvailable: false,
      verified: false,
    },
  });

  const listing5 = await prisma.listing.create({
    data: {
      title: "Herschel Classic Backpack",
      description: "Sage green canvas backpack. All zippers work perfectly. Slight wear at the bottom.",
      price: "35.00",
      condition: "GOOD",
      durationUsed: "1.5 years",
      category: "Accessories",
      stock: 1,
      sellerId: student2.id,
      status: "PENDING_VERIFICATION",
      listingType: "SALE",
      exchangeAvailable: false,
      verified: false,
    },
  });

  const listing6 = await prisma.listing.create({
    data: {
      title: "Advanced Calculus: A Geometric View",
      description: "Advanced calculus textbook. Clean pages, no highlighting. Looking to exchange for architectural drafting materials.",
      price: "45.00",
      condition: "GOOD",
      durationUsed: "3 months",
      category: "Books",
      stock: 1,
      sellerId: student3.id,
      status: "ACTIVE",
      listingType: "EXCHANGE",
      exchangeAvailable: true,
      verified: true,
    },
  });

  const listing7 = await prisma.listing.create({
    data: {
      title: "Introduction to Architectural Drafting",
      description: "Drafting textbook. Willing to exchange for advanced calculus book.",
      price: "15.00",
      condition: "GOOD",
      durationUsed: "1 year",
      category: "Books",
      stock: 1,
      sellerId: student4.id,
      status: "ACTIVE",
      listingType: "EXCHANGE",
      exchangeAvailable: true,
      verified: true,
    },
  });

  const listing8 = await prisma.listing.create({
    data: {
      title: "Lab Goggles & Coat Set",
      description: "Medium size white lab coat and safety goggles. Used for one semester chemistry lab course. Giving away for free.",
      price: "0.00",
      condition: "LIKE_NEW",
      durationUsed: "1 semester",
      category: "Lab Gear",
      stock: 1,
      sellerId: student1.id,
      status: "ACTIVE",
      listingType: "DONATION",
      exchangeAvailable: false,
      verified: true,
    },
  });

  const listing9 = await prisma.listing.create({
    data: {
      title: "Dorm Chair",
      description: "Comfortable padded study study chair. Moving out and don't have space.",
      price: "10.00",
      condition: "FAIR",
      durationUsed: "2 years",
      category: "Furniture",
      stock: 1,
      sellerId: student2.id,
      status: "SOLD",
      listingType: "SALE",
      exchangeAvailable: false,
      verified: true,
    },
  });

  console.log("Seeding wishlists...");
  await prisma.wishlistItem.createMany({
    data: [
      { userId: student1.id, listingId: listing2.id },
      { userId: student1.id, listingId: listing3.id },
      { userId: student2.id, listingId: listing3.id },
      { userId: student3.id, listingId: listing2.id },
    ],
  });

  console.log("Seeding cart items...");
  await prisma.cartItem.createMany({
    data: [
      { userId: student1.id, listingId: listing2.id, quantity: 1 },
      { userId: student4.id, listingId: listing1.id, quantity: 1 },
    ],
  });

  console.log("Seeding exchange requests...");
  await prisma.exchangeRequest.create({
    data: {
      senderId: student3.id,
      receiverId: student4.id,
      offeredProductId: listing6.id,
      requestedProductId: listing7.id,
      status: "PENDING",
    },
  });

  console.log("Seeding verifications...");
  await prisma.verification.createMany({
    data: [
      {
        productId: listing1.id,
        verifierId: verifier1.id,
        status: "APPROVED",
        remarks: "Checked textbook condition. Inside is clean, minimal highlight. Matches description.",
      },
      {
        productId: listing4.id,
        verifierId: verifier2.id,
        status: "PENDING",
        remarks: "Waiting for student to present item for verification.",
      },
    ],
  });

  console.log("Seeding orders & items...");
  const order1 = await prisma.order.create({
    data: {
      userId: student1.id,
      totalAmount: 110.00,
      status: "DELIVERED",
      items: {
        create: [
          { listingId: listing1.id, quantity: 1, price: 45.00 },
          { listingId: listing2.id, quantity: 1, price: 65.00 },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      userId: student2.id,
      totalAmount: 750.00,
      status: "PROCESSING",
      items: {
        create: [
          { listingId: listing3.id, quantity: 1, price: 750.00 },
        ],
      },
    },
  });

  console.log("Seeding inventory logs & audit logs...");
  await prisma.inventoryLog.createMany({
    data: [
      {
        listingId: listing1.id,
        previousStock: 5,
        newStock: 3,
        updatedById: admin.id,
      },
      {
        listingId: listing3.id,
        previousStock: 2,
        newStock: 1,
        updatedById: admin.id,
      },
    ],
  });

  await prisma.auditLog.createMany({
    data: [
      {
        adminId: superAdmin.id,
        action: "PROMOTED_USER_TO_ADMIN",
        targetType: "User",
        targetId: admin.id,
        details: "Promoted Admin User to ADMIN role",
      },
      {
        adminId: admin.id,
        action: "UPDATED_STOCK",
        targetType: "Listing",
        targetId: listing1.id,
        details: "Updated stock from 5 to 3",
      },
      {
        adminId: admin.id,
        action: "UPDATED_ORDER_STATUS",
        targetType: "Order",
        targetId: order1.id,
        details: "Updated status to DELIVERED",
      },
    ],
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
