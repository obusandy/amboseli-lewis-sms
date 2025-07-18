// src/app/admin/settings/page.tsx

"use client";

import { useState } from "react";
import {
  Card,
  Form,
  Input,
  DatePicker,
  Button,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import { Dayjs } from "dayjs";
import { FormInstance } from "antd/es/form";

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;

type TermFormValues = {
  name: string;
  dates: [Dayjs, Dayjs];
};

export default function SettingsPage() {
  const [termForm]: [FormInstance<TermFormValues>] = Form.useForm();
  const [termSubmitting, setTermSubmitting] = useState(false);
  // ❌ The old `promoteLoading` state is removed as it's no longer needed.

  // ✅ ADDED: The new handler for the "Undo" button.
  const handleUndoPromotion = async (promotionLogId: string) => {
    try {
      const response = await fetch("/api/system/promote/undo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promotionLogId }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to undo promotion.");
      }
      message.success("Promotion successfully undone!");
    } catch (error) {
      message.error((error as Error).message);
    }
  };

  // ✅ REPLACED: This is the new, smarter version of the handler.
  const handleStartNewTerm = async (values: TermFormValues) => {
    setTermSubmitting(true);
    try {
      const response = await fetch("/api/system/terms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          startDate: values.dates[0],
          endDate: values.dates[1],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to start new term.");
      }

      termForm.resetFields();

      // Display a message with an undo button if a promotion happened
      if (result.promotionLogId) {
        const btn = (
          <Button
            type="primary"
            size="small"
            onClick={() => handleUndoPromotion(result.promotionLogId)}
          >
            Undo Promotion
          </Button>
        );
        message.success({
          content: result.message,
          duration: 10, // Keep the message on screen for 10 seconds
          btn,
        });
      } else {
        message.success(result.message);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      setTermSubmitting(false);
    }
  };

  // ❌ The old `handlePromoteStudents` and `showPromoteConfirm` functions are completely removed.

  return (
    <div>
      <Title level={2}>System Settings</Title>
      <Paragraph>
        Manage core academic cycles. Starting a "Term 1" will automatically
        promote students from the previous year.
      </Paragraph>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            title="Start a New Term"
            headStyle={{ backgroundColor: "#fafafa" }}
          >
            <Paragraph type="secondary">
              Define a new academic term. This will become the "current term"
              for all fee calculations and dashboard views.
            </Paragraph>
            <Form
              form={termForm}
              layout="vertical"
              onFinish={handleStartNewTerm} // This now points to our new, smart handler
            >
              <Form.Item
                name="name"
                label="Term Name"
                rules={[{ required: true, message: "e.g., Term 1 2025" }]}
              >
                <Input placeholder="e.g., Term 1 2025" />
              </Form.Item>
              <Form.Item
                name="dates"
                label="Term Start & End Date"
                rules={[{ required: true, message: "Please select dates" }]}
              >
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={termSubmitting}
                  icon={<PoweroffOutlined />}
                >
                  Start Term
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* ❌ The entire "End of Year Promotion" card has been removed for safety and simplicity. */}
      </Row>
    </div>
  );
}
