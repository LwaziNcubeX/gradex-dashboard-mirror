"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Eye, Trash2, Search, Edit } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { CONFIG } from "@/lib/config";

interface Quiz {
  _id: string;
  title: string;
  description: string;
  subject: string;
  category: string;
  tags: string[];
  duration: number;
  level: string;
  questions: string[];
  level_id: string | null;
  xp_reward: number;
  difficulty_score: number;
  created_at: string;
  updated_at: string;
  completion_count: number;
  average_score: number;
  is_active: boolean;
  is_locked: boolean;
}

interface QuizTableProps {
  quizzes: Quiz[];
}

export function QuizTable({ quizzes }: QuizTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (quizId: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        await apiClient.delete(CONFIG.ENDPOINTS.QUIZZES.DELETE(quizId));
        window.location.reload();
      } catch (error) {
        alert("Failed to delete quiz");
      }
    }
  };

  const handleView = (quiz: Quiz) => {
    console.log("View quiz:", quiz);
  };

  const handleEdit = (quiz: Quiz) => {
    console.log("Edit quiz:", quiz);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>XP Reward</TableHead>
              <TableHead>Difficulty</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuizzes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center text-muted-foreground"
                >
                  No quizzes found
                </TableCell>
              </TableRow>
            ) : (
              filteredQuizzes.map((quiz) => (
                <TableRow key={quiz._id}>
                  <TableCell className="font-medium max-w-xs">
                    <div className="truncate" title={quiz.title}>
                      {quiz.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{quiz.subject}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{quiz.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{quiz.level}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {quiz.duration} min
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {Array.isArray(quiz.questions)
                        ? quiz.questions.length
                        : 0}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {quiz.xp_reward} XP
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < quiz.difficulty_score
                                ? "bg-red-400"
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">
                        {quiz.difficulty_score}/5
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(quiz.tags) && quiz.tags.length > 0 ? (
                      <div className="flex gap-1 flex-wrap max-w-xs">
                        {quiz.tags.slice(0, 2).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))}
                        {quiz.tags.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{quiz.tags.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        No tags
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={quiz.is_active ? "default" : "secondary"}>
                      {quiz.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(quiz)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(quiz)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(quiz._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
