import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileQuestion, Layers } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"

async function getDashboardStats() {
  try {
    const [questionsRes, quizzesRes, levelsRes] = await Promise.all([
      apiClient.get<{ success: boolean; questions: any[] }>("/questions"),
      apiClient.get<{ success: boolean; quizzes: any[] }>("/quizzes"),
      apiClient.get<{ success: boolean; levels: any[] }>("/levels"),
    ])

    return {
      totalQuizzes: quizzesRes.quizzes?.length || 0,
      totalQuestions: questionsRes.questions?.length || 0,
      totalLevels: levelsRes.levels?.length || 0,
      totalStudents: 0,
    }
  } catch (error) {
    return {
      totalQuizzes: 0,
      totalQuestions: 0,
      totalLevels: 0,
      totalStudents: 0,
    }
  }
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-muted-foreground">Here's what's happening with your educational platform</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/questions/create">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Add New Question
              </Button>
            </Link>
            <Link href="/dashboard/quizzes/create">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Create Quiz
              </Button>
            </Link>
            <Link href="/dashboard/levels/create">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                Create Level
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <RecentActivity />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/dashboard/questions">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5" />
                Manage Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">View, edit, and organize your question bank</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/quizzes">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Manage Quizzes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Create and manage quizzes for your students</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/levels">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Manage Levels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Organize quizzes into gamified learning paths</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
