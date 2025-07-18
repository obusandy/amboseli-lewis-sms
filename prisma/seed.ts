// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // Define the school classes we need
  const classesToCreate = [
    { name: "Form 1", termFee: 15000 },
    { name: "Form 2", termFee: 16000 },
    { name: "Form 3", termFee: 17000 },
    { name: "Form 4", termFee: 18000 },
    { name: "Graduated", termFee: 0 }, // Graduated students have no fee
  ];

  for (const classData of classesToCreate) {
    // Use `upsert` to avoid creating duplicate classes if the script is run again.
    // It will try to find a class by its unique `name`.
    // If it finds one, it updates it. If not, it creates it.
    await prisma.schoolClass.upsert({
      where: { name: classData.name },
      update: {}, // We don't need to update anything if it exists
      create: {
        name: classData.name,
        termFee: classData.termFee,
      },
    });
    console.log(`Created/verified class: ${classData.name}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
