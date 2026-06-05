import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function ShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Middleware already guards /admin/**, but double-check on the server so we
  // always have a real user to render the shell with.
  if (!session?.user) redirect("/admin/login");

  return (
    <AdminShell
      name={session.user.name ?? "Admin"}
      email={session.user.email ?? ""}
    >
      {children}
    </AdminShell>
  );
}
