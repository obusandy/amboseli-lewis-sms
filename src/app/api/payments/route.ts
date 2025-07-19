// src/app/api/payments/route.ts

import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.name) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { studentId, amount, method, reference, notes } = body;

    if (!studentId || !amount || !method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const student = await tx.student.findUnique({ where: { id: studentId } });
      if (!student) throw new Error("Student not found.");

      // ✅ THE NEW LOGIC: Find the current term. It's okay if it's null.
      const currentTerm = await tx.term.findFirst({
        where: { isCurrent: true },
      });

      // Create the payment record
      const payment = await tx.payment.create({
        data: {
          amount: parseFloat(amount),
          method: method,
          reference: reference || null,
          notes: notes || null,
          recordedBy: session.user.name!,
          student: { connect: { id: studentId } },
          // ✅ If a currentTerm exists, connect it. Otherwise, do nothing.
          // This works because the relation is now optional.
          term: currentTerm ? { connect: { id: currentTerm.id } } : undefined,
        },
      });

      // The logic to update arrears for graduated students remains the same and is correct.
      if (student.status === "GRADUATED") {
        const newArrears = student.arrears - parseFloat(amount);
        await tx.student.update({
          where: { id: studentId },
          data: { arrears: newArrears },
        });
      }

      return payment;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to record payment" },
      { status: 500 }
    );
  }
}
