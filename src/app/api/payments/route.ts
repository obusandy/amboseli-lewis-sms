import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.name) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { studentId, amount, method, reference, notes } = body;

    if (!studentId || !amount || !method) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Find the current active term
    const currentTerm = await prisma.term.findFirst({
      where: { isCurrent: true },
    });

    if (!currentTerm) {
      return NextResponse.json(
        { error: "No active term found. Cannot record payment." },
        { status: 400 }
      );
    }

    // 2. Create the payment record with the correct fields
    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(amount),
        method: method,
        reference: reference || null,
        notes: notes || null,
        recordedBy: session.user.name, // Get name from the session
        student: {
          connect: { id: studentId },
        },
        term: {
          connect: { id: currentTerm.id },
        },
      },
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
