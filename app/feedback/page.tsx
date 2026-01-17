import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Star,
} from "lucide-react";

const feedbackItems = [
  {
    id: 1,
    user: "Sarah J.",
    type: "suggestion",
    message: "Would love to see more practice quizzes for calculus",
    date: "2 hours ago",
    rating: 5,
  },
  {
    id: 2,
    user: "Mike C.",
    type: "bug",
    message: "App crashes when submitting quiz on slow connection",
    date: "5 hours ago",
    rating: null,
  },
  {
    id: 3,
    user: "Emily D.",
    type: "praise",
    message: "The new physics course is amazing! Very helpful explanations",
    date: "1 day ago",
    rating: 5,
  },
  {
    id: 4,
    user: "James W.",
    type: "suggestion",
    message: "Please add dark mode for studying at night",
    date: "1 day ago",
    rating: 4,
  },
  {
    id: 5,
    user: "Anna M.",
    type: "bug",
    message: "Leaderboard not updating after quiz completion",
    date: "2 days ago",
    rating: null,
  },
  {
    id: 6,
    user: "David L.",
    type: "praise",
    message: "Best learning app I've used. Keep up the great work!",
    date: "3 days ago",
    rating: 5,
  },
];

export default function FeedbackPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Feedback</h1>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            All
          </Button>
          <Button variant="secondary" size="sm">
            Bugs
          </Button>
          <Button variant="secondary" size="sm">
            Suggestions
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Feedback</p>
              <p className="text-2xl font-bold text-foreground">1,247</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-chart-2/10 rounded-lg">
              <ThumbsUp className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Positive</p>
              <p className="text-2xl font-bold text-foreground">892</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-chart-3/10 rounded-lg">
              <AlertCircle className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Suggestions</p>
              <p className="text-2xl font-bold text-foreground">267</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <ThumbsDown className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bug Reports</p>
              <p className="text-2xl font-bold text-foreground">88</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedbackItems.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-secondary/50 rounded-lg border border-border"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {item.user.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{item.user}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-chart-3 fill-chart-3" />
                      <span className="text-sm text-foreground">
                        {item.rating}
                      </span>
                    </div>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.type === "praise"
                        ? "bg-primary/10 text-primary"
                        : item.type === "suggestion"
                        ? "bg-chart-2/10 text-chart-2"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                {item.message}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
