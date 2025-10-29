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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Trash2, Search } from "lucide-react";
import type { Question } from "@/app/dashboard/questions/page";
import { QuestionViewDialog } from "./question-view-dialog";
import { apiClient } from "@/lib/api-client";
import { CONFIG } from "@/lib/config";

interface QuestionsTableProps {
  questions: Question[];
}

export function QuestionsTable({ questions }: QuestionsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const subjects = Array.from(new Set(questions.map((q) => q.subject)));
  const levels = ["Form 1", "Form 2", "Form 3", "Form 4"];

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.topic.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject =
      subjectFilter === "all" || question.subject === subjectFilter;
    const matchesLevel =
      levelFilter === "all" || question.level === levelFilter;
    return matchesSearch && matchesSubject && matchesLevel;
  });

  const handleDelete = async (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      try {
        await apiClient.delete(CONFIG.ENDPOINTS.QUESTIONS.DELETE(questionId));
        window.location.reload();
      } catch (error) {
        alert("Failed to delete question");
      }
    }
  };

  const handleView = (question: Question) => {
    setSelectedQuestion(question);
    setViewDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {levels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuestions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground"
                >
                  No questions found
                </TableCell>
              </TableRow>
            ) : (
              filteredQuestions.map((question, index) => (
                <TableRow
                  key={`question-${
                    question.id || question._id || question.question_id
                  }-${index}`}
                >
                  <TableCell className="max-w-md">
                    <div className="truncate" title={question.question_text}>
                      {question.question_text}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{question.subject}</Badge>
                  </TableCell>
                  <TableCell>{question.topic}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{question.level}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(question)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDelete(
                            question.id ||
                              question._id ||
                              question.question_id ||
                              ""
                          )
                        }
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

      {selectedQuestion && (
        <QuestionViewDialog
          question={selectedQuestion}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      )}
    </div>
  );
}
