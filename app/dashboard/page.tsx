"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"
import { Calendar, TrendingUp, Target, Clock, Trophy } from "lucide-react"
import Link from "next/link"

interface TestResult {
  wpm: number
  accuracy: number
  timeElapsed: number
  errors: number
  textLength: number
  date: string
}

export default function DashboardPage() {
  const [history, setHistory] = useState<TestResult[]>([])
  const [stats, setStats] = useState({
    totalTests: 0,
    averageWpm: 0,
    averageAccuracy: 0,
    bestWpm: 0,
    totalTime: 0,
  })

  useEffect(() => {
    const savedHistory = localStorage.getItem("typingHistory")
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory)
      setHistory(parsedHistory)

      // Calculate stats
      if (parsedHistory.length > 0) {
        const totalWpm = parsedHistory.reduce((sum: number, test: TestResult) => sum + test.wpm, 0)
        const totalAccuracy = parsedHistory.reduce((sum: number, test: TestResult) => sum + test.accuracy, 0)
        const totalTime = parsedHistory.reduce((sum: number, test: TestResult) => sum + test.timeElapsed, 0)
        const bestWpm = Math.max(...parsedHistory.map((test: TestResult) => test.wpm))

        setStats({
          totalTests: parsedHistory.length,
          averageWpm: Math.round(totalWpm / parsedHistory.length),
          averageAccuracy: Math.round(totalAccuracy / parsedHistory.length),
          bestWpm,
          totalTime,
        })
      }
    }
  }, [])

  // Prepare chart data
  const chartData = history.slice(-7).map((test, index) => ({
    test: `Test ${index + 1}`,
    wpm: test.wpm,
    accuracy: test.accuracy,
    date: new Date(test.date).toLocaleDateString(),
  }))

  const weeklyData = history.slice(-7).map((test, index) => ({
    day: new Date(test.date).toLocaleDateString("en-US", { weekday: "short" }),
    wpm: test.wpm,
    accuracy: test.accuracy,
  }))

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Progress Dashboard</h1>
        <p className="text-muted-foreground">Track your typing progress and see how you're improving over time</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Total Tests</CardDescription>
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTests}</div>
            <div className="text-xs text-muted-foreground">{formatTime(stats.totalTime)} total practice</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Average Speed</CardDescription>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageWpm}</div>
            <div className="text-xs text-muted-foreground">WPM</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Average Accuracy</CardDescription>
              <Target className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAccuracy}%</div>
            <div className="text-xs text-muted-foreground">Correct</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription>Best Speed</CardDescription>
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestWpm}</div>
            <div className="text-xs text-muted-foreground">WPM Record</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {history.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Speed Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Speed Progress</CardTitle>
              <CardDescription>Your typing speed over the last 7 tests</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  wpm: {
                    label: "WPM",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="test" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--chart-1))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Accuracy Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Accuracy Trend</CardTitle>
              <CardDescription>Your typing accuracy over the last 7 tests</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  accuracy: {
                    label: "Accuracy %",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="test" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="accuracy" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Test History</h3>
            <p className="text-muted-foreground mb-4">Take your first typing test to start tracking your progress</p>
            <Button asChild>
              <Link href="/test">Start Your First Test</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Tests */}
      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Tests</CardTitle>
            <CardDescription>Your latest typing test results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history
                .slice(-5)
                .reverse()
                .map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">
                        {new Date(test.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(test.date).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{test.wpm} WPM</Badge>
                      <Badge variant="outline">{test.accuracy}% Accuracy</Badge>
                      <Badge variant="outline">{test.errors} Errors</Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Call to Action */}
      <Card>
        <CardContent className="text-center py-8">
          <h3 className="text-xl font-semibold mb-2">Ready for Another Test?</h3>
          <p className="text-muted-foreground mb-4">Keep practicing to improve your typing speed and accuracy</p>
          <Button asChild size="lg">
            <Link href="/test">Start New Test</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
