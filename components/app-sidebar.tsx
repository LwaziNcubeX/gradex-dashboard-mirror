"use client";

import * as React from "react";
import {
  BookOpen,
  HelpCircle,
  GalleryVerticalEnd,
  LayoutDashboard,
  Layers,
  Settings2,
  BarChart3,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/lib/auth";

const user = await getCurrentUser();

// GradeX dashboard data
const data = {
  user: {
    name: `${user?.name}` || "Admin",
    email: `${user?.email}` || "admin@gradex.com",
    avatar: "/admin.png",
  },
  teams: [
    {
      name: "GradeX",
      logo: GalleryVerticalEnd,
      plan: "Pro",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Questions",
      url: "/dashboard/questions",
      icon: HelpCircle,
      items: [
        {
          title: "All Questions",
          url: "/dashboard/questions",
        },
        {
          title: "Create Question",
          url: "/dashboard/questions/create",
        },
      ],
    },
    {
      title: "Quizzes",
      url: "/dashboard/quizzes",
      icon: BookOpen,
      items: [
        {
          title: "All Quizzes",
          url: "/dashboard/quizzes",
        },
        {
          title: "Create Quiz",
          url: "/dashboard/quizzes/create",
        },
      ],
    },
    {
      title: "Levels",
      url: "/dashboard/levels",
      icon: Layers,
      items: [
        {
          title: "All Levels",
          url: "/dashboard/levels",
        },
        {
          title: "Create Level",
          url: "/dashboard/levels/create",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Overview",
          url: "/dashboard/analytics",
        },
        {
          title: "User Progress",
          url: "/dashboard/analytics/users",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/dashboard/settings",
        },
        {
          title: "Profile",
          url: "/dashboard/settings/profile",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Active Quizzes",
      url: "/dashboard/quizzes",
      icon: BookOpen,
    },
    {
      name: "Student Management",
      url: "/dashboard/students",
      icon: Users,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
