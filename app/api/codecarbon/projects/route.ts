import { type NextRequest, NextResponse } from "next/server"
import { CodeCarbonAPIWithFallback } from "@/lib/codecarbon"

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.CODECARBON_API_KEY || "demo"

    // Always enable mock fallback for demo purposes
    const api = new CodeCarbonAPIWithFallback(apiKey, "https://api.codecarbon.io", true)
    const projects = await api.getProjects()

    return NextResponse.json({
      projects,
      isMockData: api.isMockMode(),
      message: api.isMockMode()
        ? "Using demo data - configure CODECARBON_API_KEY for real data"
        : "Live data from Code Carbon API",
    })
  } catch (error) {
    console.error("Error in projects API route:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch projects",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
