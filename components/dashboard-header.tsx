import { getCurrentUser } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export async function DashboardHeader() {
  const user = await getCurrentUser();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b bg-card">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-right">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </div>
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role}
              </Badge>
              <Avatar>
                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
              </Avatar>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
