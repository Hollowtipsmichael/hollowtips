import { redirect } from "next/navigation";

export default function Home() {
  // This step builds only the admin. Send everyone to the admin entry point;
  // middleware will route unauthenticated users to /admin/login.
  redirect("/admin");
}
