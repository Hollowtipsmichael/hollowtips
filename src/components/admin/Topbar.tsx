"use client";

import { usePathname } from "next/navigation";
import { Menu, PanelLeftClose, PanelLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { titleForPath } from "./nav";

interface TopbarProps {
  name: string;
  email: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

export function Topbar({
  name,
  email,
  collapsed,
  onToggleCollapse,
  onOpenMobile,
}: TopbarProps) {
  const pathname = usePathname();
  const title = titleForPath(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-subtle bg-bg/80 px-4 backdrop-blur-xl sm:px-6 print:hidden">
      {/* Mobile hamburger */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={onOpenMobile}
        className="focus-gold grid h-9 w-9 place-items-center rounded-lg border border-subtle bg-panel text-muted hover:border-gold/40 hover:text-gold lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Desktop collapse toggle */}
      <button
        type="button"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={onToggleCollapse}
        className="focus-gold hidden h-9 w-9 place-items-center rounded-lg border border-subtle bg-panel text-muted hover:border-gold/40 hover:text-gold lg:grid"
      >
        {collapsed ? (
          <PanelLeft className="h-5 w-5" />
        ) : (
          <PanelLeftClose className="h-5 w-5" />
        )}
      </button>

      <h1 className="font-condensed text-xl tracking-wide text-fg">{title}</h1>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <UserMenu name={name} email={email} />
      </div>
    </header>
  );
}
