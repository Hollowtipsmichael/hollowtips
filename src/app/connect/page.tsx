import { redirect } from "next/navigation";

/**
 * The giveaway/community-capture flow moved to /giveaway (GTA-6 + The Chamber).
 * Keep /connect working for any old links by redirecting.
 */
export default function ConnectPage() {
  redirect("/giveaway");
}
