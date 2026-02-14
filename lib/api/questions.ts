import { API_URL, HEADERS } from "./common";

class QuestionService {
  public async fetchQuestions() {
    try {
      const response = await fetch(`${API_URL}/questions`, {
        method: "GET",
        headers: HEADERS,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  public async deleteQuestion(questionId: string) {
    try {
      const response = await fetch(`${API_URL}/questions/${questionId}`, {
        method: "DELETE",
        headers: HEADERS,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export const questionService = new QuestionService();
