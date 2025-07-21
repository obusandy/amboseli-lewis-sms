// scripts/create-admin.js

import { PrismaClient } from "@prisma/client";
// --- THIS IS THE FIX ---
// We change how 'hash' is imported from bcryptjs.
import bcrypt from "bcryptjs";
const { hash } = bcrypt;
// --------------------

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    // I see you've chosen a new, strong password. Excellent!
    const hashedPassword = await hash("Amboseli@admin1234", 10);

    const admin = await prisma.user.create({
      data: {
        email: "admin@amboseli.com",
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user created:", admin);
  } catch (error) {
    // This will catch the 'duplicate user' error if you run it twice.
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
