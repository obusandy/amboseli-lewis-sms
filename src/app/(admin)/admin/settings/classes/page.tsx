// src/app/admin/settings/classes/page.tsx

"use client";

import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import {
  Table,
  Button,
  Modal,
  Form,
  InputNumber,
  Spin,
  Alert,
  Typography,
  message,
  Space,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { SchoolClass } from "@prisma/client"; // Import type from prisma

const { Title } = Typography;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ManageClassesPage() {
  const {
    data: classes,
    error,
    isLoading,
  } = useSWR<SchoolClass[]>("/api/classes", fetcher);
  const { mutate } = useSWRConfig();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [form] = Form.useForm();

  const handleEdit = (record: SchoolClass) => {
    setEditingClass(record);
    form.setFieldsValue({ termFee: record.termFee });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingClass(null);
  };

  const handleUpdate = async (values: { termFee: number }) => {
    if (!editingClass) return;

    try {
      const response = await fetch("/api/classes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingClass.id, termFee: values.termFee }),
      });

      if (!response.ok) {
        throw new Error("Failed to update class fee.");
      }

      message.success(`Fee for ${editingClass.name} updated successfully!`);
      // Re-fetch the data to update the table
      mutate("/api/classes");
      mutate("/api/dashboard"); // Also refresh dashboard data
      handleCancel();
    } catch (err) {
      message.error((err as Error).message);
    }
  };

  const columns: ColumnsType<SchoolClass> = [
    { title: "Class Name", dataIndex: "name", key: "name" },
    {
      title: "Term Fee (KES)",
      dataIndex: "termFee",
      key: "termFee",
      render: (fee) => fee.toLocaleString(),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>
          Edit Fee
        </Button>
      ),
    },
  ];

  if (isLoading) return <Spin size="large" />;
  if (error) return <Alert message="Error loading classes" type="error" />;

  return (
    <div>
      <Title level={2}>Manage Class Fees</Title>
      <Typography.Paragraph type="secondary">
        Update the termly fee for each class here.
      </Typography.Paragraph>
      <Table columns={columns} dataSource={classes} rowKey="id" />

      {editingClass && (
        <Modal
          title={`Update Fee for ${editingClass.name}`}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleUpdate}>
            <Form.Item
              name="termFee"
              label="New Term Fee (KES)"
              rules={[{ required: true, message: "Please enter a fee" }]}
            >
              <InputNumber<number>
                style={{ width: "100%" }}
                min={0}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => Number(value?.replace(/,*/g, "") || 0)}
              />
            </Form.Item>
            <Form.Item>
              <Space style={{ width: "100%", justifyContent: "flex-end" }}>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button type="primary" htmlType="submit">
                  Update Fee
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
}
