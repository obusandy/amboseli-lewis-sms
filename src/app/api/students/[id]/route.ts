import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// This function handles "deleting" a student by archiving them.
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const session = await getServerAuthSession();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const studentId = context.params.id;

  try {
    const archivedStudent = await prisma.$transaction(async (tx) => {
      const student = await tx.student.findUnique({
        where: { id: studentId },
        include: {
          schoolClass: true,
          payments: { where: { term: { isCurrent: true } } },
        },
      });
      if (!student) throw new Error("Student not found.");
      if (student.status === "GRADUATED")
        throw new Error("Student is already archived.");

      const graduatedClass = await tx.schoolClass.findUnique({
        where: { name: "Graduated" },
      });
      if (!graduatedClass)
        throw new Error("'Graduated' class must exist to archive students.");

      const totalBillForTerm = student.schoolClass.termFee + student.arrears;
      const totalPaidInTerm = student.payments.reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const finalArrears = totalBillForTerm - totalPaidInTerm;

      return tx.student.update({
        where: { id: studentId },
        data: {
          status: "GRADUATED",
          schoolClassId: graduatedClass.id,
          arrears: finalArrears,
        },
      });
    });

    return NextResponse.json({
      message: "Student has been successfully archived.",
      student: archivedStudent,
    });
  } catch (error) {
    console.error(`Failed to archive student ${studentId}:`, error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
