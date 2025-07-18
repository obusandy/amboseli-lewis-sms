// src/components/payments/RecordPaymentModal.tsx

import { Modal, Form, InputNumber, Select, Input, Button, Space } from "antd";
import { FormInstance } from "antd/es/form";

const { Option } = Select;

interface RecordPaymentValues {
  amount: number;
  method: string;
  reference?: string;
}

interface RecordPaymentModalProps {
  open: boolean;
  form: FormInstance<RecordPaymentValues>;
  submitting: boolean;
  onCancel: () => void;
  onFinish: (values: RecordPaymentValues) => void;
  studentName?: string;
}

export default function RecordPaymentModal({
  open,
  form,
  submitting,
  onCancel,
  onFinish,
  studentName,
}: RecordPaymentModalProps) {
  return (
    <Modal
      title={`Record Payment${studentName ? ` for ${studentName}` : ""}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="amount"
          label="Amount (KES)"
          rules={[
            { required: true, message: "Please enter payment amount" },
            {
              type: "number",
              min: 1,
              message: "Amount must be greater than 0",
            },
          ]}
        >
          <InputNumber<number>
            style={{ width: "100%" }}
            min={1}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, "") || 0)}
          />
        </Form.Item>

        <Form.Item
          name="method"
          label="Payment Method"
          rules={[{ required: true, message: "Please select payment method" }]}
          initialValue="CASH"
        >
          <Select>
            <Option value="CASH">Cash</Option>
            <Option value="BANK">Bank Transfer</Option>
            <Option value="MOBILE">Mobile Money</Option>
          </Select>
        </Form.Item>

        <Form.Item name="reference" label="Reference Number (Optional)">
          <Input placeholder="Transaction code, slip number, etc." />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={onCancel} disabled={submitting}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Record Payment
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
