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
  created_at?: string;
}

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  subject: string;
  level: string;
  questions: string[];
  created_at?: string;
  xp_reward?: number;
  difficulty_score?: number;
}

export interface Level {
  _id: string;
  name: string;
  description: string;
  quizzes: string[];
  created_at?: string;
}

export interface QuestionsTableProps {
  questions: Question[];
}

export interface QuizzesTableProps {
  quizzes: Quiz[];
}

export interface LevelsTableProps {
  levels: Level[];
}
