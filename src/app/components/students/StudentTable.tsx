"use client";

import { Table, Button, Popconfirm, Tag, message, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  DollarOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

export interface StudentDisplayData {
  id: string;
  name: string;
  admissionNumber: string;
  class: string;
  balance: number;
}
interface StudentsTableProps {
  students: StudentDisplayData[];
  loading: boolean;
  onRecordPayment: (student: StudentDisplayData) => void;
  onViewHistory: (student: StudentDisplayData) => void;
  onDataChange: () => void;
}

export default function StudentsTable({
  students,
  loading,
  onRecordPayment,
  onViewHistory,
  onDataChange,
}: StudentsTableProps) {
  const handleArchiveStudent = async (studentId: string) => {
    try {
      const response = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Failed to archive student.");
      message.success(result.message);
      onDataChange(); // Trigger a data refresh on the parent page
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  const isArchiveView =
    students.length > 0 && students[0].class === "Graduated";

  const columns: ColumnsType<StudentDisplayData> = [
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
      title: isArchiveView ? "Final Balance" : "Outstanding Balance",
      dataIndex: "balance",
      key: "balance",
      sorter: (a, b) => a.balance - b.balance,
      render: (balance: number) => (
        <span
          style={{
            color:
              balance > 0 ? "#cf1322" : balance < 0 ? "#1890ff" : "#3f8600",
          }}
        >
          {balance.toLocaleString("en-KE")} {balance < 0 && " (Credit)"}
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "balance",
      render: (balance: number) => {
        if (!isArchiveView) return null;
        return balance <= 0 ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {" "}
            Cleared{" "}
          </Tag>
        ) : (
          <Tag icon={<InfoCircleOutlined />} color="error">
            {" "}
            Balance Due{" "}
          </Tag>
        );
      },
      className: isArchiveView ? "" : "hidden-column",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: StudentDisplayData) => (
        <Space>
          <Button
            icon={<HistoryOutlined />}
            onClick={() => onViewHistory(record)}
          >
            History
          </Button>
          <Button
            type="primary"
            ghost
            icon={<DollarOutlined />}
            onClick={() => onRecordPayment(record)}
          >
            Payment
          </Button>
          {!isArchiveView && (
            <Popconfirm
              title="Archive this student?"
              description="Their final balance will be calculated and they will be moved to the archive. This cannot be undone."
              onConfirm={() => handleArchiveStudent(record.id)}
              okText="Yes, Archive"
              cancelText="No"
            >
              <Button type="primary" danger ghost icon={<DeleteOutlined />}>
                Archive
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <style>{`.hidden-column { display: none; }`}</style>
      <Table
        dataSource={students}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </>
  );
}
