// src/components/dashboard/StatsOverview.tsx

import { Row, Col, Card, Statistic, Tooltip } from "antd";
import {
  TeamOutlined,
  CheckCircleOutlined, // Bring back the checkmark icon
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

// ✅ The interface is updated to expect `totalPaid` instead of `totalArrears`.
interface Stats {
  totalActiveStudents: number;
  totalPaid: number;
  termOutstanding: number;
  totalOutstanding: number;
}

export default function StatsOverview({ stats }: { stats: Stats }) {
  return (
    <Row gutter={16}>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title="Active Students"
            value={stats.totalActiveStudents}
            prefix={<TeamOutlined />}
          />
        </Card>
      </Col>
      {/* ✅ The "Collected" card is now the second item for a better flow */}
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title={
              <Tooltip title="Total payments received in the current term.">
                <span>
                  Collected (This Term) <QuestionCircleOutlined />
                </span>
              </Tooltip>
            }
            value={stats.totalPaid}
            precision={2}
            valueStyle={{ color: "#3f8600" }}
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title={
              <Tooltip title="Outstanding amount from this term's fees only.">
                <span>
                  Term Outstanding <QuestionCircleOutlined />
                </span>
              </Tooltip>
            }
            value={stats.termOutstanding}
            precision={2}
            valueStyle={{ color: "#faad14" }} // Changed color for better distinction
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card>
          <Statistic
            title={
              <Tooltip title="The grand total of all money owed (Term Outstanding + all past Arrears).">
                <span>
                  Total Outstanding <QuestionCircleOutlined />
                </span>
              </Tooltip>
            }
            value={stats.totalOutstanding}
            precision={2}
            valueStyle={{ color: "#cf1322", fontWeight: "bold" }}
            prefix={<ExclamationCircleOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
}
