// Code Carbon API integration utilities
export interface CodeCarbonEmission {
  timestamp: string
  duration: number
  emissions: number
  emissions_rate: number
  cpu_power: number
  gpu_power: number
  ram_power: number
  cpu_energy: number
  gpu_energy: number
  ram_energy: number
  energy_consumed: number
  country_name: string
  country_iso_code: string
  region: string
  cloud_provider?: string
  cloud_region?: string
  os: string
  python_version: string
  codecarbon_version: string
  cpu_count: number
  cpu_model: string
  gpu_count: number
  gpu_model?: string
  longitude?: number
  latitude?: number
  ram_total_size: number
  tracking_mode: string
  on_cloud: boolean
  pue: number
}

export interface CodeCarbonProject {
  id: string
  name: string
  description?: string
  team_id?: string
  created_at: string
  updated_at: string
}

export interface CodeCarbonRun {
  id: string
  timestamp: string
  project_id: string
  os: string
  python_version: string
  codecarbon_version: string
  cpu_count: number
  cpu_model: string
  gpu_count: number
  gpu_model?: string
  ram_total_size: number
  tracking_mode: string
}

export class CodeCarbonAPI {
  private baseUrl: string
  private apiKey: string

  constructor(apiKey: string, baseUrl = "https://api.codecarbon.io") {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Code Carbon API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async getProjects(): Promise<CodeCarbonProject[]> {
    return this.request<CodeCarbonProject[]>("/projects")
  }

  async getProject(projectId: string): Promise<CodeCarbonProject> {
    return this.request<CodeCarbonProject>(`/projects/${projectId}`)
  }

  async getProjectEmissions(
    projectId: string,
    startDate?: string,
    endDate?: string,
    limit?: number,
  ): Promise<CodeCarbonEmission[]> {
    const params = new URLSearchParams()
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)
    if (limit) params.append("limit", limit.toString())

    const query = params.toString() ? `?${params.toString()}` : ""
    return this.request<CodeCarbonEmission[]>(`/projects/${projectId}/emissions${query}`)
  }

  async getRuns(projectId: string): Promise<CodeCarbonRun[]> {
    return this.request<CodeCarbonRun[]>(`/projects/${projectId}/runs`)
  }

  async getLatestEmissions(projectId: string, limit = 100): Promise<CodeCarbonEmission[]> {
    return this.request<CodeCarbonEmission[]>(`/projects/${projectId}/emissions?limit=${limit}&order=desc`)
  }

  // Aggregate emissions by time period
  async getEmissionsSummary(
    projectId: string,
    period: "hour" | "day" | "week" | "month",
    startDate?: string,
    endDate?: string,
  ): Promise<
    {
      period: string
      total_emissions: number
      total_energy: number
      avg_emissions_rate: number
      count: number
    }[]
  > {
    const params = new URLSearchParams({ period })
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)

    return this.request(`/projects/${projectId}/emissions/summary?${params.toString()}`)
  }
}

// Utility functions for data processing
export function aggregateEmissionsByDepartment(
  emissions: CodeCarbonEmission[],
  departmentMapping: Record<string, string>,
): Record<string, { emissions: number; energy: number; count: number }> {
  const result: Record<string, { emissions: number; energy: number; count: number }> = {}

  emissions.forEach((emission) => {
    // In a real implementation, you'd map emissions to departments based on user/machine info
    // For now, we'll use a simple mapping or default to 'Unknown'
    const department = departmentMapping[emission.cpu_model] || "Engineering" // Default mapping

    if (!result[department]) {
      result[department] = { emissions: 0, energy: 0, count: 0 }
    }

    result[department].emissions += emission.emissions
    result[department].energy += emission.energy_consumed
    result[department].count += 1
  })

  return result
}

