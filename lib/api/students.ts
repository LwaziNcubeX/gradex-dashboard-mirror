import { API_URL, ApiError, getHeaders, handleApiResponse } from "./common";
import { ResponseType, QuestionType, StudentType } from "@/constants/types";

interface FetchStudentsResponse extends ResponseType {
  data: StudentType[];
}

class StudentService {
  public async getAllStudents() {
    try {
      const response = await fetch(`${API_URL}/students`, {
        method: "GET",
        headers: getHeaders(),
        cache: "no-store",
      });

      const data = await handleApiResponse<FetchStudentsResponse>(response);
      return data.data || [];
    } catch (error) {
      console.error("Failed to fetch all students:", error);
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error("Failed to fetch all students");
    }
  }
}

export const studentService = new StudentService();
