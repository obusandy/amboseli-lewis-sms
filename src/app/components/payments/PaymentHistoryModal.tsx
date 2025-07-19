// src/components/payments/PaymentHistoryModal.tsx
"use client";

import { Modal, Table, Spin, Alert, Tag, Empty, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import useSWR from "swr";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface PaymentRecord {
  id: string;
  amount: number;
  method: string;
  reference: string | null;
  recordedBy: string;
  createdAt: string;
  term: { name: string } | null;
}

interface PaymentHistoryModalProps {
  open: boolean;
  onCancel: () => void;
  studentId: string | null;
  studentName: string | null;
}

export default function PaymentHistoryModal({
  open,
  onCancel,
  studentId,
  studentName,
}: PaymentHistoryModalProps) {
  const {
    data: payments,
    error,
    isLoading,
  } = useSWR<PaymentRecord[]>(
    studentId ? `/api/students/${studentId}/payments` : null,
    fetcher
  );

  const columns: ColumnsType<PaymentRecord> = [
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD MMM YYYY, h:mm A"),
      width: 200,
    },
    {
      title: "Amount (KES)",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (amount: number) => amount.toLocaleString(),
    },
    {
      title: "Method",
      dataIndex: "method",
      key: "method",
      render: (method: string) => <Tag color="blue">{method}</Tag>,
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
      render: (ref) => ref || <Text type="secondary">N/A</Text>,
    },
    {
      title: "Term",
      dataIndex: ["term", "name"],
      key: "term",
      render: (termName) =>
        termName || <Text type="secondary">Unassigned</Text>,
    },
    { title: "Recorded By", dataIndex: "recordedBy", key: "recordedBy" },
  ];

  const totalPaid = payments?.reduce((sum, p) => sum + p.amount, 0) || 0;

  return (
    <Modal
      title={<Title level={4}>Payment History for {studentName}</Title>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      destroyOnClose
    >
      {isLoading && (
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      )}
      {error && (
        <Alert
          message="Error"
          description="Could not load payment history."
          type="error"
        />
      )}
      {!isLoading &&
        !error &&
        (payments && payments.length > 0 ? (
          <Table
            columns={columns}
            dataSource={payments}
            rowKey="id"
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>
                  <Text strong>Total Paid</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={1} align="right">
                  <Text strong>KES {totalPaid.toLocaleString()}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} colSpan={4}></Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        ) : (
          <Empty description="No payment records found for this student." />
        ))}
    </Modal>
  );
}