export function calculateEmissionsTrend(
  emissions: CodeCarbonEmission[],
  period: "day" | "week" | "month" = "day",
): Array<{ date: string; emissions: number; energy: number }> {
  const grouped: Record<string, { emissions: number; energy: number }> = {}

  emissions.forEach((emission) => {
    const date = new Date(emission.timestamp)
    let key: string

    switch (period) {
      case "day":
        key = date.toISOString().split("T")[0]
        break
      case "week":
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        key = weekStart.toISOString().split("T")[0]
        break
      case "month":
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
        break
      default:
        key = date.toISOString().split("T")[0]
    }

    if (!grouped[key]) {
      grouped[key] = { emissions: 0, energy: 0 }
    }

    grouped[key].emissions += emission.emissions
    grouped[key].energy += emission.energy_consumed
  })

  return Object.entries(grouped)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Mock data generators for development/demo purposes
export function generateMockEmissions(count = 10): CodeCarbonEmission[] {
  const mockEmissions: CodeCarbonEmission[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - i * 3600000) // Each hour back
    mockEmissions.push({
      timestamp: timestamp.toISOString(),
      duration: Math.random() * 3600 + 1800, // 30min to 90min
      emissions: Math.random() * 0.1 + 0.01, // 0.01 to 0.11 kg
      emissions_rate: Math.random() * 0.05 + 0.005, // kg/hour
      cpu_power: Math.random() * 100 + 50, // 50-150W
      gpu_power: Math.random() * 200 + 100, // 100-300W
      ram_power: Math.random() * 20 + 10, // 10-30W
      cpu_energy: Math.random() * 0.2 + 0.1, // kWh
      gpu_energy: Math.random() * 0.4 + 0.2, // kWh
      ram_energy: Math.random() * 0.05 + 0.02, // kWh
      energy_consumed: Math.random() * 0.8 + 0.4, // kWh
      country_name: "United States",
      country_iso_code: "USA",
      region: "us-east-1",
      cloud_provider: Math.random() > 0.5 ? "aws" : undefined,
      cloud_region: Math.random() > 0.5 ? "us-east-1" : undefined,
      os: ["Windows", "macOS", "Linux"][Math.floor(Math.random() * 3)],
      python_version: "3.9.0",
      codecarbon_version: "2.3.0",
      cpu_count: Math.floor(Math.random() * 8) + 4, // 4-12 cores
      cpu_model: ["Intel i7-10700K", "AMD Ryzen 7 3700X", "Apple M1", "Intel i5-11400"][Math.floor(Math.random() * 4)],
      gpu_count: Math.random() > 0.7 ? 1 : 0,
      gpu_model: Math.random() > 0.7 ? ["NVIDIA RTX 3080", "AMD RX 6800 XT"][Math.floor(Math.random() * 2)] : undefined,
      longitude: -74.006,
      latitude: 40.7128,
      ram_total_size: Math.floor(Math.random() * 32) + 16, // 16-48 GB
      tracking_mode: "machine",
      on_cloud: Math.random() > 0.6,
      pue: 1.2 + Math.random() * 0.3, // 1.2-1.5
    })
  }

  return mockEmissions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function generateMockProjects(): CodeCarbonProject[] {
  return [
    {
      id: "demo-project-1",
      name: "Web Application Development",
      description: "Main web application development project",
      team_id: "team-1",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-15T12:00:00Z",
    },
    {
      id: "demo-project-2",
      name: "Machine Learning Pipeline",
      description: "ML model training and inference",
      team_id: "team-2",
      created_at: "2024-01-05T00:00:00Z",
      updated_at: "2024-01-14T15:30:00Z",
    },
    {
      id: "demo-project-3",
      name: "Data Processing Jobs",
      description: "Batch data processing and ETL",
      team_id: "team-1",
      created_at: "2024-01-10T00:00:00Z",
      updated_at: "2024-01-16T09:15:00Z",
    },
  ]
}

// Enhanced API class with fallback
export class CodeCarbonAPIWithFallback extends CodeCarbonAPI {
  private useMockData = false

  constructor(apiKey: string, baseUrl = "https://api.codecarbon.io", enableMockFallback = true) {
    super(apiKey, baseUrl)
    this.useMockData = !apiKey || apiKey === "demo" || enableMockFallback
  }

  async getProjects(): Promise<CodeCarbonProject[]> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      return generateMockProjects()
    }

    try {
      return await super.getProjects()
    } catch (error) {
      console.warn("Code Carbon API unavailable, using mock data:", error)
      this.useMockData = true
      return generateMockProjects()
    }
  }

  async getProjectEmissions(
    projectId: string,
    startDate?: string,
    endDate?: string,
    limit?: number,
  ): Promise<CodeCarbonEmission[]> {
    if (this.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return generateMockEmissions(limit || 50)
    }

    try {
      return await super.getProjectEmissions(projectId, startDate, endDate, limit)
    } catch (error) {
      console.warn("Code Carbon API unavailable, using mock data:", error)
      this.useMockData = true
      return generateMockEmissions(limit || 50)
    }
  }

  async getEmissionsSummary(
    projectId: string,
    period: "hour" | "day" | "week" | "month",
    startDate?: string,
    endDate?: string,
  ): Promise<any[]> {
    if (this.useMockData) {
      await new Promise((resolve) => setTimeout(resolve, 400))
      // Generate mock summary data
      const mockSummary = []
      const now = new Date()
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        mockSummary.push({
          period: date.toISOString().split("T")[0],
          total_emissions: Math.random() * 0.5 + 0.1,
          total_energy: Math.random() * 2 + 0.5,
          avg_emissions_rate: Math.random() * 0.1 + 0.01,
          count: Math.floor(Math.random() * 10) + 5,
        })
      }
      return mockSummary
    }

    try {
      return await super.getEmissionsSummary(projectId, period, startDate, endDate)
    } catch (error) {
      console.warn("Code Carbon API unavailable, using mock data:", error)
      this.useMockData = true
      return []
    }
  }

  isMockMode(): boolean {
    return this.useMockData
  }
}
