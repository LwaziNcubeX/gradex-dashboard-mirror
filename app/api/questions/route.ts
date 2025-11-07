import { getCurrentUser } from "@/lib/auth";
import CONFIG from "@/lib/config";
import { Question } from "@/lib/interface";
import { serverApiClient } from "@/lib/server-api-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const questions = await getQuestions();
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(null, { status: 401 });
  }
}

async function getQuestions() {
  try {
    const response = await serverApiClient.get<{
      success: boolean;
      questions: Question[];
    }>(CONFIG.ENDPOINTS.QUESTIONS.LIST);
    return response.questions || [];
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return [];
  }
}
