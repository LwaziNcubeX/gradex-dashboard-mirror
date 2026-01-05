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
  Layers,
  Trophy,
  Target,
  TrendingUp,
  Zap,
  Lock,
  Unlock,
  Star,
  Eye,
  Grid3x3,
  List,
  Filter,
} from "lucide-react";
import { CreateLevelDialog } from "./create-level";
import { EditLevelDialog } from "./edit-level";
import { DeleteLevelDialog } from "./delete-level";
import type { Level } from "@/hooks/use-levels";

export function LevelsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedFormLevel, setSelectedFormLevel] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("grid");
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
        level.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        level.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject =
        selectedSubject === "all" || level.subject === selectedSubject;
      const matchesStatus =
        selectedStatus === "all" || level.status === selectedStatus;
      const matchesFormLevel =
        selectedFormLevel === "all" || level.form_level === selectedFormLevel;
      return (
        matchesSearch && matchesSubject && matchesStatus && matchesFormLevel
      );
    });
  }, [levels, searchQuery, selectedSubject, selectedStatus, selectedFormLevel]);

  const stats = useMemo(() => {
    const totalQuizzes = levels.reduce(
      (sum, l) => sum + (l.quiz_ids?.length || 0),
      0
    );
    const avgXp = levels.length
      ? Math.round(
          levels.reduce((sum, l) => sum + l.total_xp_reward, 0) / levels.length
        )
      : 0;

    return {
      total: levels.length,
      active: levels.filter((l) => l.status === "active").length,
      totalQuizzes,
      avgXp,
    };
  }, [levels]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "draft":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "inactive":
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      Mathematics: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      Geography: "bg-green-500/10 text-green-400 border-green-500/20",
      English: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      History: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      Science: "bg-red-500/10 text-red-400 border-red-500/20",
      "Combined Science": "bg-teal-500/10 text-teal-400 border-teal-500/20",
    };
    return colors[subject] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  };

  const getDifficultyStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Levels",
            value: stats.total,
            icon: Layers,
            color: "bg-blue-500/10 border-blue-500/20",
            iconColor: "text-blue-400",
            trend: `${stats.active} active`,
          },
          {
            label: "Active Levels",
            value: stats.active,
            icon: Unlock,
            color: "bg-green-500/10 border-green-500/20",
            iconColor: "text-green-400",
            trend: "Ready to play",
          },
          {
            label: "Total Quizzes",
            value: stats.totalQuizzes,
            icon: Target,
            color: "bg-purple-500/10 border-purple-500/20",
            iconColor: "text-purple-400",
            trend: "Across all levels",
          },
          {
            label: "Avg XP Reward",
            value: stats.avgXp,
            icon: Zap,
            color: "bg-amber-500/10 border-amber-500/20",
            iconColor: "text-amber-400",
            trend: "Per level",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            className={`${stat.color} border transition-all hover:shadow-md`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.trend}</p>
              </div>
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

      {/* Enhanced Filters */}
      <Card className="border">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="h-8 w-8 p-0"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search levels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>
            </div>

            <div>
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

            <div>
              <label className="text-sm font-medium mb-2 block">
                Form Level
              </label>
              <Select
                value={selectedFormLevel}
                onValueChange={setSelectedFormLevel}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="All forms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All forms</SelectItem>
                  <SelectItem value="Form 1">Form 1</SelectItem>
                  <SelectItem value="Form 2">Form 2</SelectItem>
                  <SelectItem value="Form 3">Form 3</SelectItem>
                  <SelectItem value="Form 4">Form 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
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
          </div>

          {(searchQuery ||
            selectedSubject !== "all" ||
            selectedStatus !== "all" ||
            selectedFormLevel !== "all") && (
            <div className="mt-4 flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Showing {filteredLevels.length} of {levels.length} levels
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSubject("all");
                  setSelectedStatus("all");
                  setSelectedFormLevel("all");
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
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

      {/* Levels Display */}
      {filteredLevels.length > 0 && (
        <>
          {viewMode === "table" ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/30">
                      <tr>
                        <th className="text-left px-4 py-3 font-semibold">
                          Level
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Subject
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Form
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Quizzes
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          Difficulty
                        </th>
                        <th className="text-left px-4 py-3 font-semibold">
                          XP Reward
                        </th>
                        <th className="text-right px-4 py-3 font-semibold">
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
                          <td className="px-4 py-4">
                            <div>
                              <p className="font-medium text-foreground">
                                {level.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Level {level.level_number}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${getSubjectColor(
                                level.subject
                              )}`}
                            >
                              {level.subject}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-sm">{level.form_level}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Target className="h-4 w-4" />
                              <span className="font-semibold">
                                {level.quiz_ids?.length || 0}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${getStatusColor(
                                level.status
                              )}`}
                            >
                              {level.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              {getDifficultyStars(level.difficulty_rating)}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <Zap className="h-4 w-4 text-amber-400" />
                              <span className="font-semibold">
                                {level.total_xp_reward}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right">
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
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
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
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredLevels.map((level) => (
                <Card
                  key={level._id}
                  className="hover:shadow-lg transition-all group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 p-2">
                          <Layers className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-xs font-semibold text-muted-foreground">
                          Level {level.level_number}
                        </span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
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
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                          {level.title}
                        </h3>
                        {level.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {level.description}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${getSubjectColor(
                            level.subject
                          )}`}
                        >
                          {level.subject}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${getStatusColor(
                            level.status
                          )}`}
                        >
                          {level.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 pt-2">
                        <span className="text-xs text-muted-foreground mr-1">
                          Difficulty:
                        </span>
                        {getDifficultyStars(level.difficulty_rating)}
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {level.quiz_ids?.length || 0}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            quizzes
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {level.form_level}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-amber-400" />
                          <span className="text-lg font-bold">
                            {level.total_xp_reward} XP
                          </span>
                        </div>
                        <div className="text-right">
                          {level.bonus_coins > 0 && (
                            <div className="flex items-center gap-1 text-sm">
                              <Trophy className="h-4 w-4 text-amber-400" />
                              <span className="font-semibold">
                                {level.bonus_coins}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {level.is_starter_level && (
                        <div className="pt-2">
                          <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-400 border-blue-500/30"
                          >
                            Starter Level
                          </Badge>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
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
