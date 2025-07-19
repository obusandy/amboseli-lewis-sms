import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentTerm = await prisma.term.findFirst({
      where: { isCurrent: true },
    });
    if (!currentTerm) {
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

    const allDbClasses = await prisma.schoolClass.findMany({
      orderBy: { name: "asc" },
      include: { students: true },
    });

    const paymentsInTerm = await prisma.payment.findMany({
      where: { termId: currentTerm.id },
    });

    const classData = allDbClasses.map((schoolClass) => {
      const isGraduatedClass = schoolClass.name === "Graduated";
      const relevantStudents = schoolClass.students.filter((s) =>
        isGraduatedClass ? s.status === "GRADUATED" : s.status === "ACTIVE"
      );

      const studentCount = relevantStudents.length;
      const studentIdsInClass = relevantStudents.map((s) => s.id);

      const classArrears = relevantStudents.reduce(
        (sum, s) => sum + s.arrears,
        0
      );
      const classTermFeeComponent = isGraduatedClass
        ? 0
        : studentCount * schoolClass.termFee;
      const classTarget = classTermFeeComponent + classArrears;

      const classPaidThisTerm = paymentsInTerm
        .filter((p) => studentIdsInClass.includes(p.studentId))
        .reduce((sum, p) => sum + p.amount, 0);

      const classOutstanding = classTarget - classPaidThisTerm;

      return {
        id: schoolClass.id,
        name: schoolClass.name,
        termFee: schoolClass.termFee,
        studentCount,
        totalPaid: classPaidThisTerm,
        totalOutstanding: classOutstanding,
        target: classTarget,
      };
    });

    // --- FINAL STATS CALCULATION (Focus on ACTIVE students) ---
    const activeClassData = classData.filter((cls) => cls.name !== "Graduated");
    const totalOutstandingForActiveStudents = activeClassData.reduce(
      (sum, cls) => sum + cls.totalOutstanding,
      0
    );
    const totalPaidThisTerm = activeClassData.reduce(
      (sum, cls) => sum + cls.totalPaid,
      0
    );
    const totalActiveStudents = activeClassData.reduce(
      (sum, cls) => sum + cls.studentCount,
      0
    );
    const termFeeTarget = activeClassData.reduce(
      (sum, cls) => sum + cls.studentCount * cls.termFee,
      0
    );
    const termOutstanding = termFeeTarget - totalPaidThisTerm;

    return NextResponse.json({
      currentTerm,
      stats: {
        totalActiveStudents,
        totalPaid: totalPaidThisTerm,
        termOutstanding: termOutstanding > 0 ? termOutstanding : 0,
        totalOutstanding:
          totalOutstandingForActiveStudents > 0
            ? totalOutstandingForActiveStudents
            : 0,
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
