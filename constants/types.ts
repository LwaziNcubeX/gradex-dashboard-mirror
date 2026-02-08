export interface ResponseType {
  data: {};
  message: string;
  success: boolean;
}

//...................CONTENT MANAGEMENT...................//

export interface QuestionType {
  _id: string;
  question_text: string;
  answers: [];
  correct_answer: string;
  difficulty: string;
  subject: string;
  topic: string;
  tags: [];
  explanation: string;
  hint: string;
  hint_text: string;
  status: string;
  hint_xp_cost: number;
  points: number;
  time_limit_seconds: 60;
  updated_at: string;
  created_at: string;
  created_by: string;
}

export const QuestionTable = [
  "",
  "Question",
  "Topic",
  "Subject",
  "Difficulty",
  "Status",
  "UpdatedAt",
];

export function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-chart-1/10 text-chart-1";
    case "archive":
      return "bg-chart-3/10 text-chart-3";
    case "flagged":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-secondary text-muted-foreground";
  }
}

export function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "Form 1":
      return "bg-chart-1/10 text-chart-1";
    case "Form 2":
      return "bg-chart-3/10 text-chart-3";
    case "Form 3":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-secondary text-muted-foreground";
  }
}
