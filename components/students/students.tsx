"use client";

import { Badge } from "@/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { StudentTableHeader, StudentType } from "@/constants/types";
import { studentService, type PaginatedStudents } from "@/lib/api/students";
import { StudentDetailSheet } from "./student-detail-sheet";

const StudentsTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [students, setStudents] = useState<StudentType[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total_items: 0,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  });
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentType | null>(
    null,
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchStudents = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        const result: PaginatedStudents = await studentService.getAllStudents({
          page,
          page_size: 20,
          search: debouncedSearch || undefined,
        });
        setStudents(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch],
  );

  // Re-fetch on search or page change
  useEffect(() => {
    fetchStudents(1);
  }, [debouncedSearch, fetchStudents]);

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.total_pages) return;
    fetchStudents(page);
  };

  return (
    <div>
      <Card className="rounded-xl pt-3">
        <CardHeader className="px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-2xl font-medium text-foreground">
              All Students
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  {StudentTableHeader.map((item, index) => (
                    <TableHead
                      key={index}
                      className="text-muted-foreground font-medium text-xs hidden md:table-cell"
                    >
                      {item}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i} className="border-border">
                      <TableCell className="py-2.5 hidden md:table-cell">
                        <div className="h-4 w-20 bg-secondary rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="h-4 w-32 bg-secondary rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="h-4 w-8 bg-secondary rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="py-2.5">
                        <div className="h-4 w-10 bg-secondary rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="py-2.5 hidden sm:table-cell">
                        <div className="h-4 w-14 bg-secondary rounded animate-pulse" />
                      </TableCell>
                      <TableCell className="py-2.5 hidden sm:table-cell">
                        <div className="h-5 w-14 bg-secondary rounded animate-pulse" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground text-sm"
                    >
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow
                      key={student.user_id}
                      className="border-border cursor-pointer hover:bg-secondary/50"
                      onClick={() => {
                        setSelectedStudent(student);
                        setSheetOpen(true);
                      }}
                    >
                      <TableCell className="text-muted-foreground text-sm py-2.5 hidden md:table-cell">
                        {student.user_id}
                      </TableCell>
                      <TableCell className="text-foreground text-sm py-2.5 tabular-nums">
                        {student.first_name + " " + student.last_name}
                      </TableCell>
                      <TableCell className="text-foreground text-sm py-2.5 tabular-nums">
                        —
                      </TableCell>
                      <TableCell className="py-2.5">
                        <span
                          className={`text-sm font-medium tabular-nums ${
                            (student.avgScore ?? 0) >= 90
                              ? "text-chart-1"
                              : (student.avgScore ?? 0) >= 80
                                ? "text-chart-3"
                                : "text-destructive"
                          }`}
                        >
                          {student.avgScore ?? 0}%
                        </span>
                      </TableCell>
                      <TableCell className="text-sm py-2.5 hidden sm:table-cell">
                        <span className="text-foreground tabular-nums">
                          {student.streak ?? 0} days
                        </span>
                      </TableCell>
                      <TableCell className="py-2.5 hidden sm:table-cell">
                        <Badge
                          variant={
                            student.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={`text-[10px] px-1.5 py-0 ${
                            student.status === "active"
                              ? "bg-chart-1/10 text-chart-1 border-chart-1/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {students.length} of {pagination.total_items} students
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={!pagination.has_prev}
                onClick={() => goToPage(pagination.page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from(
                { length: Math.min(pagination.total_pages, 5) },
                (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant="outline"
                      size="sm"
                      className={`h-7 w-7 ${
                        page === pagination.page
                          ? "bg-primary/10 text-primary border-primary/20"
                          : ""
                      }`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  );
                },
              )}
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={!pagination.has_next}
                onClick={() => goToPage(pagination.page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <StudentDetailSheet
        student={selectedStudent}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChanged={(userId, status) => {
          setStudents((prev) =>
            prev.map((s) => (s.user_id === userId ? { ...s, status } : s)),
          );
        }}
      />
    </div>
  );
};

export default StudentsTable;
