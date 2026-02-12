import { accessToken, API_URL } from "./common";

class QuizService {
  public async fetchQuestions() {
    try {
      const response = await fetch(`${API_URL}/quizzes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export const quizService = new QuizService();
