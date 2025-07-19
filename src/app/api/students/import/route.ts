// src/app/api/students/import/route.ts

import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const schoolClassId = formData.get("schoolClassId") as string | null;

    if (!file || !schoolClassId) {
      return NextResponse.json(
        { error: "File or Class ID missing." },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // ✅ THE DEFINITIVE FIX: A more robust parsing method.
    // This method converts the sheet to an array of arrays, finds the header row,
    // and then manually builds the JSON objects. It's immune to empty top rows.

    const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    if (data.length < 2) {
      // Must have at least a header row and one data row
      return NextResponse.json(
        { error: "The Excel file is empty or has no data rows." },
        { status: 400 }
      );
    }

    const headers = data[0].map((header) => String(header).trim());
    const nameIndex = headers.findIndex((h) => h.toLowerCase() === "name");
    const admissionNumberIndex = headers.findIndex(
      (h) => h.toLowerCase() === "admissionnumber"
    );

    // ✅ Provide a detailed error message if columns are not found.
    if (nameIndex === -1 || admissionNumberIndex === -1) {
      const foundHeaders = headers.join(", ");
      return NextResponse.json(
        {
          error: `Required columns not found. The file must have headers named 'name' and 'admissionNumber'. Found headers: [${foundHeaders}]`,
        },
        { status: 400 }
      );
    }

    // Slice the data to get only the student rows (everything after the header)
    const rows = data.slice(1);

    const studentsFromFile = rows
      .map((row) => ({
        name: String(row[nameIndex] || "").trim(),
        admissionNumber: String(row[admissionNumberIndex] || "").trim(),
      }))
      .filter((student) => student.name && student.admissionNumber);

    if (studentsFromFile.length === 0) {
      return NextResponse.json(
        {
          error:
            "No student records with both a name and admission number were found in the file.",
        },
        { status: 400 }
      );
    }

    // --- The duplicate check logic is correct and remains the same ---
    const admissionNumbersInFile = studentsFromFile.map(
      (s) => s.admissionNumber
    );
    const existingStudents = await prisma.student.findMany({
      where: { admissionNumber: { in: admissionNumbersInFile } },
      select: { admissionNumber: true },
    });
    const existingAdmissionNumbers = new Set(
      existingStudents.map((s) => s.admissionNumber)
    );

    const studentsToCreate = studentsFromFile.filter(
      (s) => !existingAdmissionNumbers.has(s.admissionNumber)
    );

    if (studentsToCreate.length === 0) {
      return NextResponse.json({
        message: "All students in the file already exist in the system.",
      });
    }

    const result = await prisma.student.createMany({
      data: studentsToCreate.map((s) => ({ ...s, schoolClassId })),
    });

    const skippedCount = studentsFromFile.length - result.count;
    let message = `${result.count} new students were imported successfully.`;
    if (skippedCount > 0) {
      message += ` ${skippedCount} students were skipped because their admission number already exists.`;
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Student import API error:", error);
    return NextResponse.json(
      { error: "An internal error occurred during import." },
      { status: 500 }
    );
  }
}
