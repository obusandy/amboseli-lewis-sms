// src/components/dashboard/TermBanner.tsx

import { Alert, Progress, Typography, Space } from "antd";
import { CalendarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text } = Typography;

interface Term {
  name: string;
  startDate: string;
  endDate: string;
}

export default function TermBanner({ term }: { term: Term }) {
  const start = dayjs(term.startDate);
  const end = dayjs(term.endDate);
  const today = dayjs();

  const totalTermDays = end.diff(start, "day");
  const daysElapsed = today.diff(start, "day");
  const daysRemaining = end.diff(today, "day");

  // Calculate the progress percentage, ensuring it's between 0 and 100
  let progressPercent = 0;
  if (totalTermDays > 0) {
    progressPercent = Math.round((daysElapsed / totalTermDays) * 100);
    progressPercent = Math.max(0, Math.min(progressPercent, 100));
  }

  // Determine the banner's status and message
  let status: "info" | "success" | "warning" = "info";
  let message: string;
  let description: React.ReactNode;

  if (today.isAfter(end)) {
    // The term has ended
    status = "success";
    message = `Term "${term.name}" has officially ended.`;
    description = (
      <Space direction="vertical">
        <Text>Ended {dayjs(end).fromNow()}. Time to start the next term!</Text>
        <CheckCircleOutlined style={{ fontSize: 24, color: "#52c41a" }} />
      </Space>
    );
  } else {
    // The term is ongoing
    if (daysRemaining <= 14) {
      // Less than 2 weeks remaining
      status = "warning";
    }
    message = `Current Term: ${term.name}`;
    description = (
      <Space direction="vertical" style={{ width: "100%" }}>
        <Text>
          Running from {start.format("D MMMM")} to {end.format("D MMMM, YYYY")}
        </Text>
        <Progress
          percent={progressPercent}
          status={status === "warning" ? "exception" : "active"}
          strokeColor={status === "warning" ? "#faad14" : undefined}
        />
        <Text strong>
          {daysRemaining > 0
            ? `${daysRemaining} days remaining.`
            : "Last day of the term!"}
        </Text>
      </Space>
    );
  }

  return (
    <Alert
      message={message}
      description={description}
      type={status}
      showIcon
      icon={
        status === "success" ? <CheckCircleOutlined /> : <CalendarOutlined />
      }
      style={{ marginBottom: 24 }}
    />
  );
}
