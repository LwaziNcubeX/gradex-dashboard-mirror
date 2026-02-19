"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Trophy,
  Zap,
  Flame,
  BookOpen,
  ClipboardCheck,
  Loader2,
  Clock,
} from "lucide-react";
import { studentService, type StudentDetail } from "@/lib/api/students";
import { StudentType } from "@/constants/types";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface StudentDetailSheetProps {
  student: StudentType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChanged?: (userId: string, status: string) => void;
}

function StatPill({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    primary: { bg: "bg-primary/10", text: "text-primary" },
    "chart-1": { bg: "bg-chart-1/10", text: "text-chart-1" },
    "chart-2": { bg: "bg-chart-2/10", text: "text-chart-2" },
    "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
    "chart-4": { bg: "bg-chart-4/10", text: "text-chart-4" },
  };
  const c = colorMap[color] || colorMap.primary;
  return (
    <div className="flex items-center gap-2 p-2.5 bg-secondary/50 rounded-lg">
      <div className={`p-1.5 rounded-md ${c.bg}`}>
        <Icon className={`h-3.5 w-3.5 ${c.text}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground leading-tight">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground leading-tight tabular-nums">
          {value}
        </p>
      </div>
    </div>
  );
}

const STATUS_OPTIONS = ["active", "inactive", "disabled"] as const;
type StudentStatus = (typeof STATUS_OPTIONS)[number];

export function StudentDetailSheet({
  student,
  open,
  onOpenChange,
  onStatusChanged,
}: StudentDetailSheetProps) {
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusValue, setStatusValue] = useState<StudentStatus>("active");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!student || !open) return;
    setDetail(null);
    setStatusValue((student.status as StudentStatus) || "active");
    setLoading(true);
    studentService
      .getStudent(student.user_id)
      .then((d) => {
        setDetail(d);
        if (d.profile?.status) {
          setStatusValue((d.profile.status as StudentStatus) || "active");
        }
      })
      .catch(() => {
        toast.error("Failed to load student details");
      })
      .finally(() => setLoading(false));
  }, [student, open]);

  const handleStatusChange = async (newStatus: string) => {
    if (!student) return;
    setUpdatingStatus(true);
    try {
      await studentService.updateStudentStatus(student.user_id, newStatus);
      setStatusValue(newStatus as StudentStatus);
      toast.success(`Status updated to ${newStatus}`);
      onStatusChanged?.(student.user_id, newStatus);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Failed to update status",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const profile = detail?.profile;
  const attempts = detail?.recent_attempts ?? [];
  const levelProgress = detail?.level_progress ?? [];

  const initials = student
    ? `${student.first_name[0] ?? ""}${student.last_name[0] ?? ""}`.toUpperCase()
    : "?";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card border-border w-full sm:max-w-md overflow-y-auto flex flex-col gap-4 p-5">
        <SheetHeader className="pb-0">
          <SheetTitle className="sr-only">Student Detail</SheetTitle>
        </SheetHeader>

        {/* Profile header */}
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-foreground leading-tight">
              {student?.first_name} {student?.last_name}
            </p>
            {profile?.email && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Mail className="h-3 w-3" /> {profile.email}
              </p>
            )}
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ID: {student?.user_id}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge
              variant="secondary"
              className={`text-[10px] px-1.5 py-0 ${
                statusValue === "active"
                  ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                  : statusValue === "inactive"
                    ? "bg-muted text-muted-foreground border-border"
                    : "bg-destructive/10 text-destructive border-destructive/20"
              }`}
            >
              {statusValue}
            </Badge>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              <StatPill
                icon={Trophy}
                label="Level"
                value={profile?.current_level ?? student?.streak ?? 0}
                color="chart-3"
              />
              <StatPill
                icon={Zap}
                label="Total XP"
                value={(profile?.total_xp ?? 0).toLocaleString()}
                color="primary"
              />
              <StatPill
                icon={Flame}
                label="Streak"
                value={`${profile?.streak_days ?? student?.streak ?? 0} days`}
                color="chart-1"
              />
              <StatPill
                icon={BookOpen}
                label="Quizzes Done"
                value={profile?.quizzes_completed ?? 0}
                color="chart-2"
              />
            </div>

            {/* Status management */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                Account Status
              </p>
              <div className="flex items-center gap-2">
                <Select
                  value={statusValue}
                  onValueChange={handleStatusChange}
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="bg-secondary border-border h-9 text-sm flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                {updatingStatus && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Account info */}
            {(profile?.created_at || profile?.last_login_at) && (
              <div className="flex flex-col gap-1.5 p-3 bg-secondary/50 rounded-lg">
                {profile?.created_at && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    Joined{" "}
                    {formatDistanceToNow(new Date(profile.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                )}
                {profile?.last_login_at && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Last active{" "}
                    {formatDistanceToNow(new Date(profile.last_login_at), {
                      addSuffix: true,
                    })}
                  </p>
                )}
              </div>
            )}

            {/* Level progress */}
            {levelProgress.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Level Progress
                </p>
                <div className="flex flex-col gap-2">
                  {levelProgress.slice(0, 5).map((lp, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-0.5">
                          <span className="text-[11px] text-foreground truncate">
                            {lp.level_id}
                          </span>
                          <span className="text-[11px] text-muted-foreground tabular-nums ml-2 flex-shrink-0">
                            {Math.round(lp.completion_percentage ?? 0)}%
                          </span>
                        </div>
                        <Progress
                          value={lp.completion_percentage ?? 0}
                          className="h-1 bg-secondary"
                        />
                      </div>
                      <Badge
                        variant="secondary"
                        className={`text-[9px] px-1 py-0 flex-shrink-0 ${
                          lp.level_status === "completed"
                            ? "bg-chart-1/10 text-chart-1"
                            : lp.level_status === "in_progress"
                              ? "bg-chart-2/10 text-chart-2"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {lp.level_status?.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent attempts */}
            {attempts.length > 0 ? (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Recent Quiz Attempts
                </p>
                <div className="flex flex-col gap-1.5">
                  {attempts.slice(0, 6).map((attempt, i) => {
                    const pct =
                      attempt.max_score > 0
                        ? Math.round(
                            (attempt.total_score / attempt.max_score) * 100,
                          )
                        : 0;
                    return (
                      <div
                        key={attempt._id ?? i}
                        className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-[11px] text-foreground truncate">
                              Quiz {attempt.quiz_id?.slice(-6)}
                            </p>
                            {attempt.submitted_at && (
                              <p className="text-[10px] text-muted-foreground">
                                {formatDistanceToNow(
                                  new Date(attempt.submitted_at),
                                  { addSuffix: true },
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                        <span
                          className={`text-sm font-semibold tabular-nums ${
                            pct >= 80
                              ? "text-chart-1"
                              : pct >= 60
                                ? "text-chart-3"
                                : "text-destructive"
                          }`}
                        >
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground text-xs">
                No quiz attempts yet
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
