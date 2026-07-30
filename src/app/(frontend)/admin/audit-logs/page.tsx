'use client';

import React, { useEffect, useState } from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

interface AuditLogItem {
  id: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: string;
  timestamp: string;
  admin: { id: string; name: string; email: string; role: string };
}

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch('/api/admin/audit-logs');
        if (res.ok) {
          const data = await res.json();
          setLogs(data.logs);
        }
      } catch (err) {
        console.error('Failed to load audit logs:', err);
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
        <h1 className="text-3xl font-extrabold text-white">System Audit Logs</h1>
        <p className="text-slate-400 text-sm mt-1">
          Complete security and administrative action trail across users, products, orders, and security roles.
        </p>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-lg space-y-4 p-6">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <ShieldAlert className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Administrative Actions & Security Events</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-950/60">
                <th className="p-4">Action</th>
                <th className="p-4">Admin</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Details</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    Loading audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                    No security audit events logged yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-extrabold tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        <ShieldCheck className="w-3.5 h-3.5" /> {log.action}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-200">{log.admin?.name}</div>
                      <div className="text-xs text-slate-500">{log.admin?.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-xs font-mono text-slate-300">
                        {log.targetType} {log.targetId ? `#${log.targetId.substring(0, 8)}` : ''}
                      </div>
                    </td>
                    <td className="p-4 text-xs text-slate-300 max-w-xs truncate">
                      {log.details || '—'}
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
