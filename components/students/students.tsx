import { Badge } from "@/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  StudentTable,
  StudentTableHeader,
  StudentType,
} from "@/constants/types";
import { studentService } from "@/lib/api/students";

const StudentsTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<StudentType[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await studentService.getAllStudents();
        console.log(response);
        setStudents(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.user_id.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  return (
    <div>
      <Card className="rounded-xl  pt-3">
        <CardHeader className="px-4 ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <CardTitle className="text-2xl  font-medium text-foreground">
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
                {students.map((student, index) => (
                  <TableRow key={student._id} className="border-border ">
                    <TableCell className="text-muted-foreground text-sm py-2.5 hidden md:table-cell">
                      {student.user_id}
                    </TableCell>
                    <TableCell className="text-foreground text-sm py-2.5 tabular-nums">
                      {student.first_name + " " + student.last_name}
                    </TableCell>
                    <TableCell className=" text-foreground text-sm py-2.5 tabular-nums">
                      0
                    </TableCell>
                    <TableCell className=" py-2.5">
                      <span
                        className={`text-sm font-medium tabular-nums ${
                          student.avgScore >= 90
                            ? "text-chart-1"
                            : student.avgScore >= 80
                              ? "text-chart-3"
                              : "text-destructive"
                        }`}
                      >
                        {student.avgScore || 0}%
                      </span>
                    </TableCell>
                    <TableCell className=" text-sm py-2.5 hidden sm:table-cell">
                      <span className="text-foreground tabular-nums">
                        {student.streak || 0} days
                      </span>
                    </TableCell>
                    <TableCell className=" py-2.5 hidden sm:table-cell">
                      <Badge
                        variant={
                          student.status === "active" ? "default" : "secondary"
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
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {filteredStudents.length} of {students.length} students
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 bg-primary/10 text-primary border-primary/20"
              >
                1
              </Button>
              <Button variant="outline" size="sm" className="h-7 w-7">
                2
              </Button>
              <Button variant="outline" size="sm" className="h-7 w-7">
                3
              </Button>
              <Button variant="outline" size="icon" className="h-7 w-7">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsTable;
