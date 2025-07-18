// src/app/admin/classes/[classId]/page.tsx

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import {
  Typography,
  Spin,
  Alert,
  Button,
  Space,
  message,
  Statistic,
  Card,
  Row,
  Col,
} from "antd";
import { UserAddOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import Link from "next/link";
import StudentsTable, { Student } from "@/app/components/students/StudentTable";
import AddStudentModal from "@/app/components/students/AddStudentModal";
import RecordPaymentModal from "@/app/components/payments/RecordPaymentModal";
import { useForm } from "antd/es/form/Form";

const { Title } = Typography;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface AddStudentValues {
  name: string;
  admissionNumber: string;
}

interface RecordPaymentValues {
  amount: number;
  method: string;
  reference?: string;
}

export default function ClassDetailPage() {
  const params = useParams();
  const { classId } = params;
  const { mutate } = useSWRConfig();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [addStudentForm] = useForm();
  const [recordPaymentForm] = useForm();

  const apiUrl = `/api/classes/${classId}`;
  const { data, error, isLoading } = useSWR(classId ? apiUrl : null, fetcher);

  const handleOpenRecordPayment = (student: Student) => {
    setSelectedStudent(student);
    setPaymentModalOpen(true);
  };

  const handleAddStudent = async (values: AddStudentValues) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        schoolClassId: classId,
      };
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to add student");
      }
      message.success("Student added successfully!");
      setAddModalOpen(false);
      addStudentForm.resetFields();
      mutate(apiUrl); // Re-fetch data for the table
    } catch (err) {
      message.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecordPaymentSubmit = async (values: RecordPaymentValues) => {
    if (!selectedStudent) return;
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        studentId: selectedStudent.id,
        // Assuming recordedBy is handled by session on backend
      };
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to record payment");
      }
      message.success("Payment recorded successfully!");
      setPaymentModalOpen(false);
      recordPaymentForm.resetFields();
      mutate(apiUrl); // Re-fetch data
      mutate("/api/dashboard"); // Also update dashboard data
    } catch (err) {
      message.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading)
    return <Spin size="large" style={{ display: "block", marginTop: 50 }} />;
  if (error || data?.error)
    return (
      <Alert
        message="Error"
        description={data?.error || "Failed to load class data."}
        type="error"
        showIcon
      />
    );

  const { classDetails, students } = data;
  const totalOutstanding = students.reduce(
    (sum: number, s: Student) => sum + s.balance,
    0
  );

  return (
    <div>
      <Space
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Link href="/admin/dashboard">
          <Button icon={<ArrowLeftOutlined />}>Back to Dashboard</Button>
        </Link>
        <Title level={2} style={{ margin: 0 }}>
          {classDetails.name}
        </Title>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setAddModalOpen(true)}
        >
          Add Student
        </Button>
      </Space>

      <Card style={{ marginBottom: 24 }}>
        <Row>
          <Col span={12}>
            <Statistic
              title="Term Fee per Student"
              value={classDetails.termFee}
              prefix="KES"
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Total Outstanding for Class"
              value={totalOutstanding}
              prefix="KES"
              valueStyle={{ color: "#cf1322" }}
            />
          </Col>
        </Row>
      </Card>

      <StudentsTable
        students={students}
        loading={isLoading}
        onRecordPayment={handleOpenRecordPayment}
      />

      <AddStudentModal
        open={addModalOpen}
        form={addStudentForm}
        submitting={submitting}
        onCancel={() => setAddModalOpen(false)}
        onFinish={handleAddStudent}
        // Pass initial class values if needed, but the API handles it
      />

      <RecordPaymentModal
        open={paymentModalOpen}
        form={recordPaymentForm}
        submitting={submitting}
        onCancel={() => setPaymentModalOpen(false)}
        onFinish={handleRecordPaymentSubmit}
        studentName={selectedStudent?.name}
      />
    </div>
  );
}
