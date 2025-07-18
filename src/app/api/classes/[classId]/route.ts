// src/app/api/classes/[classId]/route.ts

import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";

// ✅ FIX 1: The function signature is corrected to the standard pattern.
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

    let studentWhereCondition = {};
    if (schoolClass.name === "Graduated") {
      studentWhereCondition = { status: "GRADUATED" };
    } else {
      studentWhereCondition = { status: "ACTIVE" };
    }

    const students = await prisma.student.findMany({
      where: {
        schoolClassId: classId,
        ...studentWhereCondition,
      },
      include: {
        payments: currentTerm ? { where: { termId: currentTerm.id } } : false,
      },
      orderBy: { name: "asc" },
    });

    const studentsWithDetails = students.map((student) => {
      let outstandingBalance = 0;

      if (schoolClass.name === "Graduated") {
        outstandingBalance = student.arrears;
      } else {
        const totalPaidInTerm = student.payments.reduce(
          (sum, p) => sum + p.amount,
          0
        );

        // ✅ FIX 2: Corrected the variable name from `studentArrears` to `student.arrears`.
        outstandingBalance =
          schoolClass.termFee + student.arrears - totalPaidInTerm;
      }

      return {
        // Spread the original student object to get all its properties
        ...student,
        // Overwrite/add the calculated and class-specific properties
        class: schoolClass.name,
        termFee: schoolClass.termFee,
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
