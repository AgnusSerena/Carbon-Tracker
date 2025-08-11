"use client"

import { useState, useEffect, useCallback } from "react"
import type { CodeCarbonEmission, CodeCarbonProject } from "@/lib/codecarbon"

interface UseCodeCarbonOptions {
  projectId?: string
  refreshInterval?: number // in milliseconds
  autoRefresh?: boolean
}

interface EmissionsData {
  emissions: CodeCarbonEmission[]
  departmentData: Record<string, { emissions: number; energy: number; count: number }>
  trendData: Array<{ date: string; emissions: number; energy: number }>
  totalEmissions: number
  totalEnergy: number
  loading: boolean
  error: string | null
}

export function useCodeCarbon(options: UseCodeCarbonOptions = {}) {
  const { projectId, refreshInterval = 30000, autoRefresh = true } = options

  const [projects, setProjects] = useState<CodeCarbonProject[]>([])
  const [emissionsData, setEmissionsData] = useState<EmissionsData>({
    emissions: [],
    departmentData: {},
    trendData: [],
    totalEmissions: 0,
    totalEnergy: 0,
    loading: false,
    error: null,
  })

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/codecarbon/projects")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || "Failed to fetch projects")
      }
      const data = await response.json()
      setProjects(data.projects || data) // Handle both old and new format

      // Show info message if using mock data
      if (data.isMockData) {
        console.info("Code Carbon: Using demo data -", data.message)
      }
    } catch (error) {
      console.error("Error fetching projects:", error)
      setEmissionsData((prev) => ({
        ...prev,
        error: `Failed to fetch projects: ${error instanceof Error ? error.message : "Unknown error"}`,
      }))
    }
  }, [])

  const fetchEmissions = useCallback(
    async (projectId: string, startDate?: string, endDate?: string, limit?: number) => {
      setEmissionsData((prev) => ({ ...prev, loading: true, error: null }))

      try {
        const params = new URLSearchParams({ projectId })
        if (startDate) params.append("startDate", startDate)
        if (endDate) params.append("endDate", endDate)
        if (limit) params.append("limit", limit.toString())

        // Fetch raw emissions data
        const emissionsResponse = await fetch(`/api/codecarbon/emissions?${params.toString()}`)
        if (!emissionsResponse.ok) {
          const errorData = await emissionsResponse.json()
          throw new Error(errorData.details || "Failed to fetch emissions")
        }
        const emissionsResult = await emissionsResponse.json()
        const emissions = emissionsResult.data || emissionsResult

        // Fetch department aggregation
        const deptParams = new URLSearchParams({ projectId, aggregate: "department" })
        const deptResponse = await fetch(`/api/codecarbon/emissions?${deptParams.toString()}`)
        const deptResult = deptResponse.ok ? await deptResponse.json() : { data: {} }
        const departmentData = deptResult.data || {}

        // Fetch trend data
        const trendParams = new URLSearchParams({ projectId, aggregate: "trend", period: "day" })
        const trendResponse = await fetch(`/api/codecarbon/emissions?${trendParams.toString()}`)
        const trendResult = trendResponse.ok ? await trendResponse.json() : { data: [] }
        const trendData = trendResult.data || []

        // Calculate totals
        const totalEmissions = emissions.reduce((sum: number, e: any) => sum + (e.emissions || 0), 0)
        const totalEnergy = emissions.reduce((sum: number, e: any) => sum + (e.energy_consumed || 0), 0)

        setEmissionsData({
          emissions,
          departmentData,
          trendData,
          totalEmissions,
          totalEnergy,
          loading: false,
          error: null,
        })

        // Log if using mock data
        if (emissionsResult.isMockData) {
          console.info("Code Carbon: Using demo emissions data")
        }
      } catch (error) {
        console.error("Error fetching emissions:", error)
        setEmissionsData((prev) => ({
          ...prev,
          loading: false,
          error: `Failed to fetch emissions: ${error instanceof Error ? error.message : "Unknown error"}`,
        }))
      }
    },
    [],
  )

  const fetchSummary = useCallback(
    async (
      projectId: string,
      period: "hour" | "day" | "week" | "month" = "day",
      startDate?: string,
      endDate?: string,
    ) => {
      try {
        const params = new URLSearchParams({ projectId, period })
        if (startDate) params.append("startDate", startDate)
        if (endDate) params.append("endDate", endDate)

        const response = await fetch(`/api/codecarbon/summary?${params.toString()}`)
        if (!response.ok) throw new Error("Failed to fetch summary")
        return await response.json()
      } catch (error) {
        console.error("Error fetching summary:", error)
        throw error
      }
    },
    [],
  )

  // Auto-refresh emissions data
  useEffect(() => {
    if (!projectId || !autoRefresh) return

    const interval = setInterval(() => {
      fetchEmissions(projectId)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [projectId, autoRefresh, refreshInterval, fetchEmissions])

  // Initial data fetch
  useEffect(() => {
    fetchProjects()
    if (projectId) {
      fetchEmissions(projectId)
    }
  }, [projectId, fetchProjects, fetchEmissions])

  return {
    projects,
    emissionsData,
    fetchProjects,
    fetchEmissions,
    fetchSummary,
    refetch: () => projectId && fetchEmissions(projectId),
  }
}

// Hook for real-time emissions monitoring
export function useRealTimeEmissions(projectId?: string, interval = 10000) {
  const [latestEmission, setLatestEmission] = useState<CodeCarbonEmission | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!projectId) return

    const fetchLatest = async () => {
      try {
        const response = await fetch(`/api/codecarbon/emissions?projectId=${projectId}&limit=1`)
        if (response.ok) {
          const emissions = await response.json()
          if (emissions.length > 0) {
            setLatestEmission(emissions[0])
            setIsConnected(true)
          }
        }
      } catch (error) {
        console.error("Error fetching latest emission:", error)
        setIsConnected(false)
      }
    }

    // Initial fetch
    fetchLatest()

    // Set up polling
    const intervalId = setInterval(fetchLatest, interval)

    return () => clearInterval(intervalId)
  }, [projectId, interval])

  return { latestEmission, isConnected }
}
