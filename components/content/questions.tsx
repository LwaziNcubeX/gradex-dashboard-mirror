import {
  Plus,
  FileQuestion,
  HelpCircle,
  Edit,
  Copy,
  MoreHorizontal,
  Trash2,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import {
  getDifficultyColor,
  getStatusColor,
  getStatusIcon,
  QuestionTable,
  QuestionType,
  SubjectsList,
} from "@/constants/types";
import { questionService, getAccessToken } from "@/lib";
import { QuestionFilters } from "@/lib/api/questions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { AlertDescription } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Filter } from "lucide-react";
import { Checkbox } from "../ui/checkbox";

interface FilterDialogProps {
  filters: QuestionFilters;
  onFiltersChange: (filters: QuestionFilters) => void;
  onApply: () => void;
}

function FilterDialog({
  filters,
  onFiltersChange,
  onApply,
}: FilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<QuestionFilters>(filters);

  const clearFilters = () => {
    setTempFilters({});
    onFiltersChange({});
  };

  const handleApply = () => {
    onFiltersChange(tempFilters);
    onApply();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-secondary border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Filter Questions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Subject Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Subject
            </label>
            <Select
              value={tempFilters.subject || "all"}
              onValueChange={(value) =>
                setTempFilters((prev) => ({
                  ...prev,
                  subject: value === "all" ? undefined : value,
                }))
              }
            >
              <SelectTrigger className="bg-primary/5 border-border">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-border">
                <SelectItem value="all">All Subjects</SelectItem>
                {SubjectsList.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Difficulty
            </label>
            <Select
              value={tempFilters.difficulty || "all"}
              onValueChange={(value) =>
                setTempFilters((prev) => ({
                  ...prev,
                  difficulty: (value === "all" ? undefined : value) as
                    | "Form 1"
                    | "Form 2"
                    | "Form 3"
                    | "Form 4"
                    | "Mixed"
                    | undefined,
                }))
              }
            >
              <SelectTrigger className="bg-primary/5 border-border">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-border">
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="Form 1">Form 1</SelectItem>
                <SelectItem value="Form 2">Form 2</SelectItem>
                <SelectItem value="Form 3">Form 3</SelectItem>
                <SelectItem value="Form 4">Form 4</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Topic Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Topic</label>
            <input
              type="text"
              placeholder="Enter topic (optional)"
              value={tempFilters.topic || ""}
              onChange={(e) =>
                setTempFilters((prev) => ({
                  ...prev,
                  topic: e.target.value || undefined,
                }))
              }
              className="w-full px-3 py-2 bg-primary/5 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Status
            </label>
            <Select
              value={tempFilters.status || "all"}
              onValueChange={(value) =>
                setTempFilters((prev) => ({
                  ...prev,
                  status: (value === "all" ? undefined : value) as
                    | "draft"
                    | "active"
                    | "archive"
                    | "flagged"
                    | undefined,
                }))
              }
            >
              <SelectTrigger className="bg-primary/5 border-border">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-secondary border-border">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archive">Archive</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="text-foreground"
          >
            Clear All
          </Button>
          <Button
            onClick={handleApply}
            className="bg-primary hover:bg-primary/90"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ActionMenuProps {
  question: QuestionType;
  onDelete: (questionId: string) => Promise<void>;
  isDeleting: boolean;
}

function ActionMenu({ question, onDelete, isDeleting }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const handleDelete = async () => {
    setIsLoadingDelete(true);
    try {
      await onDelete(question._id);
      setIsOpen(false);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsLoadingDelete(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
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
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive focus:bg-accent focus:text-destructive cursor-pointer">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Question</AlertDialogTitle>
          <AlertDescription className="mt-2">
            Are you sure you want to delete this question?
            <p className="font-semibold mt-3 text-foreground truncate">
              "{question.question_text}"
            </p>
          </AlertDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoadingDelete}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoadingDelete}
            className="bg-destructive hover:bg-destructive/80 cursor-pointer"
          >
            {isLoadingDelete ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const StatusIcon = ({ status }: { status: string }) => {
  const IconComponent = getStatusIcon(status);
  return <IconComponent />;
};

const Questions = () => {
  const [overview, setOverview] = useState({
    questions: 0,
    multi_choice: 0,
    other: 0,
  });
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [filters, setFilters] = useState<QuestionFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(
    new Set()
  );

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = getAccessToken();
        const response = await fetch("http://0.0.0.0:8000/overview/questions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();
        if (data.success) {
          setOverview(data.data);
        } else {
          setOverview({ questions: 0, multi_choice: 0, other: 0 });
        }
      } catch (error) {
        console.error("Failed to fetch overview:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await questionService.fetchQuestions(filters);
        setQuestions(data);
        setCurrentPage(1); // Reset to first page when filters change
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const handleDeleteQuestion = async (questionId: string) => {
    setIsDeleting(true);
    try {
      await questionService.deleteQuestion(questionId);
      // Remove the deleted question from the list
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
      // Remove from selected if it was selected
      setSelectedQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    } catch (error) {
      console.error("Failed to delete question:", error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (
      selectedQuestions.size === paginatedQuestions.length &&
      paginatedQuestions.length > 0
    ) {
      // Deselect all on current page
      setSelectedQuestions((prev) => {
        const newSet = new Set(prev);
        paginatedQuestions.forEach((q) => newSet.delete(q._id));
        return newSet;
      });
    } else {
      // Select all on current page
      setSelectedQuestions((prev) => {
        const newSet = new Set(prev);
        paginatedQuestions.forEach((q) => newSet.add(q._id));
        return newSet;
      });
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedQuestions.size === 0) return;

    setIsDeleting(true);
    try {
      for (const questionId of selectedQuestions) {
        await questionService.deleteQuestion(questionId);
      }
      // Remove all deleted questions
      setQuestions((prev) => prev.filter((q) => !selectedQuestions.has(q._id)));
      setSelectedQuestions(new Set());
    } catch (error) {
      console.error("Failed to delete selected questions:", error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedQuestions = questions.slice(startIndex, endIndex);
  const isAllSelected =
    paginatedQuestions.length > 0 &&
    selectedQuestions.size === paginatedQuestions.length;
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
        <CardHeader className="flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <CardTitle className="text-foreground">
              All Questions ({questions.length})
            </CardTitle>
            {selectedQuestions.size > 0 && (
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded">
                {selectedQuestions.size} selected
              </span>
            )}
          </div>
          <FilterDialog
            filters={filters}
            onFiltersChange={setFilters}
            onApply={() => {
              // Refetch will be triggered by setFilters
            }}
          />
        </CardHeader>

        {/* Bulk Actions Bar */}
        {selectedQuestions.size > 0 && (
          <div className="px-6 py-3 bg-primary/5 border-t border-b border-border flex items-center justify-between">
            <div className="text-sm text-foreground">
              {selectedQuestions.size} question
              {selectedQuestions.size !== 1 ? "s" : ""} selected
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedQuestions(new Set())}
              >
                Deselect
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={isDeleting}
              >
                <Trash className="h-4 w-4 mr-2" />
                {isDeleting ? "Deleting..." : "Delete Selected"}
              </Button>
            </div>
          </div>
        )}

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  {QuestionTable.slice(1).map((item, index) => (
                    <th
                      key={index}
                      className="text-left py-3 px-4 text-sm font-medium text-muted-foreground"
                    >
                      {item}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      className="py-3 px-4 text-center text-muted-foreground"
                      colSpan={8}
                    >
                      Loading...
                    </td>
                  </tr>
                ) : paginatedQuestions.length === 0 ? (
                  <tr>
                    <td
                      className="py-3 px-4 text-center text-muted-foreground"
                      colSpan={8}
                    >
                      No questions found
                    </td>
                  </tr>
                ) : (
                  paginatedQuestions.map((q: QuestionType, index) => (
                    <tr
                      key={q._id}
                      className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                        selectedQuestions.has(q._id) ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-center w-12">
                        <Checkbox
                          checked={selectedQuestions.has(q._id)}
                          onCheckedChange={() => handleSelectQuestion(q._id)}
                        />
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground font-medium max-w-75 truncate">
                        {q.question_text}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {q.topic}
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

                      {/* <td className="py-3 px-4 text-sm text-muted-foreground">
                        {readableDate(q.updated_at)}
                      </td> */}
                      <td className="py-3 px-4 text-sm text-foreground rounded-b-md justify-center items-center">
                        <a
                          className={`${getStatusColor(
                            q.status
                          )} p-1 text-center justify-center`}
                        >
                          {q.status}
                        </a>
                      </td>
                      <td className="py-3 px-4">
                        <ActionMenu
                          question={q}
                          onDelete={handleDeleteQuestion}
                          isDeleting={isDeleting}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {questions.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(endIndex, questions.length)} of {questions.length}{" "}
              questions
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1 px-3 py-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded transition-colors ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary text-foreground"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Questions;
