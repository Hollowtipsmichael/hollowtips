"use server";

import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { error: string }> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: "Unauthorized" };

  if (!newPassword || newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: session.user.email },
  });
  if (!user) return { error: "Account not found." };

  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) return { error: "Current password is incorrect." };

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash },
  });
  return { ok: true };
}
