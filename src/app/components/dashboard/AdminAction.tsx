// src/components/dashboard/AdminActions.tsx

import { Card, Col, Row, Typography, Button, Avatar, Space } from "antd";
import {
  CalendarOutlined,
  DollarCircleOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Paragraph } = Typography;

export default function AdminActions() {
  return (
    <Row gutter={[24, 24]}>
      {/* Card 1: Manage Terms */}
      <Col xs={24} md={12}>
        <Card hoverable style={{ borderRadius: "12px", height: "100%" }}>
          <Space align="start" size="large">
            <Avatar
              size={64}
              icon={<CalendarOutlined />}
              style={{
                backgroundColor: "#e6f7ff",
                color: "#1890ff",
                flexShrink: 0,
              }}
            />
            <div style={{ flexGrow: 1 }}>
              <Title level={4}>Academic Calendar</Title>
              <Paragraph type="secondary">
                Start new academic terms. Triggering a "Term 1" will
                automatically handle student promotions and arrears.
              </Paragraph>
              <Link href="/admin/settings">
                <Button type="primary" ghost>
                  Manage Terms <ArrowRightOutlined />
                </Button>
              </Link>
            </div>
          </Space>
        </Card>
      </Col>

      {/* Card 2: Manage Fees */}
      <Col xs={24} md={12}>
        <Card hoverable style={{ borderRadius: "12px", height: "100%" }}>
          <Space align="start" size="large">
            <Avatar
              size={64}
              icon={<DollarCircleOutlined />}
              style={{
                backgroundColor: "#f6ffed",
                color: "#52c41a",
                flexShrink: 0,
              }}
            />
            <div style={{ flexGrow: 1 }}>
              <Title level={4}>Fee Structure</Title>
              <Paragraph type="secondary">
                Set and update the termly fees for each class, from Form 1 to
                Form 4.
              </Paragraph>
              <Link href="/admin/settings/classes">
                <Button type="primary" ghost>
                  Update Fees <ArrowRightOutlined />
                </Button>
              </Link>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
