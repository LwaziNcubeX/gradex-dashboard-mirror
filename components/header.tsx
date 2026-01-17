"use client";

import { GradeXLogo } from "@/components/gradex-logo";
import { Settings2, LogOut, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-6 bg-background/10 backdrop-blur-[120px]">
      <GradeXLogo className="text-foreground h-8 w-auto" />

      <div className="flex items-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 w-10 rounded-full bg-linear-to-br from-primary to-primary/70 hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-ring flex items-center justify-center text-primary-foreground font-semibold">
              A
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-card border-border text-foreground"
          >
            <DropdownMenuItem className="focus:bg-secondary focus:text-foreground cursor-pointer text-muted-foreground">
              <Settings2 className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-secondary focus:text-foreground cursor-pointer text-muted-foreground">
              <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
