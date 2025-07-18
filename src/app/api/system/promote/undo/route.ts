// src/app/api/system/promote/undo/route.ts

import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { promotionLogId } = await request.json();
    if (!promotionLogId) {
      return NextResponse.json(
        { error: "Missing Promotion Log ID." },
        { status: 400 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // 1. Find the log and check if it can be rolled back
      const promotionLog = await tx.promotionLog.findUnique({
        where: { id: promotionLogId },
      });

      if (!promotionLog) {
        throw new Error("Promotion event not found.");
      }
      if (promotionLog.status === "ROLLED_BACK") {
        throw new Error("This promotion has already been undone.");
      }

      // 2. Get all the records for this promotion
      const recordsToUndo = await tx.studentPromotionRecord.findMany({
        where: { promotionLogId: promotionLog.id },
      });

      // 3. Reverse each student's promotion
      for (const record of recordsToUndo) {
        await tx.student.update({
          where: { id: record.studentId },
          data: {
            schoolClassId: record.previousSchoolClassId,
            status: "ACTIVE", // Set everyone back to active
          },
        });
      }

      // 4. Mark the log as rolled back to prevent double-undos
      await tx.promotionLog.update({
        where: { id: promotionLogId },
        data: { status: "ROLLED_BACK" },
      });
    });

    return NextResponse.json({
      message: "Promotion has been successfully undone.",
    });
  } catch (error) {
    console.error("Failed to undo promotion:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
