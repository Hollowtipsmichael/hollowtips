import { withAuth } from "next-auth/middleware";

// Protect all /admin/** routes. NextAuth's middleware automatically lets the
// configured signIn page (/admin/login) through, so there's no redirect loop.
export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
