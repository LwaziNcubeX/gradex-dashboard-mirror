import { AdminRoute } from "@/components/admin/admin-route-protector";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - GradeX",
  description: "GradeX Admin Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminRoute>{children}</AdminRoute>;
}
