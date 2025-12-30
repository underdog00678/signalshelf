"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/app" },
  { label: "Inbox", href: "/app/inbox" },
  { label: "New", href: "/app/new" },
  { label: "Tags", href: "/app/tags" },
  { label: "Settings", href: "/app/settings" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/app" className="font-semibold text-neutral-50">
          SignalShelf
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const linkClass = isActive
              ? "text-neutral-50 border-b border-neutral-50 pb-1"
              : "text-neutral-400 hover:text-neutral-200 pb-1 border-b border-transparent";

            return (
              <Link key={item.href} href={item.href} className={linkClass}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
