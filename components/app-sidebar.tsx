"use client";

import * as React from "react";
import Image from "next/image";
import {
  HomeIcon,
  ChartBarIcon,
  Squares2X2Icon,
  QuestionMarkCircleIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  DocumentChartBarIcon,
  CreditCardIcon,
} from "@heroicons/react/24/solid";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
// icons replaced with Heroicons above

const data = {
  user: {
    name: "Admin",
    email: "m@rapidshyft.com",
    avatar: "/profile.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: HomeIcon,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: ChartBarIcon,
    },

    {
      title: "Levels",
      url: "/levels",
      icon: Squares2X2Icon,
    },
    {
      title: "Quizzes",
      url: "/quizzes",
      icon: QuestionMarkCircleIcon,
    },
    {
      title: "Questions",
      url: "/questions",
      icon: ClipboardDocumentListIcon,
    },

    {
      title: "Students",
      url: "/students",
      icon: UsersIcon,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: DocumentChartBarIcon,
    },

    {
      title: "Billing",
      url: "/billing",
      icon: CreditCardIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout, user } = useAuth();

  const updatedData = {
    ...data,
    user: {
      ...data.user,
      name: user?.name ?? data.user.name,
      email: user?.email ?? data.user.email,
    },
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="size-8 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <a href="/dashboard" className="flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="GradeX logo"
                  fill
                  className="object-contain relative p-1.5"
                  priority
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain as any /* TODO: Fix Icon type issue */} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={updatedData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
