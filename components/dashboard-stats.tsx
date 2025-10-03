import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileQuestion, Layers, Users } from "lucide-react"

interface DashboardStatsProps {
  stats: {
    totalQuizzes: number
    totalQuestions: number
    totalLevels: number
    totalStudents: number
  }
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total Quizzes",
      value: stats.totalQuizzes,
      icon: BookOpen,
      description: "Active quizzes",
    },
    {
      title: "Question Bank",
      value: stats.totalQuestions,
      icon: FileQuestion,
      description: "Available questions",
    },
    {
      title: "Levels",
      value: stats.totalLevels,
      icon: Layers,
      description: "Gamified levels",
    },
    {
      title: "Students",
      value: stats.totalStudents,
      icon: Users,
      description: "Active learners",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
