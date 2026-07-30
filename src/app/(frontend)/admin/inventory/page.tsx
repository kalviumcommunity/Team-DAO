'use client';

import React, { useEffect, useState } from 'react';
import { Boxes, History, ArrowRight } from 'lucide-react';

interface InventoryLogItem {
  id: string;
  previousStock: number;
  newStock: number;
  timestamp: string;
  listing: { id: string; title: string };
  updatedBy: { id: string; name: string; email: string };
}

export default function AdminInventoryPage() {
  const [logs, setLogs] = useState<InventoryLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch('/api/admin/inventory');
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs);
        }
      } catch (err) {
        console.error('Failed to load inventory logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Inventory History Logs</h1>
        <p className="text-slate-400 text-sm mt-1">
          Track historical inventory updates, stock quantity changes, and admin modifications.
        </p>
      </div>

      {/* Inventory Change Logs Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-4 p-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <History className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Audit Trail of Stock Modifications</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                <th className="p-4">Product</th>
                <th className="p-4">Stock Transition</th>
                <th className="p-4">Updated By</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    Loading inventory history...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 italic">
                    No inventory changes recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isDecrease = log.newStock < log.previousStock;
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-semibold text-slate-200">
                        <div className="flex items-center gap-2">
                          <Boxes className="w-4 h-4 text-indigo-400" />
                          <span>{log.listing?.title || 'Unknown Product'}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 font-mono text-sm">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {log.previousStock}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              isDecrease
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {log.newStock}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-slate-300">{log.updatedBy?.name}</div>
                        <div className="text-xs text-slate-500">{log.updatedBy?.email}</div>
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
