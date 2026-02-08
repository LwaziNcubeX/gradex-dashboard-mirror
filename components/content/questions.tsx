import {
  Plus,
  FileQuestion,
  HelpCircle,
  Edit,
  Copy,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { cookies } from "@/lib/cookie-manager";

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Form 1":
      return "bg-chart-1/10 text-chart-1";
    case "Form 2":
      return "bg-chart-3/10 text-chart-3";
    case "Form 3":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-secondary text-muted-foreground";
  }
}

function ActionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1 hover:bg-accent rounded transition-colors">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-secondary border-border">
        <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-foreground cursor-pointer">
          <Edit className="h-4 w-4 mr-2" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem className="text-foreground focus:bg-accent focus:text-foreground cursor-pointer">
          <Copy className="h-4 w-4 mr-2" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem className="text-destructive focus:bg-accent focus:text-destructive cursor-pointer">
          <Trash2 className="h-4 w-4 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Questions = () => {
  const [overview, setOverview] = useState({});
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await cookies.getAccessToken();
        const response = await fetch(
          "http://0.0.0.0:8000/v1/overview/questions",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        if (data.success) {
          setOverview(data.data);
        } else {
          setOverview({ questions: 0, multi_choice: 0, other: 0 });
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await cookies.getAccessToken();
        const response = await fetch("http://0.0.0.0:8000/v1/questions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setQuestions(data.data);
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Manage individual questions that can be used across quizzes
        </p>
        <Button
          variant={"default"}
          className="flex items-center gap-2 px-4 py-2 bg-background rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Question
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4 font-oswald">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileQuestion className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xl text-muted-foreground">Total Questions</p>
              <p className="text-2xl font-bold text-foreground font-mono">
                {overview?.questions}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-chart-2/10 rounded-lg">
              <HelpCircle className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Multiple Choice</p>
              <p className="text-2xl font-bold text-foreground">
                {overview?.multi_choice}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 bg-chart-5/10 rounded-lg">
              <Edit className="h-6 w-6 text-chart-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Short/Long Answer</p>
              <p className="text-2xl font-bold text-foreground">
                {overview?.other}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">All Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Question
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Difficulty
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Used In
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr
                    key={q._id}
                    className="border-b border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-foreground font-medium max-w-xs truncate">
                      {q?.question_text}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {q.type}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {q.subject}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2 py-1 rounded ${getDifficultyColor(
                          q.difficulty
                        )}`}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground">
                      {q.usedIn} quizzes
                    </td>
                    <td className="py-3 px-4">
                      <ActionMenu />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questions;
