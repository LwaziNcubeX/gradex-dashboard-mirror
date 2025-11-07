export interface Question {
  _id: string;
  subject: string;
  topic: string;
  subtopics: string[];
  question_text: string;
  answers: string[];
  correct_answer: string;
  hint: string;
  level: "Form 1" | "Form 2" | "Form 3" | "Form 4";
  created_at: string;
}

export interface QuestionsTableProps {
  questions: Question[];
}
