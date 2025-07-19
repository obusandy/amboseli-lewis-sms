import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

export async function GET(
  request: Request,
  context: { params: { classId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { classId } = context.params;

  try {
    const currentTerm = await prisma.term.findFirst({
      where: { isCurrent: true },
    });

    const schoolClass = await prisma.schoolClass.findUnique({
      where: { id: classId },
    });

    if (!schoolClass) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const isGraduatedClass = schoolClass.name === "Graduated";

    const students = await prisma.student.findMany({
      where: {
        schoolClassId: classId,
        status: isGraduatedClass ? "GRADUATED" : "ACTIVE",
      },
      include: {
        // Only include payments for the current term if it's an active class
        payments:
          !isGraduatedClass && currentTerm
            ? { where: { termId: currentTerm.id } }
            : false,
      },
      orderBy: { name: "asc" },
    });

    const studentsWithDetails = students.map((student) => {
      let outstandingBalance = 0;

      if (isGraduatedClass) {
        // ✅ For graduated students, their balance IS their current arrears.
        // This value is now updated directly by the payment API.
        outstandingBalance = student.arrears;
      } else {
        const totalPaidInTerm = student.payments.reduce(
          (sum, p) => sum + p.amount,
          0
        );
        outstandingBalance =
          schoolClass.termFee + student.arrears - totalPaidInTerm;
      }

      return {
        id: student.id,
        name: student.name,
        admissionNumber: student.admissionNumber,
        class: schoolClass.name,
        balance: outstandingBalance,
      };
    });

    const classDetails = {
      id: schoolClass.id,
      name: schoolClass.name,
      termFee: schoolClass.termFee,
    };

    return NextResponse.json({
      classDetails,
      students: studentsWithDetails,
    });
  } catch (error) {
    console.error(`Error fetching class ${classId}:`, error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
