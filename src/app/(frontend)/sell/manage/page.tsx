"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { Footer } from "@/frontend/components/layout/Footer";
import { FadeInSection, StaggerItem } from "@/frontend/components/motion/FadeInSection";
import { Button } from "@/frontend/components/common/Button";
import {
  getSellerListings,
  updateSellerListing,
  deleteSellerListing,
  getAuthToken,
  getCurrentUser,
  type SellerListingItem,
} from "@/frontend/lib/api";
import {
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Package,
  User,
  Mail,
  GraduationCap,
  Calendar,
  Sparkles,
  ShoppingBag,
  EyeOff,
  RefreshCw,
  Tag,
  Lock,
  LogIn,
  UserPlus,
} from "lucide-react";

export default function SellerManagePage() {
  const [listings, setListings] = useState<SellerListingItem[]>([]);
  const [draftPrices, setDraftPrices] = useState<Record<string, number>>({});
  const [priceErrors, setPriceErrors] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [saveSuccessId, setSaveSuccessId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const loadListings = async () => {
    const token = getAuthToken();
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const uRes = await getCurrentUser();
      if (uRes?.user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }

    setIsLoading(true);
    try {
      const items = await getSellerListings();
      setListings(items);
      const initialDrafts: Record<string, number> = {};
      items.forEach((item) => {
        initialDrafts[item.id] = item.price;
      });
      setDraftPrices(initialDrafts);
    } catch {
      // Handled in API fallback
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadListings();
  }, []);

  // Explicit Update Price Handler
  const handlePriceSave = async (id: string) => {
    const targetPrice = draftPrices[id];
    if (targetPrice === undefined || targetPrice <= 0) {
      setPriceErrors((prev) => ({ ...prev, [id]: "Price must be greater than 0" }));
      return;
    }

    setPriceErrors((prev) => ({ ...prev, [id]: null }));
    setUpdatingId(id);
    try {
      await updateSellerListing(id, { price: targetPrice });
      setListings((prev) =>
        prev.map((item) => (item.id === id ? { ...item, price: targetPrice } : item))
      );
      setSaveSuccessId(id);
      setTimeout(() => setSaveSuccessId(null), 2500);
    } catch {
      // Fallback updated locally
    } finally {
      setUpdatingId(null);
    }
  };

  // Update Stock Quantity Handler
  const handleStockChange = async (id: string, newStock: number) => {
    if (isNaN(newStock) || newStock < 0) return;
    setUpdatingId(id);
    const newStatus = newStock === 0 ? "SOLD" : "ACTIVE";
    try {
      await updateSellerListing(id, { stock: newStock, status: newStatus });
      setListings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock: newStock, status: newStatus } : item
        )
      );
      setSaveSuccessId(id);
      setTimeout(() => setSaveSuccessId(null), 2000);
    } catch {
      // Fallback updated
    } finally {
      setUpdatingId(null);
    }
  };

  // Mark Item Sold Handler (Vanishes from marketplace)
  const handleMarkSold = async (id: string) => {
    setUpdatingId(id);
    try {
      await updateSellerListing(id, { stock: 0, status: "SOLD" });
      setListings((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, stock: 0, status: "SOLD" } : item
        )
      );
      setSaveSuccessId(id);
      setTimeout(() => setSaveSuccessId(null), 2000);
    } catch {
      // Fallback updated
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Listing Handler
  const handleDeleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    setUpdatingId(id);
    try {
      await deleteSellerListing(id);
      setListings((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // Fallback deleted
    } finally {
      setUpdatingId(null);
    }
  };

  const activeCount = listings.filter((i) => i.status === "ACTIVE" && i.stock > 0).length;
  const soldCount = listings.filter((i) => i.status === "SOLD" || i.stock === 0).length;

  return (
    <>
      <Navbar activeHref="/sell" />

      <main className="mx-auto w-full max-w-7xl flex-grow px-container-margin pb-section-gap pt-[calc(72px+3rem)]">
        {/* Dashboard Header */}
        <FadeInSection as="header" className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-label-caps text-label-caps tracking-widest text-sage-gray uppercase">
                SELLER DASHBOARD
              </span>
              <span className="flex h-5 items-center justify-center rounded-full bg-primary-container px-2 font-label-caps text-[11px] font-bold text-on-background">
                UNLOCKED
              </span>
            </div>
            <h1 className="font-display text-[44px] font-light leading-tight tracking-[-1px] text-stone-charcoal">
              Inventory & Order Controls
            </h1>
            <p className="font-body-sm text-sm text-sage-gray mt-1">
              Control prices, manage stock quantities, track buyers, and oversee listing status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/sell">
              <Button variant="primary" className="flex items-center gap-2 bg-primary-container text-on-background hover:brightness-95">
                <Plus className="h-4 w-4" />
                List New Item
              </Button>
            </Link>
          </div>
        </FadeInSection>

        {/* Overview Stats Cards */}
        <FadeInSection className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-3xl border border-surface-container-high bg-surface p-6 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container/40 text-stone-charcoal">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="font-body-sm text-xs font-medium text-sage-gray">Total Listed Items</p>
              <p className="font-display text-3xl font-normal text-stone-charcoal">{listings.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-surface-container-high bg-surface p-6 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <p className="font-body-sm text-xs font-medium text-sage-gray">Active Marketplace Items</p>
              <p className="font-display text-3xl font-normal text-stone-charcoal">{activeCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-3xl border border-surface-container-high bg-surface p-6 shadow-xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <EyeOff className="h-6 w-6" />
            </div>
            <div>
              <p className="font-body-sm text-xs font-medium text-sage-gray">Sold & Vanished Items</p>
              <p className="font-display text-3xl font-normal text-stone-charcoal">{soldCount}</p>
            </div>
          </div>
        </FadeInSection>

        {/* Listings List & Controls */}
        {isAuthenticated === false ? (
          <FadeInSection className="mb-16 flex flex-col items-center justify-center rounded-3xl border border-amber-300 bg-surface p-10 text-center shadow-xl dark:border-amber-700">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-900 shadow-md">
              <Lock className="h-8 w-8" />
            </div>

            <h2 className="font-display text-2xl font-normal text-stone-charcoal mb-2">
              Sign In Required to Manage Seller Inventory
            </h2>

            <p className="mb-8 max-w-md font-body-sm text-sm text-sage-gray leading-relaxed">
              You must be logged in as an authenticated seller to access the inventory dashboard, control prices, and track student orders.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
              <Link href="/login?redirect=/sell/manage" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2 bg-primary-container text-on-background py-3.5 px-6 rounded-full font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>

              <Link href="/signup" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-stone-charcoal text-stone-charcoal hover:bg-stone-charcoal hover:text-surface py-3.5 px-6 rounded-full font-medium"
                >
                  <UserPlus className="h-4 w-4" />
                  Create Account
                </Button>
              </Link>
            </div>
          </FadeInSection>
        ) : isLoading ? (
          <p className="mb-16 text-center text-sage-gray py-12">Loading seller dashboard...</p>
        ) : listings.length === 0 ? (
          <FadeInSection className="mb-16 flex flex-col items-center justify-center rounded-3xl border border-surface-container-high bg-surface-container-low px-6 py-16 text-center">
            <Package className="mb-4 h-12 w-12 text-sage-gray" />
            <h3 className="mb-2 font-display text-2xl font-normal text-stone-charcoal">
              No listings created yet
            </h3>
            <p className="mb-6 max-w-md font-body-sm text-sm text-sage-gray">
              List an item to unlock full inventory price & quantity controls and buyer tracking.
            </p>
            <Link href="/sell">
              <Button variant="primary" className="bg-primary-container text-on-background">
                List an item now
              </Button>
            </Link>
          </FadeInSection>
        ) : (
          <FadeInSection stagger className="space-y-8 mb-16">
            {listings.map((item) => {
              const isSold = item.status === "SOLD" || item.stock === 0;

              return (
                <StaggerItem
                  key={item.id}
                  className="rounded-3xl border border-surface-container-high bg-surface p-6 md:p-8 shadow-xs transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-6">
                    {/* Top Row: Item Header & Status Badge */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container-high pb-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-container-high text-stone-charcoal">
                          <Tag className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="font-display text-2xl font-normal text-stone-charcoal">
                              {item.title}
                            </h2>
                            {isSold ? (
                              <span className="flex items-center gap-1 rounded-full bg-stone-charcoal/10 px-3 py-1 font-body-sm text-xs font-semibold text-stone-charcoal">
                                <EyeOff className="h-3.5 w-3.5" />
                                SOLD (Vanished from Marketplace)
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 font-body-sm text-xs font-semibold text-emerald-800">
                                <CheckCircle className="h-3.5 w-3.5" />
                                ACTIVE on Marketplace
                              </span>
                            )}
                          </div>
                          <p className="font-body-sm text-xs text-sage-gray mt-1">
                            Category: {item.category} • Condition: {item.condition}
                          </p>
                        </div>
                      </div>

                      {/* Item Quick Actions */}
                      <div className="flex items-center gap-2">
                        {!isSold && (
                          <button
                            type="button"
                            onClick={() => handleMarkSold(item.id)}
                            disabled={updatingId === item.id}
                            className="flex items-center gap-1.5 rounded-full border border-stone-charcoal/30 px-4 py-2 font-body-sm text-xs font-medium text-stone-charcoal hover:bg-stone-charcoal hover:text-surface transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <EyeOff className="h-3.5 w-3.5" />
                            Mark as Sold
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteListing(item.id)}
                          disabled={updatingId === item.id}
                          className="flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-2 font-body-sm text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                          title="Delete Listing"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Middle Section: Controllers (Price & Quantity) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low/60 rounded-2xl p-5 border border-surface-container-high">
                      {/* Price Controller with Explicit Update Button */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block font-body-sm text-xs font-semibold uppercase tracking-wider text-sage-gray">
                            Asking Price (₹)
                          </label>
                          {priceErrors[item.id] && (
                            <span className="font-body-sm text-xs font-medium text-red-600">
                              {priceErrors[item.id]}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-body-sm text-sm font-semibold text-stone-charcoal">
                              ₹
                            </span>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={draftPrices[item.id] !== undefined ? draftPrices[item.id] : item.price}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setDraftPrices((prev) => ({ ...prev, [item.id]: isNaN(val) ? 0 : val }));
                                if (val > 0) {
                                  setPriceErrors((prev) => ({ ...prev, [item.id]: null }));
                                }
                              }}
                              className="w-full rounded-xl border border-stone-charcoal/20 bg-surface pl-8 pr-3 py-2.5 font-body-sm text-base font-semibold text-stone-charcoal focus:border-stone-charcoal focus:outline-hidden"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handlePriceSave(item.id)}
                            disabled={updatingId === item.id}
                            className="flex items-center gap-1 rounded-xl bg-primary-container px-4 py-2.5 font-body-sm text-xs font-semibold text-on-background hover:brightness-95 transition-all cursor-pointer disabled:opacity-50"
                          >
                            Update Price
                          </button>
                        </div>
                      </div>

                      {/* Quantity Stock Controller */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block font-body-sm text-xs font-semibold uppercase tracking-wider text-sage-gray">
                            Available Stock Quantity
                          </label>
                          <span className="font-body-sm text-xs text-sage-gray">
                            {item.stock === 0 ? "Vanished from public view" : `${item.stock} in stock`}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 flex-1">
                            <button
                              type="button"
                              onClick={() => handleStockChange(item.id, Math.max(0, item.stock - 1))}
                              className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-charcoal/20 bg-surface text-stone-charcoal hover:bg-surface-container-high cursor-pointer transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>

                            <input
                              type="number"
                              min="0"
                              value={item.stock}
                              onChange={(e) =>
                                handleStockChange(item.id, parseInt(e.target.value, 10) || 0)
                              }
                              className="w-full text-center rounded-xl border border-stone-charcoal/20 bg-surface py-2.5 font-body-sm text-base font-semibold text-stone-charcoal focus:border-stone-charcoal focus:outline-hidden"
                            />

                            <button
                              type="button"
                              onClick={() => handleStockChange(item.id, item.stock + 1)}
                              className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-charcoal/20 bg-surface text-stone-charcoal hover:bg-surface-container-high cursor-pointer transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {saveSuccessId === item.id && (
                      <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Updated successfully in database & live marketplace!
                      </div>
                    )}

                    {/* Bottom Section: Buyer Details (Who is going to buy it) */}
                    <div>
                      <h3 className="font-body-sm text-xs font-semibold uppercase tracking-wider text-sage-gray mb-3 flex items-center gap-2">
                        <User className="h-4 w-4 text-stone-charcoal" />
                        Buyer Information & Orders ({item.buyers.length})
                      </h3>

                      {item.buyers.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-surface-container-high p-4 text-center">
                          <p className="font-body-sm text-xs text-sage-gray">
                            No student orders placed for this item yet. Interested buyers will appear here automatically when ordered.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {item.buyers.map((buyer) => (
                            <div
                              key={buyer.id}
                              className="flex flex-col gap-2 rounded-2xl border border-surface-container-high bg-surface p-4 shadow-xs"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-body-sm text-sm font-semibold text-stone-charcoal flex items-center gap-1.5">
                                  <User className="h-4 w-4 text-primary" />
                                  {buyer.name}
                                </span>
                                <span className="rounded-full bg-primary-container px-2.5 py-0.5 font-label-caps text-[10px] font-bold text-on-background">
                                  {buyer.orderStatus}
                                </span>
                              </div>

                              <div className="space-y-1 font-body-sm text-xs text-sage-gray">
                                <p className="flex items-center gap-1.5">
                                  <GraduationCap className="h-3.5 w-3.5 text-sage-gray" />
                                  {buyer.college}
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <Mail className="h-3.5 w-3.5 text-sage-gray" />
                                  {buyer.email}
                                </p>
                                <p className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-sage-gray" />
                                  Qty: {buyer.quantity} • Ordered: {new Date(buyer.orderDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </FadeInSection>
        )}
      </main>

      <Footer />
    </>
  );
}
