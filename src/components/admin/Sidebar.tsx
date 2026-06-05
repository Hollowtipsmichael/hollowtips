"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { NAV_ITEMS } from "./nav";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Sidebar({ collapsed, mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const nav = (
    <nav className="flex flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onCloseMobile}
            title={collapsed ? item.label : undefined}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              active
                ? "bg-gold/10 text-gold"
                : "text-muted hover:bg-panel-raised hover:text-fg"
            } ${collapsed ? "lg:justify-center lg:px-0" : ""}`}
          >
            {/* Active gold left-rail indicator */}
            <span
              className={`absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-gold-gradient transition-opacity ${
                active ? "opacity-100" : "opacity-0"
              }`}
            />
            <Icon
              className={`h-5 w-5 shrink-0 ${active ? "text-gold" : ""}`}
            />
            <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const header = (
    <div
      className={`flex h-16 items-center px-5 ${
        collapsed ? "lg:justify-center lg:px-0" : ""
      }`}
    >
      {collapsed ? (
        <span className="hidden lg:block">
          <HollowtipsLogo variant="mark" size={30} />
        </span>
      ) : null}
      <span className={collapsed ? "lg:hidden" : ""}>
        <HollowtipsLogo variant="full" size={30} />
      </span>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`grain relative z-30 hidden shrink-0 flex-col border-r border-subtle bg-panel py-2 transition-[width] duration-300 lg:flex print:!hidden ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        {header}
        <div className="rule-gold my-2" />
        {nav}
      </aside>

      {/* Mobile drawer + backdrop */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          mobileOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={onCloseMobile}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`grain absolute left-0 top-0 flex h-full w-72 flex-col border-r border-subtle bg-panel py-2 shadow-2xl transition-transform duration-300 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-5">
            <HollowtipsLogo variant="full" size={30} />
            <button
              type="button"
              aria-label="Close menu"
              onClick={onCloseMobile}
              className="focus-gold grid h-9 w-9 place-items-center rounded-lg text-muted hover:text-fg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="rule-gold my-2" />
          {nav}
        </aside>
      </div>
    </>
  );
}
