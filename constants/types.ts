//...................INTERFACE...................//

import {
  Archive,
  ArchiveX,
  Box,
  Check,
  CheckCheck,
  Pen,
  PenOff,
  X,
} from "lucide-react";

export interface ResponseType {
  data: {};
  message: string;
  success: boolean;
}

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

export interface StudentType {
  _id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  status: string;
}

//...................CONSTANTS...................//

export const QuestionTable = [
  "Select",
  "QUESTION",
  "TOPIC",
  "SUBJECT",
  "DIFFICULTY",
  "STATUS",
  "TIMES USED",
];

export const StudentTableHeader = [
  "STUDENT ID",
  "FULL NAME",
  "RANK POS",
  "AVG SCORE",
  "STREAK",
  "STATUS",
];

export const SubjectsList = [
  "Mathematics",
  "History",
  "Geography",
  "Combined Science",
];

//...................FUNCTIONS...................//

export function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-chart-1/10 text-chart-1 border-chart-1/20";
    case "archive":
      return "bg-chart-3/10 text-chart-3 border-chart-3/20";
    case "flagged":
      return "bg-chart-4/10 text-chart-4 border-chart-4/20";
    default:
      return "bg-gray-300/10 text-gray-300 border-gray-300/20";
  }
}

export function getStatusIcon(status: string): React.ComponentType {
  switch (status) {
    case "active":
      return Check;
    case "archive":
      return Archive;
    case "flagged":
      return X;
    default:
      return Pen;
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
