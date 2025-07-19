import { getServerAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, admissionNumber, schoolClassId } = body;

    if (!name || !admissionNumber || !schoolClassId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: name, admissionNumber, schoolClassId",
        },
        { status: 400 }
      );
    }

    const student = await prisma.student.create({
      data: {
        name,
        admissionNumber,
        schoolClass: {
          connect: {
            id: schoolClassId,
          },
        },
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("Student creation error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "A student with this admission number already exists." },
          { status: 409 }
        );
      }
      if (error.code === "P2025") {
        return NextResponse.json(
          { error: "The specified class does not exist." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "An unexpected internal server error occurred" },
      { status: 500 }
    );
  }
}
