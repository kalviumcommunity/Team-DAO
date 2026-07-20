import { LayoutGrid, ListChecks, Gift, User } from "lucide-react";
import { cn } from "@/frontend/lib/cn";

const ITEMS = [
  { label: "Home", icon: LayoutGrid, active: false },
  { label: "Verify", icon: ListChecks, active: true },
  { label: "Rewards", icon: Gift, active: false },
  { label: "Profile", icon: User, active: false },
] as const;

/** Fixed bottom tab bar shown on mobile for app-like sections (e.g. CAC verification). */
export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-xl bg-cream-paper px-4 py-3 font-label-caps text-label-caps shadow-ambient md:hidden">
      {ITEMS.map(({ label, icon: Icon, active }) => (
        <a
          key={label}
          href="#"
          className={cn(
            "flex flex-col items-center justify-center transition-all",
            active
              ? "scale-90 rounded-full bg-primary-container px-4 py-1 text-on-primary-container"
              : "text-sage-gray hover:text-primary"
          )}
        >
          <Icon className="mb-1 h-5 w-5" />
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}
