"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Star,
  RefreshCw,
} from "lucide-react";
import {
  feedbackService,
  type FeedbackItem,
  type FetchFeedbackParams,
  type FeedbackStatus,
  type FeedbackType,
} from "@/lib/api/feedback";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const metricColors: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  "chart-1": { bg: "bg-chart-1/10", text: "text-chart-1" },
  "chart-3": { bg: "bg-chart-3/10", text: "text-chart-3" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive" },
};

const typeStyles: Record<string, string> = {
  praise: "bg-primary/10 text-primary border-primary/20",
  suggestion: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  bug: "bg-destructive/10 text-destructive border-destructive/20",
  complaint: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  other: "bg-muted text-muted-foreground border-border",
};

const statusStyles: Record<FeedbackStatus, string> = {
  pending: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  reviewed: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  resolved: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  dismissed: "bg-muted text-muted-foreground border-border",
};

const FILTER_MAP: Record<string, { feedback_type?: FeedbackType }> = {
  All: {},
  Praise: { feedback_type: "praise" },
  Suggestions: { feedback_type: "suggestion" },
  Bugs: { feedback_type: "bug" },
};

const filters = ["All", "Praise", "Suggestions", "Bugs"];

export default function FeedbackPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    total_pages: 1,
  });
  const [counts, setCounts] = useState({
    total: 0,
    praise: 0,
    suggestion: 0,
    bug: 0,
  });

  const fetchFeedback = useCallback(async (filter: string, page = 1) => {
    setLoading(true);
    try {
      const params: FetchFeedbackParams = {
        page,
        page_size: 20,
        ...FILTER_MAP[filter],
      };
      const result = await feedbackService.getFeedback(params);
      setFeedbackItems(result.data);
      setPagination({
        page: result.pagination.page,
        total: result.pagination.total,
        total_pages: result.pagination.total_pages,
      });

      // Refresh all-type counts on "All" filter
      if (filter === "All") {
        const typeCount = result.data.reduce(
          (acc, item) => {
            if (item.type === "praise") acc.praise++;
            else if (item.type === "suggestion") acc.suggestion++;
            else if (item.type === "bug") acc.bug++;
            return acc;
          },
          { praise: 0, suggestion: 0, bug: 0 },
        );
        setCounts({ total: result.pagination.total, ...typeCount });
      }
    } catch {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback(activeFilter);
  }, [activeFilter, fetchFeedback]);

  const handleStatusUpdate = async (id: string, status: FeedbackStatus) => {
    setUpdatingId(id);
    try {
      await feedbackService.updateStatus(id, status);
      setFeedbackItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item)),
      );
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const summaryMetrics = [
    {
      label: "Total Feedback",
      value: counts.total.toLocaleString(),
      icon: MessageSquare,
      color: "primary",
    },
    {
      label: "Praise",
      value: counts.praise.toLocaleString(),
      icon: ThumbsUp,
      color: "chart-1",
    },
    {
      label: "Suggestions",
      value: counts.suggestion.toLocaleString(),
      icon: AlertCircle,
      color: "chart-3",
    },
    {
      label: "Bug Reports",
      value: counts.bug.toLocaleString(),
      icon: ThumbsDown,
      color: "destructive",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center bg-secondary rounded-md p-0.5">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeFilter === filter
                  ? "bg-primary/60 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={() => fetchFeedback(activeFilter)}
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryMetrics.map((metric) => {
          const colors = metricColors[metric.color];
          return (
            <Card
              key={metric.label}
              className="rounded-xl border-border/50 py-0"
            >
              <CardContent className="p-3 flex items-center gap-2.5">
                <div className={`p-1.5 rounded-md ${colors.bg}`}>
                  <metric.icon className={`h-4 w-4 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="text-lg font-bold text-foreground leading-tight">
                    {metric.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feedback list */}
      <Card className="rounded-xl">
        <CardHeader className="px-4 pt-4 pb-2">
          <CardTitle className="text-sm font-medium text-foreground">
            Recent Feedback
            <span className="text-muted-foreground font-normal ml-2">
              ({pagination.total})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex flex-col gap-2">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 animate-pulse"
              >
                <div className="w-8 h-8 rounded-full bg-secondary shrink-0" />
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <div className="h-3.5 w-24 bg-secondary rounded" />
                    <div className="h-3.5 w-16 bg-secondary rounded" />
                  </div>
                  <div className="h-3 w-full bg-secondary rounded" />
                  <div className="h-3 w-2/3 bg-secondary rounded mt-1.5" />
                </div>
              </div>
            ))
          ) : feedbackItems.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground text-sm">
              No feedback found
            </p>
          ) : (
            feedbackItems.map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-semibold">
                    {(item.user_name ?? item.user_id)[0]?.toUpperCase() ?? "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">
                      {item.user_name ?? item.user_id}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${typeStyles[item.type] ?? typeStyles.other}`}
                    >
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-1.5 py-0 ${statusStyles[item.status]}`}
                    >
                      {item.status}
                    </Badge>
                    {item.rating != null && (
                      <div className="flex items-center gap-0.5 ml-auto">
                        <Star className="h-3 w-3 text-chart-3 fill-chart-3" />
                        <span className="text-[11px] text-foreground font-medium">
                          {item.rating}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-muted-foreground/70">
                      {(() => {
                        try {
                          return formatDistanceToNow(
                            new Date(item.created_at),
                            { addSuffix: true },
                          );
                        } catch {
                          return item.created_at;
                        }
                      })()}
                    </span>
                    {item.status === "pending" && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] px-2 text-chart-2 hover:text-chart-2"
                          disabled={updatingId === item._id}
                          onClick={() =>
                            handleStatusUpdate(item._id, "reviewed")
                          }
                        >
                          Mark Reviewed
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] px-2 text-chart-1 hover:text-chart-1"
                          disabled={updatingId === item._id}
                          onClick={() =>
                            handleStatusUpdate(item._id, "resolved")
                          }
                        >
                          Resolve
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {!loading && pagination.total_pages > 1 && (
            <Button
              variant="ghost"
              className="w-full mt-1 text-xs text-muted-foreground hover:text-foreground h-8"
              onClick={() => fetchFeedback(activeFilter, pagination.page + 1)}
              disabled={pagination.page >= pagination.total_pages}
            >
              Load more feedback
            </Button>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
