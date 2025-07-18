// src/components/dashboard/AdminActions.tsx

import { Card, Button, Typography } from "antd";
import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Paragraph } = Typography;

export default function AdminActions() {
  return (
    <Card title="Quick Actions">
      <Paragraph type="secondary">
        Manage system-wide settings and academic cycles.
      </Paragraph>
      <Link href="/admin/settings">
        <Button type="default" icon={<SettingOutlined />}>
          Go to System Settings
        </Button>
      </Link>
      <Link href="/admin/settings/classes">
        <Button type="default" icon={<EditOutlined />}>
          Manage Class Fees
        </Button>
      </Link>
    </Card>
  );
}
