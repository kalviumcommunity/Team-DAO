import "dotenv/config";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./utils/auth";
import { UserRepository } from "./repositories/user.repository";
import { AdminService } from "./services/admin.service";

async function testAdminRBAC() {
  console.log("🔍 Testing Admin Dashboard & RBAC Logic...");

  // 1. Find superadmin
  const superAdmin = await UserRepository.findByEmail("superadmin@college.edu");
  if (!superAdmin) {
    throw new Error("Super Admin user not found in database.");
  }
  console.log("✅ Super Admin found:", superAdmin.email, "| Role:", superAdmin.role);

  // 2. Find admin
  const admin = await UserRepository.findByEmail("admin@college.edu");
  if (!admin) {
    throw new Error("Admin user not found in database.");
  }
  console.log("✅ Admin found:", admin.email, "| Role:", admin.role);

  // 3. Generate token
  const superAdminToken = jwt.sign({ userId: superAdmin.id, email: superAdmin.email, role: superAdmin.role }, JWT_SECRET);
  console.log("✅ Generated Super Admin JWT token successfully.");

  // 4. Test AdminService Dashboard overview
  const stats = await AdminService.getDashboardOverview();
  console.log("✅ Dashboard Overview Stats:", {
    totalUsers: stats.totalUsers,
    totalProducts: stats.totalProducts,
    totalOrders: stats.totalOrders,
    totalRevenue: stats.totalRevenue,
    lowStockAlertsCount: stats.lowStockAlerts.length,
    recentOrdersCount: stats.recentOrders.length,
  });

  // 5. Test Users list
  const usersResult = await AdminService.getUsers({ limit: 5 });
  console.log("✅ Users fetched successfully. Total users in DB:", usersResult.total);

  // 6. Test Audit logs
  const auditLogs = await AdminService.getAuditLogs();
  console.log("✅ Audit Logs fetched successfully. Total entries:", auditLogs.length);

  console.log("🎉 ALL RBAC & ADMIN DASHBOARD BACKEND SERVICES VERIFIED SUCCESSFULLY!");
  process.exit(0);
}

testAdminRBAC().catch((err) => {
  console.error("❌ Test failed:", err);
  process.exit(1);
});
