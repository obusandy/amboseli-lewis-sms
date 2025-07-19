// src/app/api/classes/route.ts

import { authOptions, getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

// GET handler to fetch all classes
export async function GET() {
  const session = await getServerAuthSession();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const classes = await prisma.schoolClass.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Failed to fetch classes:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching classes." },
      { status: 500 }
    );
  }
}

// PUT handler to update a class's fee
export async function PUT(request: Request) {
  const session = await getServerAuthSession();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, termFee } = await request.json();
    if (!id || termFee === undefined) {
      return NextResponse.json(
        { error: "Missing class ID or term fee" },
        { status: 400 }
      );
    }

    const updatedClass = await prisma.schoolClass.update({
      where: { id },
      data: { termFee: parseFloat(termFee) },
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error("Failed to update class:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "The specified class does not exist." },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while updating the class." },
      { status: 500 }
    );
  }
}
