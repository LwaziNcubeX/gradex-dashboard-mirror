"use client";

import { useState } from "react";
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
} from "lucide-react";

const feedbackItems = [
  { id: 1, user: "Sarah J.", avatar: "S", type: "suggestion", message: "Would love to see more practice quizzes for calculus", date: "2 hours ago", rating: 5 },
  { id: 2, user: "Mike C.", avatar: "M", type: "bug", message: "App crashes when submitting quiz on slow connection", date: "5 hours ago", rating: null },
  { id: 3, user: "Emily D.", avatar: "E", type: "praise", message: "The new physics course is amazing! Very helpful explanations", date: "1 day ago", rating: 5 },
  { id: 4, user: "James W.", avatar: "J", type: "suggestion", message: "Please add dark mode for studying at night", date: "1 day ago", rating: 4 },
  { id: 5, user: "Anna M.", avatar: "A", type: "bug", message: "Leaderboard not updating after quiz completion", date: "2 days ago", rating: null },
  { id: 6, user: "David L.", avatar: "D", type: "praise", message: "Best learning app I've used. Keep up the great work!", date: "3 days ago", rating: 5 },
];

const summaryMetrics = [
  { label: "Total Feedback", value: "1,247", icon: MessageSquare, color: "primary" },
  { label: "Positive", value: "892", icon: ThumbsUp, color: "chart-1" },
  { label: "Suggestions", value: "267", icon: AlertCircle, color: "chart-3" },
  { label: "Bug Reports", value: "88", icon: ThumbsDown, color: "destructive" },
];

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
};

const filters = ["All", "Praise", "Suggestions", "Bugs"];

export default function FeedbackPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredItems = feedbackItems.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Praise") return item.type === "praise";
    if (activeFilter === "Suggestions") return item.type === "suggestion";
    if (activeFilter === "Bugs") return item.type === "bug";
    return true;
  });

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-oswald tracking-tight text-foreground">Feedback</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Review and manage user feedback.</p>
        </div>
        <div className="flex items-center bg-secondary rounded-md p-0.5">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeFilter === filter
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {summaryMetrics.map((metric) => {
          const colors = metricColors[metric.color];
          return (
            <Card key={metric.label} className="rounded-xl border-border/50 py-0">
              <CardContent className="p-3 flex items-center gap-2.5">
                <div className={`p-1.5 rounded-md ${colors.bg}`}>
                  <metric.icon className={`h-4 w-4 ${colors.text}`} />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{metric.label}</p>
                  <p className="text-lg font-bold text-foreground leading-tight">{metric.value}</p>
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
            <span className="text-muted-foreground font-normal ml-2">({filteredItems.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex flex-col gap-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-primary text-xs font-semibold">{item.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-foreground">{item.user}</span>
                  <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${typeStyles[item.type]}`}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Badge>
                  {item.rating && (
                    <div className="flex items-center gap-0.5 ml-auto">
                      <Star className="h-3 w-3 text-chart-3 fill-chart-3" />
                      <span className="text-[11px] text-foreground font-medium">{item.rating}</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.message}</p>
                <span className="text-[11px] text-muted-foreground/70 mt-1.5 block">{item.date}</span>
              </div>
            </div>
          ))}

          <Button variant="ghost" className="w-full mt-1 text-xs text-muted-foreground hover:text-foreground h-8">
            Load more feedback
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
