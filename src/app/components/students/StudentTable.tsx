// src/components/students/StudentsTable.tsx

import { Table, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DollarOutlined } from "@ant-design/icons";

// It's good practice to define a Payment type if you ever need it
interface Payment {
  id: string;
  amount: number;
  method: string;
  // etc.
}

// ✅ This interface now correctly matches the data your API provides
export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  class: string;
  termFee: number;
  balance: number;
  payments: Payment[]; // Replaced `any` with the Payment type
}

interface StudentsTableProps {
  students: Student[];
  loading: boolean;
  onRecordPayment: (student: Student) => void;
}

export default function StudentsTable({
  students,
  loading,
  onRecordPayment,
}: StudentsTableProps) {
  // ✅ Strongly type the columns array
  const columns: ColumnsType<Student> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Admission No.",
      dataIndex: "admissionNumber",
      key: "admissionNumber",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Term Fee (KES)",
      dataIndex: "termFee",
      key: "termFee",
      render: (value: number) => value.toLocaleString("en-KE"),
    },
    {
      title: "Outstanding (KES)",
      dataIndex: "balance",
      key: "balance",
      sorter: (a, b) => a.balance - b.balance,
      // ✅ Corrected render logic: a positive balance means outstanding
      render: (balance: number) => (
        <span style={{ color: balance > 0 ? "#cf1322" : "#3f8600" }}>
          {balance.toLocaleString("en-KE")}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      // ✅ Correctly typed the 'record' parameter
      render: (_, record: Student) => (
        <Button
          type="primary"
          ghost
          icon={<DollarOutlined />}
          onClick={() => onRecordPayment(record)}
        >
          Record Payment
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={students}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      scroll={{ x: "max-content" }}
    />
  );
}
