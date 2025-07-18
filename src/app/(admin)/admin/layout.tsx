"use client";
import Navbar from "@/components/Navbar";
import { Layout } from "antd";

const { Content } = Layout;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {/* This provides the grey background and padding for the admin content */}
      <Layout
        style={{ minHeight: "calc(100vh - 64px)", background: "#f0f2f5" }}
      >
        <Content style={{ padding: "24px" }}>
          <div style={{ background: "#fff", padding: 24, minHeight: "100%" }}>
            {children}
          </div>
        </Content>
      </Layout>
    </>
  );
}
