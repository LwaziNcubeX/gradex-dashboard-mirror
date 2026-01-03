"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Mail, UserX, Users, GraduationCap, Trophy, Flame } from "lucide-react"

// Dummy student data
const studentsData = [
  {
    id: "1",
    name: "Tendai Moyo",
    email: "tendai@example.com",
    form: "Form 4",
    xp: 4520,
    level: 12,
    streak: 28,
    status: "active",
    quizzes: 45,
  },
  {
    id: "2",
    name: "Chipo Ndlovu",
    email: "chipo@example.com",
    form: "Form 3",
    xp: 4380,
    level: 11,
    streak: 21,
    status: "active",
    quizzes: 42,
  },
  {
    id: "3",
    name: "Kudakwashe Banda",
    email: "kuda@example.com",
    form: "Form 4",
    xp: 4150,
    level: 11,
    streak: 18,
    status: "active",
    quizzes: 38,
  },
  {
    id: "4",
    name: "Rudo Zimuto",
    email: "rudo@example.com",
    form: "Form 2",
    xp: 3920,
    level: 10,
    streak: 15,
    status: "active",
    quizzes: 35,
  },
  {
    id: "5",
    name: "Tanaka Sibanda",
    email: "tanaka@example.com",
    form: "Form 1",
    xp: 3780,
    level: 10,
    streak: 12,
    status: "inactive",
    quizzes: 32,
  },
  {
    id: "6",
    name: "Nyasha Mutasa",
    email: "nyasha@example.com",
    form: "Form 3",
    xp: 3500,
    level: 9,
    streak: 8,
    status: "active",
    quizzes: 30,
  },
  {
    id: "7",
    name: "Tatenda Chirwa",
    email: "tatenda@example.com",
    form: "Form 2",
    xp: 3200,
    level: 8,
    streak: 5,
    status: "active",
    quizzes: 28,
  },
  {
    id: "8",
    name: "Farai Moyo",
    email: "farai@example.com",
    form: "Form 1",
    xp: 2800,
    level: 7,
    streak: 0,
    status: "inactive",
    quizzes: 22,
  },
]

export function StudentsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedForm, setSelectedForm] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesForm = selectedForm === "all" || student.form === selectedForm
      const matchesStatus = selectedStatus === "all" || student.status === selectedStatus
      return matchesSearch && matchesForm && matchesStatus
    })
  }, [searchQuery, selectedForm, selectedStatus])

  const stats = useMemo(
    () => ({
      total: studentsData.length,
      active: studentsData.filter((s) => s.status === "active").length,
      avgXp: Math.round(studentsData.reduce((sum, s) => sum + s.xp, 0) / studentsData.length),
      avgStreak: Math.round(studentsData.reduce((sum, s) => sum + s.streak, 0) / studentsData.length),
    }),
    [],
  )

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Students", value: stats.total, icon: Users },
          { label: "Active Students", value: stats.active, icon: GraduationCap },
          { label: "Avg. XP", value: stats.avgXp.toLocaleString(), icon: Trophy },
          { label: "Avg. Streak", value: `${stats.avgStreak} days`, icon: Flame },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-2 block">Form Level</label>
              <Select value={selectedForm} onValueChange={setSelectedForm}>
                <SelectTrigger>
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
            <div className="w-full md:w-48">
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(searchQuery || selectedForm !== "all" || selectedStatus !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedForm("all")
                  setSelectedStatus("all")
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3 font-medium">Student</th>
                  <th className="text-left px-6 py-3 font-medium">Form</th>
                  <th className="text-left px-6 py-3 font-medium">Level</th>
                  <th className="text-left px-6 py-3 font-medium">XP</th>
                  <th className="text-left px-6 py-3 font-medium">Streak</th>
                  <th className="text-left px-6 py-3 font-medium">Quizzes</th>
                  <th className="text-left px-6 py-3 font-medium">Status</th>
                  <th className="text-right px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">{student.form}</td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{student.level}</Badge>
                    </td>
                    <td className="px-6 py-4 font-medium">{student.xp.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Flame
                          className={`h-4 w-4 ${student.streak > 0 ? "text-orange-500" : "text-muted-foreground"}`}
                        />
                        <span>{student.streak}d</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{student.quizzes}</td>
                    <td className="px-6 py-4">
                      <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-destructive">
                            <UserX className="mr-2 h-4 w-4" />
                            Deactivate
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
    </div>
  )
}
