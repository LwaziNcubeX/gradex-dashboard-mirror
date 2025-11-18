import { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminNavbar } from "@/components/admin/navbar";

export const metadata: Metadata = {
  title: "Admin Dashboard - GradeX",
  description: "GradeX Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
