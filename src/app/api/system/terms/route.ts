import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

// --- TYPE DEFINITIONS for clarity and safety ---
type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
type PromotableClassName = "Form 1" | "Form 2" | "Form 3" | "Form 4";

// --- HELPER FUNCTION: This contains the complete, corrected end-of-year logic. ---

/**
 * Handles the entire end-of-year process in the correct order:
 * 1. Calculates cumulative arrears based on the term that is ending.
 * 2. Promotes students to their next class.
 * 3. Creates a detailed log of the promotion to enable an "undo" action.
 *
 * @param tx - The Prisma transaction client.
 * @param adminName - The name of the administrator triggering the process.
 * @returns The ID of the promotion log, or null if no students were promoted.
 */
async function endOfAcademicYearProcess(
  tx: TransactionClient,
  adminName: string
): Promise<string | null> {
  console.log("Starting End-of-Year process (Arrears + Promotion)...");

  // --- STAGE 1: CALCULATE AND LOCK IN CUMULATIVE ARREARS ---
  const previousTerm = await tx.term.findFirst({ where: { isCurrent: true } });
  if (!previousTerm) {
    throw new Error(
      "Cannot run end-of-year process: No current term found to calculate arrears from."
    );
  }

  const activeStudents = await tx.student.findMany({
    where: { status: "ACTIVE" },
    select: {
      id: true,
      arrears: true,
      schoolClass: { select: { termFee: true } },
      payments: {
        where: { termId: previousTerm.id },
        select: { amount: true },
      },
    },
  });

  for (const student of activeStudents) {
    const totalBillForTerm = student.schoolClass.termFee + student.arrears;
    const totalPaidInTerm = student.payments.reduce(
      (sum: number, p: { amount: number }) => sum + p.amount,
      0
    );
    const newCumulativeArrears = totalBillForTerm - totalPaidInTerm;

    await tx.student.update({
      where: { id: student.id },
      data: { arrears: newCumulativeArrears > 0 ? newCumulativeArrears : 0 },
    });
  }
  console.log(
    `Cumulative arrears updated for ${activeStudents.length} students.`
  );

  // --- STAGE 2: PROMOTE STUDENTS ---
  console.log("Promoting students...");
  const studentsToPromote = await tx.student.findMany({
    where: {
      schoolClass: { name: { in: ["Form 1", "Form 2", "Form 3", "Form 4"] } },
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      schoolClassId: true,
      schoolClass: { select: { name: true } },
    },
  });

  if (studentsToPromote.length === 0) {
    console.log("No students to promote. End-of-Year process complete.");
    return null;
  }

  const classes = await tx.schoolClass.findMany({
    where: { name: { in: ["Form 2", "Form 3", "Form 4", "Graduated"] } },
    select: { id: true, name: true },
  });
  const classMap = new Map(classes.map((cls) => [cls.name, cls.id]));
  const promotionMap: Record<PromotableClassName, string | undefined> = {
    "Form 1": classMap.get("Form 2"),
    "Form 2": classMap.get("Form 3"),
    "Form 3": classMap.get("Form 4"),
    "Form 4": classMap.get("Graduated"),
  };
  const promotionLog = await tx.promotionLog.create({
    data: { triggeredBy: adminName },
  });

  const recordsForLog: {
    studentId: string;
    studentName: string;
    previousSchoolClassId: string;
    newSchoolClassId: string;
    promotionLogId: string;
  }[] = [];

  for (const student of studentsToPromote) {
    const currentClassName = student.schoolClass.name as PromotableClassName;
    const newClassId = promotionMap[currentClassName];
    if (!newClassId)
      throw new Error(
        `Could not find destination class for ${student.schoolClass.name}`
      );

    // Update the student's record immediately
    await tx.student.update({
      where: { id: student.id },
      data: {
        schoolClassId: newClassId,
        status:
          newClassId === classMap.get("Graduated") ? "GRADUATED" : "ACTIVE",
      },
    });

    // Add the details of this successful operation to our log array
    recordsForLog.push({
      studentId: student.id,
      studentName: student.name,
      previousSchoolClassId: student.schoolClassId,
      newSchoolClassId: newClassId,
      promotionLogId: promotionLog.id,
    });
  }

  // Now, create all the log records in one batch operation
  await tx.studentPromotionRecord.createMany({ data: recordsForLog });

  console.log("Promotion completed successfully.");
  return promotionLog.id;
}

// --- MAIN API ROUTE HANDLER ---
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.name || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, startDate, endDate } = body;
    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingTerm = await prisma.term.findUnique({ where: { name } });
    if (existingTerm) {
      return NextResponse.json(
        { error: `A term with the name "${name}" already exists.` },
        { status: 409 }
      );
    }

    const isNewAcademicYear = name.toLowerCase().includes("term 1");
    let promotionLogId: string | null = null;

    const newTerm = await prisma.$transaction(async (tx) => {
      // If it's a new academic year, run the combined end-of-year process.
      if (isNewAcademicYear) {
        promotionLogId = await endOfAcademicYearProcess(tx, session.user.name!);
      }

      await tx.term.updateMany({
        where: { isCurrent: true },
        data: { isCurrent: false },
      });
      return tx.term.create({
        data: {
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isCurrent: true,
        },
      });
    });

    let message = `New term "${newTerm.name}" started successfully.`;
    if (isNewAcademicYear) {
      message =
        "End-of-year process complete: Arrears updated and students promoted!";
    }

    return NextResponse.json({ message, term: newTerm, promotionLogId });
  } catch (error) {
    console.error("Failed to start new term:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
