"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import type { Question } from "@/app/dashboard/questions/page"

interface QuestionSelectorProps {
  questions: Question[]
  selectedQuestions: string[]
  onSelectionChange: (selected: string[]) => void
}

export function QuestionSelector({ questions, selectedQuestions, onSelectionChange }: QuestionSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  const subjects = Array.from(new Set(questions.map((q) => q.subject)))
  const levels = ["Form 1", "Form 2", "Form 3", "Form 4"]

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch =
      question.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.topic.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === "all" || question.subject === subjectFilter
    const matchesLevel = levelFilter === "all" || question.level === levelFilter
    return matchesSearch && matchesSubject && matchesLevel
  })

  const handleToggle = (questionId: string) => {
    if (selectedQuestions.includes(questionId)) {
      onSelectionChange(selectedQuestions.filter((id) => id !== questionId))
    } else {
      onSelectionChange([...selectedQuestions, questionId])
    }
  }

  const handleSelectAll = () => {
    if (selectedQuestions.length === filteredQuestions.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(filteredQuestions.map((q) => q.question_id))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Select Questions ({selectedQuestions.length} selected)</CardTitle>
          <button type="button" onClick={handleSelectAll} className="text-sm text-primary hover:underline">
            {selectedQuestions.length === filteredQuestions.length ? "Deselect All" : "Select All"}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filteredQuestions.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No questions found</div>
          ) : (
            filteredQuestions.map((question) => (
              <div
                key={question.question_id}
                className="flex items-start gap-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={selectedQuestions.includes(question.question_id)}
                  onCheckedChange={() => handleToggle(question.question_id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <div className="text-sm">{question.question_text}</div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {question.subject}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {question.level}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {question.topic}
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
