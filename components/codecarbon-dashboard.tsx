"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCodeCarbon, useRealTimeEmissions } from "@/hooks/use-codecarbon"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Activity, Zap, Monitor, Wifi, WifiOff, RefreshCw } from "lucide-react"

interface CodeCarbonDashboardProps {
  className?: string
}

export function CodeCarbonDashboard({ className }: CodeCarbonDashboardProps) {
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [isDemoMode, setIsDemoMode] = useState(false)
  const { projects, emissionsData, fetchEmissions, refetch } = useCodeCarbon({
    projectId: selectedProject,
    refreshInterval: 30000,
    autoRefresh: true,
  })
  const { latestEmission, isConnected } = useRealTimeEmissions(selectedProject, 10000)

  // Select first project by default
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id)
    }
  }, [projects, selectedProject])

  // Check if we're in demo mode
  useEffect(() => {
    const checkDemoMode = async () => {
      try {
        const response = await fetch("/api/codecarbon/projects")
        const data = await response.json()
        setIsDemoMode(data.isMockData || false)
      } catch (error) {
        console.error("Error checking demo mode:", error)
      }
    }
    checkDemoMode()
  }, [])

  const formatEmissions = (value: number) => {
    if (value < 0.001) return `${(value * 1000000).toFixed(2)} µg`
    if (value < 1) return `${(value * 1000).toFixed(2)} mg`
    return `${value.toFixed(3)} g`
  }

  const formatEnergy = (value: number) => {
    if (value < 0.001) return `${(value * 1000).toFixed(2)} mWh`
    if (value < 1) return `${value.toFixed(3)} Wh`
    return `${value.toFixed(2)} kWh`
  }

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Code Carbon Integration</h2>
          <p className="text-gray-600">Real-time emissions tracking from your development environment</p>
          {isDemoMode && (
            <div className="mt-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Demo Mode - Configure CODECARBON_API_KEY for live data
              </Badge>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-red-600" />}
            <span className="text-sm text-gray-600">
              {isDemoMode ? "Demo Data" : isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={refetch} disabled={emissionsData.loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${emissionsData.loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Project Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Selection</CardTitle>
          <CardDescription>Choose a Code Carbon project to monitor</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {emissionsData.error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{emissionsData.error}</p>
          </CardContent>
        </Card>
      )}

      {selectedProject && (
        <>
          {/* Real-time Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Emissions Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestEmission ? formatEmissions(latestEmission.emissions_rate) : "--"}
                </div>
                <p className="text-xs text-muted-foreground">CO2 per hour</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatEmissions(emissionsData.totalEmissions)}</div>
                <p className="text-xs text-muted-foreground">CO2 equivalent</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Energy Consumed</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatEnergy(emissionsData.totalEnergy)}</div>
                <p className="text-xs text-muted-foreground">Total energy</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{emissionsData.emissions.length}</div>
                <p className="text-xs text-muted-foreground">Tracking sessions</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Emissions Trend</CardTitle>
                <CardDescription>CO2 emissions over time</CardDescription>
              </CardHeader>
              <CardContent>
                {emissionsData.trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={emissionsData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [formatEmissions(value), "Emissions"]} />
                      <Line type="monotone" dataKey="emissions" stroke="#3B82F6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No trend data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Energy Consumption</CardTitle>
                <CardDescription>Energy usage breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                {emissionsData.trendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={emissionsData.trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: number) => [formatEnergy(value), "Energy"]} />
                      <Bar dataKey="energy" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    No energy data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Emissions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Emissions</CardTitle>
              <CardDescription>Latest tracking sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {emissionsData.emissions.length > 0 ? (
                <div className="space-y-4">
                  {emissionsData.emissions.slice(0, 5).map((emission, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{emission.os}</Badge>
                          <Badge variant="outline">{emission.cpu_model}</Badge>
                          {emission.gpu_model && <Badge variant="outline">{emission.gpu_model}</Badge>}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{new Date(emission.timestamp).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatEmissions(emission.emissions)}</div>
                        <div className="text-sm text-gray-600">{formatEnergy(emission.energy_consumed)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No emissions data available</div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
