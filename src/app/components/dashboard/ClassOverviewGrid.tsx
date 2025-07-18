// src/components/dashboard/ClassOverviewGrid.tsx

import { Card, Col, Row, Statistic, Progress, Button, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text } = Typography;

interface ClassData {
  id: string;
  name: string;
  termFee: number;
  studentCount: number;
  totalPaid: number;
  totalOutstanding: number;
  target: number;
}

export default function ClassOverviewGrid({
  classData,
}: {
  classData: ClassData[];
}) {
  return (
    <Row gutter={[16, 16]}>
      {classData.map((cls) => {
        const percentCollected =
          cls.target > 0 ? (cls.totalPaid / cls.target) * 100 : 0;

        return (
          <Col xs={24} sm={12} lg={8} key={cls.id}>
            <Card
              title={cls.name}
              extra={
                <Link href={`/admin/classes/${cls.id}`}>
                  <Button type="primary">View Class</Button>
                </Link>
              }
            >
              <Row gutter={16} align="middle">
                <Col span={12}>
                  <Statistic
                    title="Students"
                    value={cls.studentCount}
                    prefix={<UserOutlined />}
                  />
                  <Text
                    type="secondary"
                    style={{ marginTop: 8, display: "block" }}
                  >
                    Fee:{" "}
                    {cls.termFee.toLocaleString("en-KE", {
                      style: "currency",
                      currency: "KES",
                    })}
                  </Text>
                </Col>
                <Col span={12}>
                  <Progress
                    type="circle"
                    percent={parseFloat(percentCollected.toFixed(1))}
                    size={80}
                  />
                </Col>
              </Row>
              <Statistic
                title="Outstanding (KES)"
                value={cls.totalOutstanding}
                precision={2}
                valueStyle={{
                  color: cls.totalOutstanding > 0 ? "#cf1322" : "#3f8600",
                }}
                prefix="KES"
                style={{ marginTop: 20 }}
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
}
