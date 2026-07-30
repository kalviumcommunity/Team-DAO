'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Package, ShoppingBag, DollarSign, AlertTriangle, ArrowUpRight, Clock } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockAlerts: Array<{ id: string; title: string; stock: number; price: number; category: string }>;
  recentOrders: Array<{
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
    items: Array<{ listing: { title: string } }>;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-800 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30',
    },
    {
      label: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      icon: Package,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingBag,
      color: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    },
    {
      label: 'Total Revenue',
      value: `$${Number(stats.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time metrics, low stock warnings, and recent transaction activities.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} border backdrop-blur-md shadow-lg flex items-center justify-between`}
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  {card.label}
                </span>
                <span className="text-2xl font-black text-white">{card.value}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Low Stock Section */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white">Low Stock Alerts</h2>
            </div>
            <Link
              href="/admin/inventory"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {stats.lowStockAlerts.length === 0 ? (
              <div className="text-sm text-slate-500 py-4 text-center italic">No low stock items.</div>
            ) : (
              stats.lowStockAlerts.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="text-sm font-semibold text-slate-200 truncate">{item.title}</div>
                    <div className="text-xs text-slate-400">${Number(item.price).toFixed(2)} • {item.category}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {item.stock} left
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Recent Orders</h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500 italic">
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-3 font-mono font-medium text-indigo-300">
                        #{order.id.substring(0, 8)}
                      </td>
                      <td className="py-3">
                        <div className="font-semibold text-slate-200">{order.user.name}</div>
                        <div className="text-xs text-slate-500">{order.user.email}</div>
                      </td>
                      <td className="py-3 font-semibold text-emerald-400">
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.status === 'DELIVERED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : order.status === 'PROCESSING' || order.status === 'SHIPPED'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
