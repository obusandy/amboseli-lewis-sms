"use client";

import AdminActions from "@/app/components/dashboard/AdminAction";
import ClassOverviewGrid from "@/app/components/dashboard/ClassOverviewGrid";
import StatsOverview from "@/app/components/dashboard/StatsOverview";
import TermBanner from "@/app/components/dashboard/TermBanner";
import { Typography, Spin, Alert } from "antd";
import useSWR from "swr";

const { Title } = Typography;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR("/api/dashboard", fetcher);

  if (isLoading) {
    return <Spin size="large" style={{ display: "block", marginTop: 50 }} />;
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load dashboard data."
        type="error"
        showIcon
      />
    );
  }

  if (!data?.currentTerm) {
    return (
      <div>
        <Alert
          message="No Active Term"
          description="There is no active term set in the system. Please go to settings to start a new term."
          type="warning"
          showIcon
        />
        <div style={{ marginTop: 24 }}>
          <AdminActions />
        </div>
      </div>
    );
  }

  const { currentTerm, stats, classData } = data;

  return (
    <div>
      <Title level={2}>Admin Dashboard</Title>
      <TermBanner term={currentTerm} />

      <StatsOverview stats={stats} />

      <Title level={3} style={{ marginTop: 40, marginBottom: 20 }}>
        Class Performance (This Term)
      </Title>
      <ClassOverviewGrid classData={classData} />

      <Title level={3} style={{ marginTop: 40, marginBottom: 20 }}>
        System Actions
      </Title>
      <AdminActions />
    </div>
  );
}
