"use client";
import { useState, useRef } from "react";
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
  Form,
} from "antd";
import {
  UserAddOutlined,
  ArrowLeftOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import StudentsTable, {
  StudentDisplayData,
} from "@/app/components/students/StudentTable";
import AddStudentModal from "@/app/components/students/AddStudentModal";
import RecordPaymentModal from "@/app/components/payments/RecordPaymentModal";
import PaymentHistoryModal from "@/app/components/payments/PaymentHistoryModal";

const { Title } = Typography;
const { useForm } = Form;

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
  const classId = params.classId as string;
  const { mutate } = useSWRConfig();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentDisplayData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [addStudentForm] = useForm<AddStudentValues>();
  const [recordPaymentForm] = useForm<RecordPaymentValues>();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = classId ? `/api/classes/${classId}` : null;
  const { data, error, isLoading } = useSWR(apiUrl, fetcher);

  // --- Modal Handlers ---
  const handleOpenRecordPayment = (student: StudentDisplayData) => {
    setSelectedStudent(student);
    recordPaymentForm.resetFields();
    setPaymentModalOpen(true);
  };

  const handleOpenHistory = (student: StudentDisplayData) => {
    setSelectedStudent(student);
    setHistoryModalOpen(true);
  };

  const handleDataChange = () => mutate(apiUrl);

  // --- Form and Upload Handlers ---
  const handleAddStudent = async (values: AddStudentValues) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, schoolClassId: classId }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to add student");
      message.success("Student added successfully!");
      setAddModalOpen(false);
      addStudentForm.resetFields();
      mutate(apiUrl);
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
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, studentId: selectedStudent.id }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to record payment");
      message.success("Payment recorded successfully!");
      setPaymentModalOpen(false);
      recordPaymentForm.resetFields();
      mutate(apiUrl);
      mutate("/api/dashboard");
    } catch (err) {
      message.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      message.error(
        "Invalid file type. Please select an Excel (.xlsx or .xls) file."
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("schoolClassId", classId);

    try {
      const response = await fetch("/api/students/import", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed");
      message.success(result.message);
      mutate(apiUrl);
    } catch (err) {
      message.error((err as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading)
    return <Spin size="large" style={{ display: "block", marginTop: 50 }} />;
  if (error || !data || data?.error)
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
    (sum: number, s: StudentDisplayData) => sum + s.balance,
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
        <Space>
          {classDetails.name !== "Graduated" && (
            <>
              <Button
                icon={<UploadOutlined />}
                onClick={handleImportClick}
                loading={uploading}
              >
                Import from Excel
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelected}
                accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                style={{ display: "none" }}
              />
            </>
          )}
          {classDetails.name !== "Graduated" && (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() => setAddModalOpen(true)}
            >
              Add Student
            </Button>
          )}
        </Space>
      </Space>

      <Card style={{ marginBottom: 24 }}>
        <Row>
          <Col span={12}>
            <Statistic
              title={classDetails.name === "Graduated" ? "N/A" : "Term Fee"}
              value={
                classDetails.name === "Graduated" ? "-" : classDetails.termFee
              }
              prefix="KES"
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="Total Class Balance"
              value={totalOutstanding}
              prefix="KES"
              valueStyle={{
                color:
                  totalOutstanding > 0
                    ? "#cf1322"
                    : totalOutstanding < 0
                    ? "#1890ff"
                    : "#3f8600",
              }}
            />
          </Col>
        </Row>
      </Card>

      <StudentsTable
        students={students}
        loading={isLoading}
        onRecordPayment={handleOpenRecordPayment}
        onViewHistory={handleOpenHistory}
        onDataChange={handleDataChange}
      />

      <AddStudentModal
        open={addModalOpen}
        form={addStudentForm}
        submitting={submitting}
        onCancel={() => setAddModalOpen(false)}
        onFinish={handleAddStudent}
      />

      {selectedStudent && (
        <RecordPaymentModal
          open={paymentModalOpen}
          form={recordPaymentForm}
          submitting={submitting}
          onCancel={() => setPaymentModalOpen(false)}
          onFinish={handleRecordPaymentSubmit}
          studentName={selectedStudent.name}
        />
      )}
      {selectedStudent && (
        <PaymentHistoryModal
          open={historyModalOpen}
          onCancel={() => setHistoryModalOpen(false)}
          studentId={selectedStudent.id}
          studentName={selectedStudent.name}
        />
      )}
    </div>
  );
}
