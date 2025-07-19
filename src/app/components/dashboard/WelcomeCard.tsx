// src/components/dashboard/WelcomeCard.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, Typography, Button, Avatar } from "antd";
import { UserAddOutlined, SmileOutlined } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function WelcomeCard() {
  const { data: session } = useSession();
  const [currentTime, setCurrentTime] = useState(dayjs().format("h:mm:ss A"));
  const adminName = session?.user?.name?.split(" ")[0] || "Admin"; // Get first name

  useEffect(() => {
    // Update the clock every second
    const timer = setInterval(() => {
      setCurrentTime(dayjs().format("h:mm:ss A"));
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = dayjs().hour();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <Card
      style={{
        borderRadius: "12px",
        height: "100%",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <Title level={4} style={{ color: "white", margin: 0 }}>
            {getGreeting()}, {adminName}!
          </Title>
          <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
            {dayjs().format("dddd, MMMM D")}
          </Text>
          <Title level={2} style={{ color: "white", marginTop: "8px" }}>
            {currentTime}
          </Title>
        </div>

        {/* We can add a quick action button here if we want later */}
        <div className="text-right">
          <SmileOutlined
            style={{ fontSize: 48, color: "rgba(255, 255, 255, 0.5)" }}
          />
        </div>
      </div>
    </Card>
  );
}
