// src/app/api/students/[id]/payments/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerAuthSession();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = context.params.id;

  try {
    const payments = await prisma.payment.findMany({
      where: { studentId: studentId },
      include: {
        term: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(payments);
  } catch (error) {
    console.error(`Error fetching payments for student ${studentId}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
