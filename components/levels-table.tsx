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
import { Input } from "@/components/ui/input";
import { Eye, Trash2, Search } from "lucide-react";
import type { Level } from "@/app/dashboard/levels/page";

interface LevelsTableProps {
  levels: Level[];
}

export function LevelsTable({ levels }: LevelsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLevels = levels.filter((level) =>
    level.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (levelId: string) => {
    if (confirm("Are you sure you want to delete this level?")) {
      try {
        await fetch(`http://0.0.0.0:8000/level/${levelId}`, {
          method: "DELETE",
          credentials: "include",
        });
        window.location.reload();
      } catch (error) {
        alert("Failed to delete level");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search levels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Quizzes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLevels.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No levels found
                </TableCell>
              </TableRow>
            ) : (
              filteredLevels.map((level) => (
                <TableRow key={level.level_id}>
                  <TableCell className="font-medium">{level.name}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate">{level.description}</div>
                  </TableCell>
                  <TableCell>{level.quizzes.length} quizzes</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(level.level_id)}
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
