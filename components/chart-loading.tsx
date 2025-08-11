import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartLoadingProps {
  title: string
  description?: string
  height?: number
}

export function ChartLoading({ title, description, height = 300 }: ChartLoadingProps) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Skeleton className="h-4 w-32" />
          <div className="animate-pulse">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            </div>
          </div>
        </CardTitle>
        {description && (
          <CardDescription>
            <Skeleton className="h-3 w-48" />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Chart skeleton */}
          <div className="relative" style={{ height }}>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-8" />
              ))}
            </div>

            {/* Chart area */}
            <div className="ml-12 mr-4 h-full relative">
              {/* Animated bars/lines */}
              <div className="absolute bottom-8 left-0 right-0 flex items-end justify-between space-x-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center space-y-2">
                    <Skeleton
                      className="w-full animate-pulse"
                      style={{
                        height: `${Math.random() * 150 + 50}px`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                    <Skeleton className="h-3 w-8" />
                  </div>
                ))}
              </div>
            </div>

            {/* X-axis */}
            <div className="absolute bottom-0 left-12 right-4 flex justify-between">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-3 w-8" />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MetricCardLoading() {
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <div className="flex items-center space-x-1">
          <Skeleton className="h-3 w-3 rounded" />
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function PieChartLoading({ title, description }: { title: string; description?: string }) {
  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-5 w-32" />
        </CardTitle>
        {description && (
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center" style={{ height: 300 }}>
          <div className="relative">
            {/* Animated pie chart skeleton */}
            <div className="w-32 h-32 rounded-full border-8 border-gray-200 animate-spin">
              <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-blue-400 animate-spin [animation-duration:2s]"></div>
              <div className="absolute inset-2 rounded-full border-6 border-transparent border-r-green-400 animate-spin [animation-duration:3s] [animation-direction:reverse]"></div>
              <div className="absolute inset-4 rounded-full border-4 border-transparent border-b-yellow-400 animate-spin [animation-duration:1.5s]"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
