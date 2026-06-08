import { getServerSession } from "next-auth";
import { UserCog, ShieldCheck } from "lucide-react";
import { authOptions } from "@/lib/auth";
import { ChangePasswordForm } from "@/components/admin/settings/ChangePasswordForm";

export const metadata = { title: "Settings — Hollowtips Verify" };
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-1.5">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gold">
          Account
        </p>
        <h2 className="font-display text-3xl tracking-wide text-fg">Settings</h2>
      </div>

      <div className="rule-gold" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="card p-5 sm:p-6">
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg tracking-wide text-fg">
            <UserCog className="h-4 w-4 text-gold" />
            Profile
          </h3>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Name</dt>
              <dd className="text-fg">{user?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Email</dt>
              <dd className="text-fg">{user?.email ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Role</dt>
              <dd className="text-fg">{user?.role ?? "ADMIN"}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-5 sm:p-6">
          <h3 className="mb-4 flex items-center gap-2 font-display text-lg tracking-wide text-fg">
            <ShieldCheck className="h-4 w-4 text-gold" />
            Change password
          </h3>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
