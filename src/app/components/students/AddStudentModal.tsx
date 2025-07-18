import { Modal, Form, Input, Button, Space } from "antd";
import { FormInstance } from "antd/es/form";

interface AddStudentModalProps {
  open: boolean;
  form: FormInstance; // Use FormInstance type
  submitting: boolean;
  onCancel: () => void;
  onFinish: (values: { name: string; admissionNumber: string }) => void;
}

export default function AddStudentModal({
  open,
  form,
  submitting,
  onCancel,
  onFinish,
}: AddStudentModalProps) {
  return (
    <Modal
      title="Add New Student to this Class"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden // Reset fields when closed
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Student Name"
          rules={[{ required: true, message: "Please enter student name" }]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>
        <Form.Item
          name="admissionNumber"
          label="Admission Number"
          rules={[{ required: true, message: "Please enter admission number" }]}
        >
          <Input placeholder="e.g., 12345" />
        </Form.Item>
        {/* Class and Term Fee are determined by the page you are on, so no need to ask again. */}
        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Add Student
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
