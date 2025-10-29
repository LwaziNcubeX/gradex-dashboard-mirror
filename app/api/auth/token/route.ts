import { type NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      token,
      success: true,
    });
  } catch (error) {
    console.error("[Auth Token API] Error:", error);
    return NextResponse.json(
      { error: "Failed to get authentication token" },
      { status: 500 }
    );
  }
}
