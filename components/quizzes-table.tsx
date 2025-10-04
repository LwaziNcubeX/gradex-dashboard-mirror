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
import { Eye, Trash2, Search } from "lucide-react";
import type { Quiz } from "@/app/dashboard/quizzes/page";

interface QuizzesTableProps {
  quizzes: Quiz[];
}

export function QuizzesTable({ quizzes }: QuizzesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (quizId: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        await fetch(`http://0.0.0.0:8000/quiz/${quizId}`, {
          method: "DELETE",
          credentials: "include",
        });
        window.location.reload();
      } catch (error) {
        alert("Failed to delete quiz");
      }
    }
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
              <TableHead>Level</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuizzes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No quizzes found
                </TableCell>
              </TableRow>
            ) : (
              filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.quiz_id}>
                  <TableCell className="font-medium">{quiz.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{quiz.subject}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{quiz.level}</Badge>
                  </TableCell>
                  <TableCell>{quiz.questions.length} questions</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(quiz.quiz_id)}
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
