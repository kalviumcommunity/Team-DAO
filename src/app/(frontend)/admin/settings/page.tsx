'use client';

import React, { useState } from 'react';
import { Settings, Save, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoVerifyListings, setAutoVerifyListings] = useState(false);
  const [maxStockPerItem, setMaxStockPerItem] = useState('50');
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">System Settings</h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure global marketplace options, safety parameters, and feature flags.
        </p>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm">
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
          <Settings className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-white">Platform Controls</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="font-semibold text-slate-200 block text-sm">Maintenance Mode</span>
              <span className="text-xs text-slate-400">Temporarily block non-admin users from accessing store pages.</span>
            </div>
            <input
              type="checkbox"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="font-semibold text-slate-200 block text-sm">Auto-Approve Listings</span>
              <span className="text-xs text-slate-400">Automatically approve new product listings without requiring verifier review.</span>
            </div>
            <input
              type="checkbox"
              checked={autoVerifyListings}
              onChange={(e) => setAutoVerifyListings(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <span className="font-semibold text-slate-200 block text-sm">Max Inventory Stock Limit</span>
            <span className="text-xs text-slate-400 block">Maximum stock allowed per single listing.</span>
            <input
              type="number"
              value={maxStockPerItem}
              onChange={(e) => setMaxStockPerItem(e.target.value)}
              className="w-full sm:w-48 bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
