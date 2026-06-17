import { getServerSession } from "next-auth";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  BadgeCheck,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChangePasswordForm } from "@/components/admin/settings/ChangePasswordForm";

export const metadata = { title: "Settings — Hollowtips Verify" };
export const dynamic = "force-dynamic";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email ?? "";
  const admin = email
    ? await prisma.adminUser.findUnique({ where: { email } })
    : null;

  const name = admin?.name ?? session?.user?.name ?? "Admin";
  const role = admin?.role ?? session?.user?.role ?? "ADMIN";
  const since = admin?.createdAt
    ? admin.createdAt.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

  const rows = [
    { icon: User, label: "Name", value: name },
    { icon: Mail, label: "Email", value: email || "—" },
    { icon: ShieldCheck, label: "Role", value: role },
    { icon: CalendarDays, label: "Member since", value: since },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
          Account
        </p>
        <h2 className="font-display text-3xl tracking-wide text-fg">Settings</h2>
        <p className="text-sm text-muted">
          Manage your admin profile and security.
        </p>
      </div>

      <div className="rule-gold" />

      {/* Identity banner */}
      <div className="card grain relative overflow-hidden p-6 sm:p-7">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gold-gradient text-2xl font-bold text-black shadow-gold-glow">
            {initials(name)}
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-2xl tracking-wide text-fg">
              {name}
            </h3>
            <p className="truncate text-sm text-muted">{email}</p>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
              <BadgeCheck className="h-3.5 w-3.5" />
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Details + password */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-5 flex items-center gap-2 font-display text-lg tracking-wide text-fg">
            <User className="h-4 w-4 text-gold" />
            Profile details
          </h3>
          <dl className="divide-y divide-subtle/70">
            {rows.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.label}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <dt className="flex items-center gap-2 text-sm text-muted">
                    <Icon className="h-4 w-4 text-muted/70" />
                    {r.label}
                  </dt>
                  <dd className="truncate text-sm font-medium text-fg">
                    {r.value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="card p-6">
          <h3 className="mb-1 flex items-center gap-2 font-display text-lg tracking-wide text-fg">
            <ShieldCheck className="h-4 w-4 text-gold" />
            Change password
          </h3>
          <p className="mb-5 text-xs text-muted">
            Use a strong password you don&apos;t reuse elsewhere.
          </p>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
