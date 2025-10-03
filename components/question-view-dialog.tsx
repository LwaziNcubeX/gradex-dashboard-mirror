import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import type { Question } from "@/app/dashboard/questions/page"

interface QuestionViewDialogProps {
  question: Question
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuestionViewDialog({ question, open, onOpenChange }: QuestionViewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Question Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Subject & Topic</div>
            <div className="flex gap-2">
              <Badge>{question.subject}</Badge>
              <Badge variant="outline">{question.topic}</Badge>
              <Badge variant="secondary">{question.level}</Badge>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-1">Subtopics</div>
            <div className="flex flex-wrap gap-2">
              {question.subtopics.map((subtopic, index) => (
                <Badge key={index} variant="outline">
                  {subtopic}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Question</div>
            <div className="text-base">{question.question_text}</div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Answers</div>
            <div className="space-y-2">
              {question.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-3 rounded-lg border ${
                    answer === question.correct_answer ? "bg-green-500/10 border-green-500/50" : "bg-muted/50"
                  }`}
                >
                  {answer === question.correct_answer && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  <span>{answer}</span>
                </div>
              ))}
            </div>
          </div>

          {question.hint && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">Hint</div>
              <div className="text-sm bg-muted/50 p-3 rounded-lg">{question.hint}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
