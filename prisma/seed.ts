import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/slug";

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@hollowtips.com";
const ADMIN_PASSWORD = "ChangeMe123!";
const ADMIN_NAME = "Hollowtips Admin";

// The 10 real Hollowtips strains (Round 1 V1) — authoritative types from client.
const STRAINS: { name: string; productType: string; description: string }[] = [
  { name: "Candy Gat", productType: "INDICA", description: "Sweet candied gas — loud, smooth and dessert-forward." },
  { name: "Strawberry Staccato", productType: "INDICA", description: "Fresh strawberry candy with a smooth, balanced punch." },
  { name: "Mango Mac-10", productType: "HYBRID", description: "Juicy mango rush — bright, fast and uplifting." },
  { name: "Nina Pina", productType: "SATIVA", description: "Piña colada vibes — sweet pineapple and coconut cream." },
  { name: "Lava Cake Launcher", productType: "INDICA", description: "Rich chocolate lava cake — deep, heavy and indulgent." },
  { name: "Blueberry Buckshot", productType: "INDICA", description: "Jammy ripe blueberries with an earthy backbone." },
  { name: "Key Lime Glock", productType: "HYBRID", description: "Zesty key lime pie with a creamy graham finish." },
  { name: "Sorbet Shooter", productType: "HYBRID", description: "Cool, fruity sorbet on a calm, mellow exhale." },
  { name: "Trop Trigger", productType: "SATIVA", description: "Tropical pineapple-berry blast with a citrus kick." },
  { name: "Peach Pressure", productType: "SATIVA", description: "Ripe summer peach with a crisp, energizing lift." },
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

  // Seed the 10 strains (idempotent — upsert by slug) + a demo variant each.
  for (const s of STRAINS) {
    const slug = slugify(s.name);
    const product = await prisma.product.upsert({
      where: { slug },
      update: {
        name: s.name,
        productType: s.productType,
        description: s.description,
      },
      create: {
        name: s.name,
        slug,
        productType: s.productType,
        description: s.description,
        isActive: true,
      },
    });

    // One demo variant per product: "2G Disposable · Round 1 V1"
    const variantName = "2G Disposable · Round 1 V1";
    const existing = await prisma.productVariant.findFirst({
      where: { productId: product.id, name: variantName },
    });
    if (!existing) {
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: variantName,
          productType: s.productType,
          isActive: true,
        },
      });
    }
  }
  console.log(`  ✦ Seeded ${STRAINS.length} products (+1 variant each)\n`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
