"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, ShoppingBag, AlertTriangle } from "lucide-react";
import { useWebSocket, type WSMessage } from "@/frontend/hooks/useWebSocket";

export function StockAlertToast() {
  const { lastMessage } = useWebSocket({ autoConnect: true });
  const [activeAlert, setActiveAlert] = useState<WSMessage | null>(null);

  useEffect(() => {
    if (lastMessage && lastMessage.type === "stock_alert") {
      setActiveAlert(lastMessage);

      // Auto dismiss after 8 seconds
      const timer = setTimeout(() => {
        setActiveAlert(null);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [lastMessage]);

  if (!activeAlert) return null;

  const isLowStock = activeAlert.alertType === "LOW_STOCK";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex w-full max-w-md items-start gap-3 rounded-2xl border border-amber-300 bg-surface p-4 shadow-2xl backdrop-blur-md dark:border-amber-700"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900 font-bold shadow-xs">
          {isLowStock ? <Zap className="h-5 w-5 animate-bounce text-amber-700" /> : <AlertTriangle className="h-5 w-5 text-amber-700" />}
        </div>

        <div className="flex-1 pr-2">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-sm font-semibold text-stone-charcoal">
              {String(activeAlert.title || "Stock Alert")}
            </h4>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-label-caps text-[10px] font-bold text-amber-900">
              REAL-TIME WEBSOCKET
            </span>
          </div>

          <p className="mt-1 font-body-sm text-xs text-sage-gray leading-snug">
            {String(activeAlert.content || "An item in your wishlist has updated stock.")}
          </p>

          <div className="mt-3 flex items-center gap-3">
            <Link
              href="/wishlist"
              onClick={() => setActiveAlert(null)}
              className="flex items-center gap-1 font-body-sm text-xs font-semibold text-stone-charcoal underline hover:text-primary transition-colors"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              View Wishlist Now
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveAlert(null)}
          className="rounded-full p-1 text-sage-gray hover:bg-surface-container-high hover:text-stone-charcoal transition-colors cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
