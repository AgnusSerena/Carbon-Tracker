import { type NextRequest, NextResponse } from "next/server"
import { CodeCarbonAPIWithFallback } from "@/lib/codecarbon"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const period = searchParams.get("period") as "hour" | "day" | "week" | "month"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const apiKey = process.env.CODECARBON_API_KEY || "demo"
    const api = new CodeCarbonAPIWithFallback(apiKey, "https://api.codecarbon.io", true)

    const summary = await api.getEmissionsSummary(
      projectId,
      period || "day",
      startDate || undefined,
      endDate || undefined,
    )

    return NextResponse.json({
      data: summary,
      isMockData: api.isMockMode(),
      message: api.isMockMode() ? "Demo summary data" : "Live summary from Code Carbon",
    })
  } catch (error) {
    console.error("Error fetching Code Carbon summary:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch emissions summary",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
