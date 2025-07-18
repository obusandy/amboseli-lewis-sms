// src/app/api/system/promote/route.ts

import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"; // Import Prisma types for error handling
import { getServerSession } from "next-auth/next";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // A transaction ensures that if one part fails, the whole operation is rolled back.
    await prisma.$transaction(async (tx) => {
      // 1. Find the relevant class IDs
      const classes = await tx.schoolClass.findMany({
        select: { id: true, name: true }, // Select only the fields you need
        where: {
          name: { in: ["Form 1", "Form 2", "Form 3", "Form 4", "Graduated"] },
        },
      });

      const classMap = classes.reduce((acc, cls) => {
        acc[cls.name] = cls.id;
        return acc;
      }, {} as Record<string, string>);

      // Check if all required classes were found
      const requiredClasses = [
        "Form 1",
        "Form 2",
        "Form 3",
        "Form 4",
        "Graduated",
      ];
      for (const className of requiredClasses) {
        if (!classMap[className]) {
          throw new Error(
            `The class "${className}" is not defined in the database. Promotion cannot proceed.`
          );
        }
      }

      // 2. Graduate Form 4 students
      await tx.student.updateMany({
        where: { schoolClassId: classMap["Form 4"] },
        data: {
          schoolClassId: classMap["Graduated"],
          status: "GRADUATED",
        },
      });

      // 3. Promote Form 3 to Form 4 (IMPORTANT: Go from highest to lowest)
      await tx.student.updateMany({
        where: { schoolClassId: classMap["Form 3"] },
        data: { schoolClassId: classMap["Form 4"] },
      });

      // 4. Promote Form 2 to Form 3
      await tx.student.updateMany({
        where: { schoolClassId: classMap["Form 2"] },
        data: { schoolClassId: classMap["Form 3"] },
      });

      // 5. Promote Form 1 to Form 2
      await tx.student.updateMany({
        where: { schoolClassId: classMap["Form 1"] },
        data: { schoolClassId: classMap["Form 2"] },
      });
    });

    return NextResponse.json({ message: "Students promoted successfully." });
  } catch (error) {
    // ✅ `error` is now `unknown`
    console.error("Failed to promote students:", error);

    // ✅ Handle Prisma-specific transaction errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // This can happen if there's a database-level issue during the transaction
      return NextResponse.json(
        {
          error: `A database error occurred during promotion: ${error.message}`,
        },
        { status: 500 }
      );
    }

    // ✅ Handle errors thrown explicitly from within the transaction (like missing classes)
    if (error instanceof Error) {
      // For custom errors thrown by us, a 400 Bad Request is more appropriate
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // ✅ Fallback for any other type of error
    return NextResponse.json(
      {
        error: "An unexpected internal server error occurred during promotion.",
      },
      { status: 500 }
    );
  }
}
