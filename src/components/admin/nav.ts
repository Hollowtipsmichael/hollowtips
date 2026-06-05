import {
  LayoutDashboard,
  Package,
  QrCode,
  ScanLine,
  BarChart3,
  Mail,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Codes", href: "/admin/codes", icon: QrCode },
  { label: "Scans", href: "/admin/scans", icon: ScanLine },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Emails", href: "/admin/emails", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

/** Resolve the page title for the topbar from the current pathname. */
export function titleForPath(pathname: string): string {
  if (pathname === "/admin") return "Dashboard";
  const match = NAV_ITEMS.find(
    (item) => item.href !== "/admin" && pathname.startsWith(item.href),
  );
  return match?.label ?? "Dashboard";
}
