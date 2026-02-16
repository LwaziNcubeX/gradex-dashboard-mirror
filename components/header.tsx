"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Search, Bell, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Logo from "./logo";
import { Avatar, AvatarImage } from "@/ui/avatar";

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/students": "Students",
  "/content": "Content Managment",
  "/analytics": "Analytics",
  "/feedback": "Feedback",
  "/settings": "Settings",
};
const pageDTitles: Record<string, string> = {
  "/": "Overview",
  "/students": "Students",
  "/content": "Manage questions, quizzes, and learning levels.",
  "/analytics": "Track performance and engagement trends.",
  "/feedback": "Feedback",
  "/settings": "Manage your account and preferences.",
};

export function Header({
  onMobileMenuToggle,
}: {
  onMobileMenuToggle: () => void;
}) {
  const pathname = usePathname();
  const currentPage = pageTitles[pathname] || "Dashboard";
  const currentPageDescription = pageDTitles[pathname];

  return (
    <header className="flex items-center top-0 bg-background backdrop-blur-md py-2 md:py-4 z-50">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile logo */}
      <div className="md:hidden">
        <Logo className="text-foreground h-6 w-auto" />
      </div>

      {/* Breadcrumb - desktop only */}
      <div className="pl-3">
        <h1 className="text-2xl font-bold font-oswald tracking-tight text-foreground">
          {currentPage}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {currentPageDescription}
        </p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Mobile search button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="md:hidden flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <Search className="h-[18px] w-[18px]" />
              <span className="sr-only">Search</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Search</TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="relative flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              <span className="sr-only">Notifications</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        {/* Profile menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="profile.webp" />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-44 bg-card border-border text-foreground"
          >
            <DropdownMenuItem
              asChild
              className="focus:bg-secondary focus:text-foreground cursor-pointer text-muted-foreground"
            >
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-secondary cursor-pointer text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
