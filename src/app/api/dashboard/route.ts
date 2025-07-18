import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentTerm = await prisma.term.findFirst({
      where: { isCurrent: true },
    });

    if (!currentTerm) {
      // Return a clean, empty state if no term is active
      return NextResponse.json({
        currentTerm: null,
        stats: {
          totalActiveStudents: 0,
          totalPaid: 0,
          termOutstanding: 0,
          totalOutstanding: 0,
        },
        classData: [],
      });
    }

    // 1. Fetch all classes to build the grid.
    const allDbClasses = await prisma.schoolClass.findMany({
      orderBy: { name: "asc" },
    });

    // 2. Fetch all students (active and graduated) to get their arrears and status.
    const allDbStudents = await prisma.student.findMany({
      select: { id: true, arrears: true, status: true, schoolClassId: true },
    });

    // 3. Fetch all payments for the current term. This is our "total collected".
    const paymentsInTerm = await prisma.payment.findMany({
      where: { termId: currentTerm.id },
    });
    const totalPaidThisTerm = paymentsInTerm.reduce(
      (sum, p) => sum + p.amount,
      0
    );

    // --- 4. CALCULATE DETAILED STATS ---

    // Calculate the total historical debt from ALL students (active and graduated).
    const totalArrearsFromAllStudents = allDbStudents.reduce(
      (sum, s) => sum + s.arrears,
      0
    );

    // Isolate active students for term-specific calculations.
    const activeStudents = allDbStudents.filter((s) => s.status === "ACTIVE");
    const totalActiveStudents = activeStudents.length;

    let termFeeTarget = 0; // This will be the sum of all active students' term fees.

    // Process data for each class card
    const classData = allDbClasses.map((schoolClass) => {
      let studentCount: number;
      let classArrears: number = 0;
      let classTermFeeComponent: number = 0;
      let classStudentIds: string[] = [];

      if (schoolClass.name === "Graduated") {
        const graduatedStudents = allDbStudents.filter(
          (s) => s.schoolClassId === schoolClass.id && s.status === "GRADUATED"
        );
        studentCount = graduatedStudents.length;
        // A graduate's debt is only their final arrears.
        classArrears = graduatedStudents.reduce((sum, s) => sum + s.arrears, 0);
      } else {
        const studentsInClass = activeStudents.filter(
          (s) => s.schoolClassId === schoolClass.id
        );
        studentCount = studentsInClass.length;
        classArrears = studentsInClass.reduce((sum, s) => sum + s.arrears, 0);
        classTermFeeComponent = studentCount * schoolClass.termFee;
        classStudentIds = studentsInClass.map((s) => s.id);
        // Add this class's term fee total to the school-wide total.
        termFeeTarget += classTermFeeComponent;
      }

      const classPaidThisTerm = paymentsInTerm
        .filter((p) => classStudentIds.includes(p.studentId))
        .reduce((sum, p) => sum + p.amount, 0);

      const classTotalBill = classTermFeeComponent + classArrears;
      const classOutstanding = classTotalBill - classPaidThisTerm;

      return {
        id: schoolClass.id,
        name: schoolClass.name,
        termFee: schoolClass.termFee,
        studentCount,
        totalPaid: classPaidThisTerm,
        totalOutstanding: classOutstanding,
        target: classTotalBill,
      };
    });

    // --- 5. CALCULATE FINAL, DISTINCT STATS FOR THE TOP CARDS ---

    // Outstanding amount from this term's fees only.
    const termOutstanding = termFeeTarget - totalPaidThisTerm;

    // The grand total of all money owed to the school.
    const totalOutstanding = termOutstanding + totalArrearsFromAllStudents;

    return NextResponse.json({
      currentTerm,
      stats: {
        totalActiveStudents: totalActiveStudents,
        totalPaid: totalPaidThisTerm,
        termOutstanding: termOutstanding > 0 ? termOutstanding : 0,
        totalOutstanding: totalOutstanding > 0 ? totalOutstanding : 0,
      },
      classData,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
