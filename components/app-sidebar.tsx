"use client";

import type * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Layers,
  FileQuestion,
  HelpCircle,
  Users,
  FileText,
  CreditCard,
  Settings,
  GraduationCap,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import Logo from "../public/image.svg";
import Image from "next/image";

const mainNavItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
];

const contentNavItems = [
  {
    title: "Levels",
    url: "/levels",
    icon: Layers,
  },
  {
    title: "Quizzes",
    url: "/quizzes",
    icon: FileQuestion,
  },
  {
    title: "Questions",
    url: "/questions",
    icon: HelpCircle,
  },
];

const managementNavItems = [
  {
    title: "Students",
    url: "/students",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
  },
];

const systemNavItems = [
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user } = useAuth();

  const userData = {
    name: user?.name || "Admin User",
    email: user?.email || "admin@gradex.com",
    avatar: "/profile.png",
  };

  const NavGroup = ({
    items,
    label,
  }: {
    items: typeof mainNavItems;
    label?: string;
  }) => (
    <SidebarGroup className="overflow-hidden ">
      {label && (
        <SidebarGroupLabel className="text-md font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                  className={cn(
                    "transition-colors",
                    isActive && "bg-primary/10 text-primary font-medium"
                  )}
                >
                  <Link href={item.url}>
                    <item.icon
                      className={cn("h-8 w-8", isActive && "text-primary")}
                    />
                    {/* <span>{item.title}</span> */}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="overflow-hidden w-fit h-full"
    >
      <SidebarHeader className="h-14 bg-secondary">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-transparent">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <Image
                    src={"image.svg"}
                    alt="logo"
                    fill
                    className="rounded-md"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden bg-secondary">
        <NavGroup items={mainNavItems} />
        <SidebarSeparator />
        <NavGroup items={contentNavItems} label="Content" />
        <SidebarSeparator />
        <NavGroup items={managementNavItems} label="Management" />
        <SidebarSeparator />
        <NavGroup items={systemNavItems} label="System" />
      </SidebarContent>

      <SidebarFooter className="border-t bg-secondary">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
