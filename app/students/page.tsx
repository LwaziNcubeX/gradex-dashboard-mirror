import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Award, Clock } from "lucide-react";

const students = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    quizzes: 45,
    avgScore: 92,
    streak: 12,
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike@email.com",
    quizzes: 38,
    avgScore: 88,
    streak: 7,
  },
  {
    id: 3,
    name: "Emily Davis",
    email: "emily@email.com",
    quizzes: 52,
    avgScore: 95,
    streak: 21,
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james@email.com",
    quizzes: 29,
    avgScore: 79,
    streak: 3,
  },
  {
    id: 5,
    name: "Anna Martinez",
    email: "anna@email.com",
    quizzes: 41,
    avgScore: 86,
    streak: 9,
  },
  {
    id: 6,
    name: "David Lee",
    email: "david@email.com",
    quizzes: 33,
    avgScore: 91,
    streak: 14,
  },
];

export default function StudentsPage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Students</h1>
        <Button>Add Student</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-2xl font-bold text-foreground">2,847</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-chart-2/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Today</p>
              <p className="text-2xl font-bold text-foreground">1,234</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-chart-3/10 rounded-lg">
              <Award className="h-6 w-6 text-chart-3" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Top Performers</p>
              <p className="text-2xl font-bold text-foreground">156</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-chart-5/10 rounded-lg">
              <Clock className="h-6 w-6 text-chart-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. Study Time</p>
              <p className="text-2xl font-bold text-foreground">45m</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Quizzes
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Avg Score
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Streak
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-foreground font-medium">
                      {student.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {student.email}
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {student.quizzes}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-sm font-medium ${
                          student.avgScore >= 90
                            ? "text-chart-1"
                            : student.avgScore >= 80
                            ? "text-chart-3"
                            : "text-destructive"
                        }`}
                      >
                        {student.avgScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {student.streak} days
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
