"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import type { Quiz } from "@/app/dashboard/quizzes/page"

interface QuizSelectorProps {
  quizzes: Quiz[]
  selectedQuizzes: string[]
  onSelectionChange: (selected: string[]) => void
}

export function QuizSelector({ quizzes, selectedQuizzes, onSelectionChange }: QuizSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleToggle = (quizId: string) => {
    if (selectedQuizzes.includes(quizId)) {
      onSelectionChange(selectedQuizzes.filter((id) => id !== quizId))
    } else {
      onSelectionChange([...selectedQuizzes, quizId])
    }
  }

  const handleSelectAll = () => {
    if (selectedQuizzes.length === filteredQuizzes.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(filteredQuizzes.map((q) => q.quiz_id))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Quizzes ({selectedQuizzes.length} selected)</CardTitle>
          <button type="button" onClick={handleSelectAll} className="text-sm text-primary hover:underline">
            {selectedQuizzes.length === filteredQuizzes.length ? "Deselect All" : "Select All"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredQuizzes.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No quizzes found</div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <div
                key={quiz.quiz_id}
                className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={selectedQuizzes.includes(quiz.quiz_id)}
                  onCheckedChange={() => handleToggle(quiz.quiz_id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="font-medium">{quiz.title}</div>
                  <div className="text-sm text-muted-foreground">{quiz.description}</div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {quiz.subject}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {quiz.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {quiz.questions.length} questions
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
