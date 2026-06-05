import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@hollowtips.com";
const ADMIN_PASSWORD = "ChangeMe123!";
const ADMIN_NAME = "Hollowtips Admin";

// The 10 real Hollowtips 2G strains.
const STRAINS: { name: string; strainName: string; description: string }[] = [
  { name: "Trop Trigger", strainName: "Sativa", description: "Tropical pineapple-berry blast with a citrus kick." },
  { name: "Candy Gat", strainName: "Hybrid", description: "Sweet candied gas — loud, smooth and dessert-forward." },
  { name: "Key Lime Glock", strainName: "Hybrid", description: "Zesty key lime pie with a creamy graham finish." },
  { name: "Sorbet Shooter", strainName: "Indica", description: "Cool, fruity sorbet on a calm, mellow exhale." },
  { name: "Lava Cake Launcher", strainName: "Indica", description: "Rich chocolate lava cake — deep, heavy and indulgent." },
  { name: "Blueberry Buckshot", strainName: "Indica", description: "Jammy ripe blueberries with an earthy backbone." },
  { name: "Mango Mach-10", strainName: "Sativa", description: "Juicy mango rush — bright, fast and uplifting." },
  { name: "Nina Pina", strainName: "Hybrid", description: "Piña colada vibes — sweet pineapple and coconut cream." },
  { name: "Strawberry Staccato", strainName: "Hybrid", description: "Fresh strawberry candy with a smooth, balanced punch." },
  { name: "Peach Pressure", strainName: "Sativa", description: "Ripe summer peach with a crisp, energizing lift." },
];

async function main() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: ADMIN_NAME, passwordHash, role: "ADMIN" },
    create: {
      email: ADMIN_EMAIL,
      passwordHash,
      name: ADMIN_NAME,
      role: "ADMIN",
    },
  });

  console.log("\n────────────────────────────────────────────");
  console.log("  ✦ Hollowtips Verify — admin seeded");
  console.log("────────────────────────────────────────────");
  console.log(`  Login at:  /admin/login`);
  console.log(`  Email:     ${admin.email}`);
  console.log(`  Password:  ${ADMIN_PASSWORD}`);
  console.log("  (change this password after first login)");
  console.log("────────────────────────────────────────────\n");

  // Seed the 10 strains (idempotent — upsert by slug).
  for (const s of STRAINS) {
    const slug = slugify(s.name);
    await prisma.product.upsert({
      where: { slug },
      update: { name: s.name, strainName: s.strainName, description: s.description },
      create: {
        name: s.name,
        slug,
        strainName: s.strainName,
        description: s.description,
        isActive: true,
      },
    });
  }
  console.log(`  ✦ Seeded ${STRAINS.length} products (strains)\n`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
