'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Search, ShoppingBag } from 'lucide-react';

interface OrderItem {
  id: string;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  user: { id: string; name: string; email: string };
  items: Array<{ id: string; quantity: number; price: number; listing: { id: string; title: string } }>;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Order Management</h1>
        <p className="text-slate-400 text-sm mt-1">
          View all platform orders, inspect purchased line items, and transition status states.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, customer name, email..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs text-slate-400 font-semibold uppercase">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="REFUNDED">REFUNDED</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-slate-500 italic bg-slate-900 border border-slate-800 rounded-2xl">
            No orders found matching the filter.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5 text-indigo-400" />
                    <span className="font-mono font-bold text-indigo-300 text-base">
                      Order #{order.id.substring(0, 8)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Customer: <span className="text-slate-200 font-medium">{order.user?.name}</span> ({order.user?.email})
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total Amount</span>
                    <span className="text-lg font-black text-emerald-400">
                      ${Number(order.totalAmount).toFixed(2)}
                    </span>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-indigo-500 ${
                      order.status === 'DELIVERED'
                        ? 'text-emerald-400 border-emerald-500/30'
                        : order.status === 'PROCESSING' || order.status === 'SHIPPED'
                        ? 'text-blue-400 border-blue-500/30'
                        : order.status === 'CANCELLED' || order.status === 'REFUNDED'
                        ? 'text-rose-400 border-rose-500/30'
                        : 'text-amber-400 border-amber-500/30'
                    }`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase text-slate-400">Line Items</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-200 truncate pr-2">
                        {item.listing?.title || 'Item'}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {item.quantity}x @ ${Number(item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
