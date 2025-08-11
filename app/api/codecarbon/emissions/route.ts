import { type NextRequest, NextResponse } from "next/server"
import { CodeCarbonAPIWithFallback, aggregateEmissionsByDepartment, calculateEmissionsTrend } from "@/lib/codecarbon"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")
    const limit = searchParams.get("limit")
    const aggregate = searchParams.get("aggregate") // 'department' | 'trend'
    const period = searchParams.get("period") as "day" | "week" | "month"

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const apiKey = process.env.CODECARBON_API_KEY || "demo"
    const api = new CodeCarbonAPIWithFallback(apiKey, "https://api.codecarbon.io", true)

    const emissions = await api.getProjectEmissions(
      projectId,
      startDate || undefined,
      endDate || undefined,
      limit ? Number.parseInt(limit) : undefined,
    )

    // Handle aggregation requests
    if (aggregate === "department") {
      // Enhanced department mapping with mock data
      const departmentMapping: Record<string, string> = {
        "Intel i7-10700K": "Engineering",
        "AMD Ryzen 7 3700X": "Engineering",
        "Apple M1": "Design",
        "Intel i5-11400": "Marketing",
        // Add more mappings as needed
      }

      const departmentData = aggregateEmissionsByDepartment(emissions, departmentMapping)
      return NextResponse.json({
        data: departmentData,
        isMockData: api.isMockMode(),
      })
    }

    if (aggregate === "trend") {
      const trendData = calculateEmissionsTrend(emissions, period || "day")
      return NextResponse.json({
        data: trendData,
        isMockData: api.isMockMode(),
      })
    }

    return NextResponse.json({
      data: emissions,
      isMockData: api.isMockMode(),
      message: api.isMockMode() ? "Demo data - configure CODECARBON_API_KEY for real tracking" : "Live emissions data",
    })
  } catch (error) {
    console.error("Error fetching Code Carbon emissions:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch emissions data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
