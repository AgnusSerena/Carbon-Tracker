"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  LineChart, // Declared LineChart here
} from "recharts"
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import {
  Leaf,
  TrendingDown,
  TrendingUp,
  Zap,
  Monitor,
  Target,
  Bell,
  Settings,
  LogOut,
  User,
  Calendar,
  Building2,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { CodeCarbonDashboard } from "@/components/codecarbon-dashboard"
import { ChartLoading, MetricCardLoading, PieChartLoading } from "@/components/chart-loading"

// Enhanced demo data with more realistic values
const monthlyData = [
  { month: "Jan", emissions: 2.4, target: 2.0, energy: 12.5, cost: 1250 },
  { month: "Feb", emissions: 2.1, target: 2.0, energy: 11.2, cost: 1120 },
  { month: "Mar", emissions: 1.9, target: 2.0, energy: 10.8, cost: 1080 },
  { month: "Apr", emissions: 1.8, target: 2.0, energy: 10.1, cost: 1010 },
  { month: "May", emissions: 1.6, target: 2.0, energy: 9.5, cost: 950 },
  { month: "Jun", emissions: 1.5, target: 2.0, energy: 9.2, cost: 920 },
]

const weeklyData = [
  { week: "Week 1", emissions: 0.35, energy: 2.1, sessions: 45 },
  { week: "Week 2", emissions: 0.42, energy: 2.5, sessions: 52 },
  { week: "Week 3", emissions: 0.38, energy: 2.3, sessions: 48 },
  { week: "Week 4", emissions: 0.35, energy: 2.1, sessions: 44 },
]

const dailyData = [
  { day: "Mon", emissions: 0.08, energy: 0.45, hours: 8.5 },
  { day: "Tue", emissions: 0.12, energy: 0.62, hours: 9.2 },
  { day: "Wed", emissions: 0.09, energy: 0.51, hours: 8.8 },
  { day: "Thu", emissions: 0.11, energy: 0.58, hours: 9.0 },
  { day: "Fri", emissions: 0.07, energy: 0.41, hours: 7.5 },
  { day: "Sat", emissions: 0.03, energy: 0.18, hours: 3.2 },
  { day: "Sun", emissions: 0.02, energy: 0.12, hours: 2.1 },
]

const departmentData = [
  { name: "Engineering", value: 45, emissions: 0.68, color: "#3B82F6" },
  { name: "Marketing", value: 20, emissions: 0.3, color: "#10B981" },
  { name: "Sales", value: 15, emissions: 0.23, color: "#F59E0B" },
  { name: "Operations", value: 12, emissions: 0.18, color: "#EF4444" },
  { name: "HR", value: 8, emissions: 0.12, color: "#8B5CF6" },
]

const deviceTypeData = [
  { name: "Laptops", value: 65, emissions: 0.98, color: "#3B82F6" },
  { name: "Desktops", value: 25, emissions: 0.38, color: "#10B981" },
  { name: "Servers", value: 10, emissions: 0.15, color: "#F59E0B" },
]

const hourlyUsageData = [
  { hour: "00", usage: 5, emissions: 0.008 },
  { hour: "01", usage: 3, emissions: 0.005 },
  { hour: "02", usage: 2, emissions: 0.003 },
  { hour: "03", usage: 1, emissions: 0.002 },
  { hour: "04", usage: 1, emissions: 0.002 },
  { hour: "05", usage: 2, emissions: 0.003 },
  { hour: "06", usage: 8, emissions: 0.012 },
  { hour: "07", usage: 15, emissions: 0.023 },
  { hour: "08", usage: 35, emissions: 0.053 },
  { hour: "09", usage: 55, emissions: 0.083 },
  { hour: "10", usage: 68, emissions: 0.102 },
  { hour: "11", usage: 72, emissions: 0.108 },
  { hour: "12", usage: 65, emissions: 0.098 },
  { hour: "13", usage: 70, emissions: 0.105 },
  { hour: "14", usage: 75, emissions: 0.113 },
  { hour: "15", usage: 78, emissions: 0.117 },
  { hour: "16", usage: 80, emissions: 0.12 },
  { hour: "17", usage: 75, emissions: 0.113 },
  { hour: "18", usage: 45, emissions: 0.068 },
  { hour: "19", usage: 25, emissions: 0.038 },
  { hour: "20", usage: 15, emissions: 0.023 },
  { hour: "21", usage: 12, emissions: 0.018 },
  { hour: "22", usage: 8, emissions: 0.012 },
  { hour: "23", usage: 6, emissions: 0.009 },
]

const recommendations = [
  {
    title: "Optimize Computer Sleep Settings",
    impact: "High",
    savings: "0.3 tons CO2/year",
    description: "Configure computers to sleep after 15 minutes of inactivity",
  },
  {
    title: "Switch to Renewable Energy",
    impact: "Very High",
    savings: "2.1 tons CO2/year",
    description: "Partner with green energy providers for office electricity",
  },
  {
    title: "Implement Remote Work Policy",
    impact: "Medium",
    savings: "0.8 tons CO2/year",
    description: "Allow 2 days remote work per week to reduce commuting",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [chartsLoading, setChartsLoading] = useState(true)
  const [dataRefreshing, setDataRefreshing] = useState(false)

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Simulate data refresh
  const handleRefreshData = () => {
    setDataRefreshing(true)
    setTimeout(() => {
      setDataRefreshing(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">CarbonTrack</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleRefreshData} disabled={dataRefreshing}>
                <RefreshCw className={`h-4 w-4 ${dataRefreshing ? "animate-spin" : ""}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carbon Emissions Dashboard</h1>
          <p className="text-gray-600 mt-2">Track and reduce your environmental impact</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {chartsLoading ? (
            <>
              <MetricCardLoading />
              <MetricCardLoading />
              <MetricCardLoading />
              <MetricCardLoading />
            </>
          ) : (
            <>
              <Card className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Emissions</CardTitle>
                  <Leaf className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-count-up">1.5 tons</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center animate-slide-in-left [animation-delay:0.5s]">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -12% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-count-up">9.2 kWh</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center animate-slide-in-left [animation-delay:0.6s]">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -8% from last month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
                  <Monitor className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-count-up">66</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-blue-600 flex items-center animate-slide-in-left [animation-delay:0.7s]">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3 new this month
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold animate-count-up">75%</div>
                  <Progress value={75} className="mt-2 animate-progress-fill [animation-delay:0.8s]" />
                  <p className="text-xs text-muted-foreground mt-2 animate-fade-in [animation-delay:1s]">
                    Target: 2.0 tons by Dec 2024
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="codecarbon">Code Carbon</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Primary Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6">
              {chartsLoading ? (
                <>
                  <ChartLoading
                    title="Monthly Emissions Trend"
                    description="CO2 emissions vs targets over the past 6 months"
                  />
                  <PieChartLoading
                    title="Emissions by Department"
                    description="Current month breakdown with emission values"
                  />
                </>
              ) : (
                <>
                  <Card className="animate-slide-in-up [animation-delay:0.5s] opacity-0 [animation-fill-mode:forwards]">
                    <CardHeader>
                      <CardTitle>Monthly Emissions Trend</CardTitle>
                      <CardDescription>CO2 emissions vs targets over the past 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip
                            formatter={(value, name) => [
                              name === "emissions" || name === "target"
                                ? `${value} tons`
                                : name === "energy"
                                  ? `${value} kWh`
                                  : `$${value}`,
                              name === "emissions"
                                ? "Actual Emissions"
                                : name === "target"
                                  ? "Target"
                                  : name === "energy"
                                    ? "Energy Usage"
                                    : "Cost",
                            ]}
                          />
                          <Area
                            yAxisId="right"
                            dataKey="energy"
                            fill="#E0F2FE"
                            stroke="#0EA5E9"
                            strokeWidth={1}
                            fillOpacity={0.3}
                            animationDuration={1000}
                            animationBegin={400}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="emissions"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            animationDuration={1200}
                            animationBegin={300}
                            dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                          />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="target"
                            stroke="#10B981"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            animationDuration={1200}
                            animationBegin={500}
                            dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="animate-slide-in-up [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
                    <CardHeader>
                      <CardTitle>Emissions by Department</CardTitle>
                      <CardDescription>Current month breakdown with emission values</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={departmentData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={40}
                            fill="#8884d8"
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={1000}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {departmentData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name, props) => [`${value}%`, `${props.payload.emissions} tons CO2`]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Secondary Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance</CardTitle>
                  <CardDescription>Last 4 weeks emissions and energy</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "emissions"
                            ? `${value} tons`
                            : name === "energy"
                              ? `${value} kWh`
                              : `${value} sessions`,
                          name === "emissions" ? "Emissions" : name === "energy" ? "Energy" : "Sessions",
                        ]}
                      />
                      <Bar dataKey="emissions" fill="#3B82F6" name="Emissions" />
                      <Bar dataKey="energy" fill="#10B981" name="Energy" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Usage Pattern</CardTitle>
                  <CardDescription>This week's daily emissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "emissions"
                            ? `${value} tons`
                            : name === "energy"
                              ? `${value} kWh`
                              : `${value} hours`,
                          name === "emissions" ? "Emissions" : name === "energy" ? "Energy" : "Work Hours",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="emissions"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Device Types</CardTitle>
                  <CardDescription>Emissions by device category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={deviceTypeData}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [`${value}%`, `${props.payload.emissions} tons CO2`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Hourly Usage Chart */}
            <Card>
              <CardHeader>
                <CardTitle>24-Hour Usage Pattern</CardTitle>
                <CardDescription>Hourly computer usage and emissions throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={hourlyUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      formatter={(value, name) => [
                        name === "usage" ? `${value}%` : `${value} tons`,
                        name === "usage" ? "Usage" : "Emissions",
                      ]}
                    />
                    <Bar yAxisId="left" dataKey="usage" fill="#E0F2FE" name="Usage %" />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="emissions"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ fill: "#EF4444", strokeWidth: 2, r: 3 }}
                      name="Emissions"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Statistical Insights Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emission Intensity Analysis</CardTitle>
                  <CardDescription>CO2 emissions per unit of energy consumed</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart
                      data={monthlyData.map((item) => ({
                        ...item,
                        intensity: ((item.emissions / item.energy) * 1000).toFixed(1),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "intensity" ? `${value} g CO2/kWh` : `${value} kWh`,
                          name === "intensity" ? "Carbon Intensity" : "Energy Usage",
                        ]}
                      />
                      <Bar yAxisId="right" dataKey="energy" fill="#E0F2FE" name="Energy Usage" />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="intensity"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                        name="Carbon Intensity"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Benchmarking</CardTitle>
                  <CardDescription>Compare against industry standards and targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { metric: "Current", value: 1.5, benchmark: 2.2, target: 1.2 },
                        { metric: "Q1 Avg", value: 2.1, benchmark: 2.2, target: 1.8 },
                        { metric: "Industry", value: 2.2, benchmark: 2.2, target: 2.0 },
                        { metric: "Best Practice", value: 1.0, benchmark: 2.2, target: 1.0 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} tons CO2`, "Emissions"]} />
                      <Bar dataKey="value" fill="#3B82F6" name="Actual" />
                      <Bar dataKey="benchmark" fill="#94A3B8" name="Industry Avg" />
                      <Bar dataKey="target" fill="#10B981" name="Target" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Carbon Efficiency</CardTitle>
                  <div className="text-2xl">📊</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">163 g/kWh</div>
                  <Progress value={75} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">25% better than industry avg</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reduction Rate</CardTitle>
                  <div className="text-2xl">📉</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-15%</div>
                  <Progress value={60} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">Monthly improvement rate</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Variability Index</CardTitle>
                  <div className="text-2xl">📈</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.18</div>
                  <Progress value={82} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">Low variability (good)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
                  <div className="text-2xl">🎯</div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94%</div>
                  <Progress value={94} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-2">Prediction confidence</p>
                </CardContent>
              </Card>
            </div>

            {/* Correlation Matrix */}
            <Card>
              <CardHeader>
                <CardTitle>Correlation Analysis</CardTitle>
                <CardDescription>Relationships between different emission factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2 text-sm">
                  <div className="font-semibold"></div>
                  <div className="font-semibold text-center">Emissions</div>
                  <div className="font-semibold text-center">Energy</div>
                  <div className="font-semibold text-center">Devices</div>
                  <div className="font-semibold text-center">Hours</div>

                  <div className="font-semibold">Emissions</div>
                  <div className="text-center bg-red-100 rounded p-1">1.00</div>
                  <div className="text-center bg-red-50 rounded p-1">0.94</div>
                  <div className="text-center bg-yellow-50 rounded p-1">0.67</div>
                  <div className="text-center bg-green-50 rounded p-1">0.45</div>

                  <div className="font-semibold">Energy</div>
                  <div className="text-center bg-red-50 rounded p-1">0.94</div>
                  <div className="text-center bg-red-100 rounded p-1">1.00</div>
                  <div className="text-center bg-yellow-50 rounded p-1">0.72</div>
                  <div className="text-center bg-green-50 rounded p-1">0.58</div>

                  <div className="font-semibold">Devices</div>
                  <div className="text-center bg-yellow-50 rounded p-1">0.67</div>
                  <div className="text-center bg-yellow-50 rounded p-1">0.72</div>
                  <div className="text-center bg-red-100 rounded p-1">1.00</div>
                  <div className="text-center bg-yellow-50 rounded p-1">0.83</div>

                  <div className="font-semibold">Hours</div>
                  <div className="text-center bg-green-50 rounded p-1">0.45</div>
                  <div className="text-center bg-green-50 rounded p-1">0.58</div>
                  <div className="text-center bg-yellow-50 rounded p-1">0.83</div>
                  <div className="text-center bg-red-100 rounded p-1">1.00</div>
                </div>
                <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-100 rounded"></div>
                    <span>Strong (0.8+)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-50 rounded"></div>
                    <span>Moderate (0.5-0.8)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-50 rounded"></div>
                    <span>Weak (0.0-0.5)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Peak Usage Time</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4:00 PM</div>
                  <p className="text-xs text-muted-foreground">80% of devices active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Most Efficient Day</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Friday</div>
                  <p className="text-xs text-muted-foreground">0.07 tons CO2 average</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Department</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Engineering</div>
                  <p className="text-xs text-muted-foreground">0.68 tons CO2 this month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Header with Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="animate-fade-in [animation-delay:0.1s] opacity-0 [animation-fill-mode:forwards]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Daily Emissions</CardTitle>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.05 tons</div>
                  <p className="text-xs text-muted-foreground">Per day this month</p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in [animation-delay:0.2s] opacity-0 [animation-fill-mode:forwards]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Peak Hour</CardTitle>
                  <Monitor className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4 PM</div>
                  <p className="text-xs text-muted-foreground">Highest usage time</p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in [animation-delay:0.3s] opacity-0 [animation-fill-mode:forwards]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                  <Target className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8.2/10</div>
                  <p className="text-xs text-muted-foreground">Carbon efficiency rating</p>
                </CardContent>
              </Card>

              <Card className="animate-fade-in [animation-delay:0.4s] opacity-0 [animation-fill-mode:forwards]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Projected Savings</CardTitle>
                  <Leaf className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.3 tons</div>
                  <p className="text-xs text-muted-foreground">Annual reduction potential</p>
                </CardContent>
              </Card>
            </div>

            {/* Comprehensive Analytics Charts */}
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Emissions Correlation Analysis */}
              <Card className="animate-slide-in-up [animation-delay:0.5s] opacity-0 [animation-fill-mode:forwards]">
                <CardHeader>
                  <CardTitle>Emissions vs Energy Correlation</CardTitle>
                  <CardDescription>Relationship between energy consumption and CO2 emissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "emissions" ? `${value} tons CO2` : `${value} kWh`,
                          name === "emissions" ? "Emissions" : "Energy Usage",
                        ]}
                      />
                      <Bar yAxisId="right" dataKey="energy" fill="#E0F2FE" name="Energy (kWh)" />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="emissions"
                        stroke="#EF4444"
                        strokeWidth={3}
                        dot={{ fill: "#EF4444", strokeWidth: 2, r: 5 }}
                        name="Emissions (tons)"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Statistical Distribution */}
              <Card className="animate-slide-in-up [animation-delay:0.6s] opacity-0 [animation-fill-mode:forwards]">
                <CardHeader>
                  <CardTitle>Daily Emissions Distribution</CardTitle>
                  <CardDescription>Statistical analysis of daily emission patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={[
                        { range: "0-0.02", frequency: 15, cumulative: 15 },
                        { range: "0.02-0.04", frequency: 25, cumulative: 40 },
                        { range: "0.04-0.06", frequency: 35, cumulative: 75 },
                        { range: "0.06-0.08", frequency: 20, cumulative: 95 },
                        { range: "0.08-0.10", frequency: 15, cumulative: 110 },
                        { range: "0.10+", frequency: 10, cumulative: 120 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          `${value} days`,
                          name === "frequency" ? "Frequency" : "Cumulative",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="frequency"
                        stackId="1"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.6}
                        name="Frequency"
                      />
                      <Line
                        type="monotone"
                        dataKey="cumulative"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 3 }}
                        name="Cumulative"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Analytics Row */}
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              {/* Efficiency Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Efficiency Trends</CardTitle>
                  <CardDescription>CO2 per kWh over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={monthlyData.map((item) => ({
                        ...item,
                        efficiency: ((item.emissions / item.energy) * 1000).toFixed(2),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} g/kWh`, "Efficiency"]} />
                      <Line
                        type="monotone"
                        dataKey="efficiency"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Department Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Efficiency</CardTitle>
                  <CardDescription>Emissions per employee by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart
                      data={[
                        { dept: "Eng", perEmployee: 0.027, target: 0.025 },
                        { dept: "Mkt", perEmployee: 0.025, target: 0.025 },
                        { dept: "Sales", perEmployee: 0.015, target: 0.025 },
                        { dept: "Ops", perEmployee: 0.023, target: 0.025 },
                        { dept: "HR", perEmployee: 0.02, target: 0.025 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dept" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          `${value} tons`,
                          name === "perEmployee" ? "Per Employee" : "Target",
                        ]}
                      />
                      <Bar dataKey="perEmployee" fill="#3B82F6" name="Actual" />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#10B981"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        name="Target"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Seasonal Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Seasonal Patterns</CardTitle>
                  <CardDescription>Monthly variation analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <RadarChart
                      data={[
                        { month: "Jan", emissions: 2.4, average: 2.0 },
                        { month: "Feb", emissions: 2.1, average: 2.0 },
                        { month: "Mar", emissions: 1.9, average: 2.0 },
                        { month: "Apr", emissions: 1.8, average: 2.0 },
                        { month: "May", emissions: 1.6, average: 2.0 },
                        { month: "Jun", emissions: 1.5, average: 2.0 },
                      ]}
                    >
                      <PolarGrid />
                      <PolarAngleAxis dataKey="month" />
                      <PolarRadiusAxis angle={90} domain={[0, 3]} />
                      <Radar name="Actual" dataKey="emissions" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      <Radar name="Average" dataKey="average" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Statistical Summary Table */}
            <Card>
              <CardHeader>
                <CardTitle>Statistical Summary</CardTitle>
                <CardDescription>Key statistical metrics for emissions data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Descriptive Statistics</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>Mean:</span>
                        <span className="font-mono">1.88 tons</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Median:</span>
                        <span className="font-mono">1.85 tons</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Std Dev:</span>
                        <span className="font-mono">0.34 tons</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Variance:</span>
                        <span className="font-mono">0.12</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Min:</span>
                        <span className="font-mono">1.50 tons</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max:</span>
                        <span className="font-mono">2.40 tons</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Trend Analysis</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span>Trend:</span>
                        <span className="font-mono text-green-600">↓ Decreasing</span>
                      </div>
                      <div className="flex justify-between">
                        <span>R²:</span>
                        <span className="font-mono">0.94</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Slope:</span>
                        <span className="font-mono">-0.18</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Correlation:</span>
                        <span className="font-mono">-0.97</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Forecast:</span>
                        <span className="font-mono">1.32 tons</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="font-mono">95%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>Forecasted emissions based on current trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart
                    data={[
                      ...monthlyData,
                      { month: "Jul", emissions: 1.4, target: 2.0, forecast: 1.4, confidence: [1.2, 1.6] },
                      { month: "Aug", emissions: null, target: 2.0, forecast: 1.3, confidence: [1.0, 1.6] },
                      { month: "Sep", emissions: null, target: 2.0, forecast: 1.2, confidence: [0.9, 1.5] },
                      { month: "Oct", emissions: null, target: 2.0, forecast: 1.1, confidence: [0.8, 1.4] },
                      { month: "Nov", emissions: null, target: 2.0, forecast: 1.0, confidence: [0.7, 1.3] },
                      { month: "Dec", emissions: null, target: 2.0, forecast: 0.9, confidence: [0.6, 1.2] },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        value ? `${value} tons` : "No data",
                        name === "emissions" ? "Actual" : name === "forecast" ? "Forecast" : "Target",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="forecast"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.2}
                      strokeDasharray="5 5"
                      name="Forecast"
                    />
                    <Line
                      type="monotone"
                      dataKey="emissions"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: "#3B82F6", strokeWidth: 2, r: 5 }}
                      name="Actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#10B981"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      name="Target"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="codecarbon" className="space-y-6">
            <CodeCarbonDashboard />
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid gap-6">
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                      <Badge
                        variant={
                          rec.impact === "Very High" ? "destructive" : rec.impact === "High" ? "default" : "secondary"
                        }
                      >
                        {rec.impact} Impact
                      </Badge>
                    </div>
                    <CardDescription>{rec.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Potential savings: <span className="font-semibold text-green-600">{rec.savings}</span>
                      </div>
                      <Button size="sm">Implement</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Goals</CardTitle>
                <CardDescription>Track your progress towards carbon neutrality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">2024 Reduction Target</span>
                    <span className="text-sm text-gray-600">75% Complete</span>
                  </div>
                  <Progress value={75} className="mb-2" />
                  <p className="text-xs text-gray-600">Reduce emissions by 25% compared to 2023</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Energy Efficiency</span>
                    <span className="text-sm text-gray-600">60% Complete</span>
                  </div>
                  <Progress value={60} className="mb-2" />
                  <p className="text-xs text-gray-600">Implement energy-saving measures across all departments</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Renewable Energy</span>
                    <span className="text-sm text-gray-600">30% Complete</span>
                  </div>
                  <Progress value={30} className="mb-2" />
                  <p className="text-xs text-gray-600">Transition to 100% renewable energy sources</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
