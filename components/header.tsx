"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, Search, Bell, Settings, LogOut } from "lucide-react";
import { GradeXLogo } from "@/components/gradex-logo";
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

const pageTitles: Record<string, string> = {
  "/": "Overview",
  "/students": "Students",
  "/content": "Content",
  "/analytics": "Analytics",
  "/feedback": "Feedback",
  "/settings": "Settings",
};

export function Header({
  onMobileMenuToggle,
}: {
  onMobileMenuToggle: () => void;
}) {
  const pathname = usePathname();
  const currentPage = pageTitles[pathname] || "Dashboard";

  return (
    <header className="flex items-center gap-4 h-14 px-4 md:px-6 border-b border-border bg-background/80 backdrop-blur-sm shrink-0 sticky top-0 z-40">
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
        <GradeXLogo className="text-foreground h-6 w-auto" />
      </div>

      {/* Breadcrumb - desktop only */}
      <div className="hidden md:flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          GradeX
        </Link>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground font-medium">{currentPage}</span>
      </div>

      {/* Search bar - center */}
      <div className="hidden md:flex flex-1 max-w-md mx-auto">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search students, quizzes, content..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            Ctrl K
          </kbd>
        </div>
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
            <button className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 text-primary text-sm font-semibold hover:bg-primary/30 transition-colors focus:outline-none focus:ring-2 focus:ring-ring ml-1">
              A
            </button>
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
