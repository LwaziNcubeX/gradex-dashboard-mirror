"use client";

import { useState, useMemo } from "react";
import { useLevels } from "@/hooks/use-levels";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Loader2,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Search,
  BookOpen,
} from "lucide-react";
import { CreateLevelDialog } from "./create-level";
import { EditLevelDialog } from "./edit-level";
import { DeleteLevelDialog } from "./delete-level";
import type { Level } from "@/hooks/use-levels";

export function LevelsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<Level | null>(null);
  const [deletingLevel, setDeletingLevel] = useState<Level | null>(null);

  const { levels, isLoading, error } = useLevels();

  const subjects = useMemo(
    () => Array.from(new Set(levels.map((l) => l.subject))).sort(),
    [levels]
  );

  const filteredLevels = useMemo(() => {
    return levels.filter((level) => {
      const matchesSearch =
        level.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        level.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject =
        selectedSubject === "all" || level.subject === selectedSubject;
      const matchesStatus =
        selectedStatus === "all" || level.status === selectedStatus;
      return matchesSearch && matchesSubject && matchesStatus;
    });
  }, [levels, searchQuery, selectedSubject, selectedStatus]);

  const stats = useMemo(() => {
    return {
      total: levels.length,
      active: levels.filter((l) => l.status === "active").length,
      draft: levels.filter((l) => l.status === "draft").length,
      inactive: levels.filter((l) => l.status === "inactive").length,
    };
  }, [levels]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "draft":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Levels", value: stats.total, color: "bg-blue-50" },
          { label: "Active", value: stats.active, color: "bg-green-50" },
          { label: "Draft", value: stats.draft, color: "bg-yellow-50" },
          { label: "Inactive", value: stats.inactive, color: "bg-gray-50" },
        ].map((stat) => (
          <Card key={stat.label} className={`${stat.color} border-0`}>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Levels</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create, edit, and manage educational levels
          </p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Level
        </Button>
      </div>

      {/* Filters */}
      <Card className="border">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <div className="min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(searchQuery ||
              selectedSubject !== "all" ||
              selectedStatus !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("all");
                  setSelectedStatus("all");
                }}
                className="bg-background"
              >
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <div className="flex gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Failed to load levels</p>
            <p className="text-xs opacity-90">{error.message}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !levels.length && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading levels...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredLevels.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">
              {levels.length === 0
                ? "No levels yet. Create your first level to get started."
                : "No levels match your filters."}
            </p>
            {levels.length === 0 && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Level
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Levels Table */}
      {filteredLevels.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold">Level</th>
                    <th className="text-left px-6 py-3 font-semibold">
                      Subject
                    </th>
                    <th className="text-left px-6 py-3 font-semibold">Form</th>
                    <th className="text-left px-6 py-3 font-semibold">
                      Status
                    </th>
                    <th className="text-left px-6 py-3 font-semibold">
                      Difficulty
                    </th>
                    <th className="text-left px-6 py-3 font-semibold">
                      XP Reward
                    </th>
                    <th className="text-right px-6 py-3 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLevels.map((level) => (
                    <tr
                      key={level._id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{level.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Level {level.level_number}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{level.subject}</td>
                      <td className="px-6 py-4">{level.form_level}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={getStatusColor(level.status)}
                        >
                          {level.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">
                          {level.difficulty_rating}/5
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold">
                          {level.total_xp_reward}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => setEditingLevel(level)}
                              className="gap-2 cursor-pointer"
                            >
                              <Edit className="h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingLevel(level)}
                              className="gap-2 cursor-pointer text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <CreateLevelDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {editingLevel && (
        <EditLevelDialog
          open={!!editingLevel}
          onOpenChange={(open) => !open && setEditingLevel(null)}
          level={editingLevel}
        />
      )}

      {deletingLevel && (
        <DeleteLevelDialog
          open={!!deletingLevel}
          onOpenChange={(open) => !open && setDeletingLevel(null)}
          level={deletingLevel}
        />
      )}
    </div>
  );
}
