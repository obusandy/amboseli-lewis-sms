import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

// --- TYPE DEFINITIONS ---
type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
type PromotableClassName = "Form 1" | "Form 2" | "Form 3" | "Form 4";
type StudentUpdatePromise = Prisma.Prisma__StudentClient<any, never>;

// --- HELPER 1: CALCULATE ARREARS ---
async function updateStudentArrears(tx: TransactionClient) {
  console.log("Updating student arrears...");
  const previousTerm = await tx.term.findFirst({ where: { isCurrent: true } });
  if (!previousTerm) {
    console.log("No previous term found. Skipping arrears calculation.");
    return;
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
  // OPTIMIZATION: Run updates in parallel to prevent timeouts
  const updatePromises = activeStudents.map((student) => {
    const totalBillForTerm = student.schoolClass.termFee + student.arrears;
    const totalPaidInTerm = student.payments.reduce(
      (sum: number, p: { amount: number }) => sum + p.amount,
      0
    );
    const newCumulativeArrears = totalBillForTerm - totalPaidInTerm;
    return tx.student.update({
      where: { id: student.id },
      data: { arrears: newCumulativeArrears },
    });
  });
  await Promise.all(updatePromises);
  console.log(`Arrears updated for ${activeStudents.length} students.`);
}

// --- HELPER 2: PROMOTE STUDENTS ---
async function promoteStudentsAndLog(
  tx: TransactionClient,
  adminName: string
): Promise<string | null> {
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
  if (studentsToPromote.length === 0) return null;

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

  const promotionUpdatePromises: StudentUpdatePromise[] = [];
  const recordsForLog = studentsToPromote.map((student) => {
    const currentClassName = student.schoolClass.name as PromotableClassName;
    const newClassId = promotionMap[currentClassName];
    if (!newClassId)
      throw new Error(
        `Could not find destination class for ${student.schoolClass.name}`
      );

    promotionUpdatePromises.push(
      tx.student.update({
        where: { id: student.id },
        data: {
          schoolClassId: newClassId,
          status:
            newClassId === classMap.get("Graduated") ? "GRADUATED" : "ACTIVE",
        },
      })
    );

    return {
      studentId: student.id,
      studentName: student.name,
      previousSchoolClassId: student.schoolClassId,
      newSchoolClassId: newClassId,
      promotionLogId: promotionLog.id,
    };
  });

  await Promise.all(promotionUpdatePromises);
  await tx.studentPromotionRecord.createMany({ data: recordsForLog });

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
    if (!name || !startDate || !endDate)
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );

    const existingTerm = await prisma.term.findUnique({ where: { name } });
    if (existingTerm)
      return NextResponse.json(
        { error: `A term with the name "${name}" already exists.` },
        { status: 409 }
      );

    const isNewAcademicYear = name.toLowerCase().includes("term 1");
    let promotionLogId: string | null = null;

    // Increase the timeout for this specific, long-running operation.
    const newTerm = await prisma.$transaction(
      async (tx) => {
        await updateStudentArrears(tx);
        if (isNewAcademicYear) {
          promotionLogId = await promoteStudentsAndLog(tx, session.user.name!);
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
      },
      {
        maxWait: 10000, // Wait up to 10 seconds
        timeout: 20000, // Allow transaction to run for 20 seconds
      }
    );

    let message = `New term "${newTerm.name}" started successfully. Arrears have been carried forward.`;
    if (promotionLogId) {
      message =
        "Students promoted, arrears updated, and new academic year started successfully!";
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
