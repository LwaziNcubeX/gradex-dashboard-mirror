import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { LevelsTable } from "@/components/levels-table"
import { apiClient } from "@/lib/api-client"

export interface Level {
  level_id: string
  name: string
  description: string
  quizzes: string[]
  created_at: string
}

async function getLevels() {
  try {
    const response = await apiClient.get<{ success: boolean; levels: Level[] }>("/levels")
    return response.levels || []
  } catch (error) {
    return []
  }
}

export default async function LevelsPage() {
  const levels = await getLevels()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Levels</h2>
          <p className="text-muted-foreground">Organize quizzes into gamified learning levels</p>
        </div>
        <Link href="/dashboard/levels/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Level
          </Button>
        </Link>
      </div>

      <LevelsTable levels={levels} />
    </div>
  )
}
