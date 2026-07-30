'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  Users,
  ShieldAlert,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'VERIFIER' | 'ADMIN' | 'SUPER_ADMIN';
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch('/api/auth/me', { headers });
        if (res.ok) {
          const data = await res.json();
          if (data.user && (data.user.role === 'ADMIN' || data.user.role === 'SUPER_ADMIN')) {
            setCurrentUser(data.user);
          } else {
            router.push('/login?error=ForbiddenAccess');
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Auth check error:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Verifying Admin Permissions...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
    { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldAlert },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 h-screen z-30">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
                Stucart
              </span>
              <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-400">
                Admin Console
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-indigo-400" />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-200 truncate">{currentUser.name}</div>
              <div className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {currentUser.role}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg font-bold text-slate-100 hidden sm:block">
              {navItems.find((i) => i.href === pathname)?.label || 'Admin Control Panel'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 transition border border-slate-700"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                router.push('/login');
              }}
              className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 transition"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-950/95 p-6 space-y-4 flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                <span className="font-bold text-lg">Admin Navigation</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="space-y-2 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-slate-300 hover:bg-slate-800"
                >
                  <item.icon className="w-5 h-5 text-indigo-400" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
