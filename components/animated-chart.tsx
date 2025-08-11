"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts"

interface AnimatedChartProps {
  data: any[]
  type: "bar" | "line" | "pie" | "area" | "composed"
  height?: number
  children?: React.ReactNode
  isLoading?: boolean
  refreshing?: boolean
}

export function AnimatedChart({
  data,
  type,
  height = 300,
  children,
  isLoading = false,
  refreshing = false,
}: AnimatedChartProps) {
  const [animatedData, setAnimatedData] = useState<any[]>([])
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (isLoading || refreshing) {
      setAnimatedData([])
      setIsAnimating(true)
      return
    }

    // Animate data entry
    const animateData = () => {
      setAnimatedData([])

      data.forEach((item, index) => {
        setTimeout(() => {
          setAnimatedData((prev) => [...prev, item])
          if (index === data.length - 1) {
            setTimeout(() => setIsAnimating(false), 300)
          }
        }, index * 100)
      })
    }

    const timer = setTimeout(animateData, 200)
    return () => clearTimeout(timer)
  }, [data, isLoading, refreshing])

  const chartProps = {
    data: animatedData,
    margin: { top: 5, right: 30, left: 20, bottom: 5 },
  }

  const containerClass = `transition-all duration-500 ${
    isAnimating ? "opacity-70 scale-95" : "opacity-100 scale-100"
  } ${refreshing ? "animate-pulse" : ""}`

  return (
    <div className={containerClass}>
      <ResponsiveContainer width="100%" height={height}>
        {type === "bar" && <BarChart {...chartProps}>{children}</BarChart>}
        {type === "line" && <LineChart {...chartProps}>{children}</LineChart>}
        {type === "area" && <AreaChart {...chartProps}>{children}</AreaChart>}
        {type === "composed" && <ComposedChart {...chartProps}>{children}</ComposedChart>}
        {type === "pie" && (
          <PieChart>
            <Pie
              data={animatedData}
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
              {children}
            </Pie>
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

// Custom animated components for specific chart elements
export function AnimatedBar({ dataKey, fill, name, ...props }: any) {
  return <Bar dataKey={dataKey} fill={fill} name={name} animationDuration={800} animationBegin={200} {...props} />
}

export function AnimatedLine({ dataKey, stroke, strokeWidth = 2, ...props }: any) {
  return (
    <Line
      type="monotone"
      dataKey={dataKey}
      stroke={stroke}
      strokeWidth={strokeWidth}
      animationDuration={1200}
      animationBegin={300}
      dot={{
        fill: stroke,
        strokeWidth: 2,
        r: 4,
        animationDuration: 600,
      }}
      {...props}
    />
  )
}

export function AnimatedArea({ dataKey, stroke, fill, fillOpacity = 0.6, ...props }: any) {
  return (
    <Area
      type="monotone"
      dataKey={dataKey}
      stroke={stroke}
      fill={fill}
      fillOpacity={fillOpacity}
      animationDuration={1000}
      animationBegin={400}
      {...props}
    />
  )
}
