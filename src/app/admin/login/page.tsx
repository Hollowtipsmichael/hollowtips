import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { MatrixBg } from "@/components/brand/MatrixBg";
import { HollowtipsLogo } from "@/components/brand/HollowtipsLogo";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = {
  title: "Sign In — Hollowtips Verify",
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/admin");

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-black px-4 py-12">
      {/* Same cinematic Matrix backdrop as the homepage (includes its vignette) */}
      <div className="absolute inset-0 z-0">
        <MatrixBg />
      </div>

      {/* Login card */}
      <div className="relative z-20 w-full max-w-md animate-fade-in">
        <div className="mb-8 flex flex-col items-center text-center">
          <HollowtipsLogo variant="full" size={52} withTagline />
          <p className="mt-5 text-sm tracking-wide text-white/60">
            Product Verification — Admin Console
          </p>
        </div>

        <div className="grain relative overflow-hidden rounded-2xl border border-gold/20 bg-[#0c0c0c]/80 p-7 shadow-gold-glow backdrop-blur-xl sm:p-8">
          <div className="rule-gold mb-6" />
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          © {new Date().getFullYear()} Hollowtips. Authorized personnel only.
        </p>
      </div>
    </main>
  );
}
