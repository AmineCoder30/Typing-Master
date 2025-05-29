"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Clock, AlertTriangle, RotateCcw, BarChart3 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface TestResults {
  wpm: number
  accuracy: number
  timeElapsed: number
  errors: number
  textLength: number
  date: string
}

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<TestResults | null>(null)

  const saveResults = () => {
    // Save to history in localStorage
    const history = JSON.parse(localStorage.getItem("typingHistory") || "[]")
    history.push(results)
    localStorage.setItem("typingHistory", JSON.stringify(history))
  }

  useEffect(() => {
    const savedResults = localStorage.getItem("lastTestResults")
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    } else {
      // Redirect to test page if no results found
      router.push("/test")
    }
  }, [router])

  useEffect(() => {
    if (results) {
      saveResults()
    }
  }, [results])

  if (!results) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-bold">Loading Results...</h1>
        <p className="text-muted-foreground">Please wait while we load your test results.</p>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getPerformanceLevel = (wpm: number) => {
    if (wpm >= 70) return { level: "Expert", color: "text-green-600", variant: "default" as const }
    if (wpm >= 50) return { level: "Advanced", color: "text-blue-600", variant: "secondary" as const }
    if (wpm >= 30) return { level: "Intermediate", color: "text-yellow-600", variant: "outline" as const }
    return { level: "Beginner", color: "text-orange-600", variant: "destructive" as const }
  }

  const performance = getPerformanceLevel(results.wpm)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Trophy className="w-16 h-16 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold">Test Complete!</h1>
        <p className="text-muted-foreground">Here's how you performed in your typing test</p>
        <Badge variant={performance.variant} className="text-lg px-4 py-2">
          {performance.level} Level
        </Badge>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-3xl font-bold">{results.wpm}</CardTitle>
            <CardDescription>Words Per Minute</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={Math.min((results.wpm / 100) * 100, 100)} className="h-2" />
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold">{results.accuracy}%</CardTitle>
            <CardDescription>Accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={results.accuracy} className="h-2" />
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <CardTitle className="text-3xl font-bold">{formatTime(results.timeElapsed)}</CardTitle>
            <CardDescription>Time Taken</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">{results.textLength} characters typed</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader className="pb-2">
            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-bold">{results.errors}</CardTitle>
            <CardDescription>Errors Made</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {((results.errors / results.textLength) * 100).toFixed(1)}% error rate
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Analysis</CardTitle>
          <CardDescription>Detailed breakdown of your typing performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Speed Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Your Speed:</span>
                  <span className="font-medium">{results.wpm} WPM</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Speed:</span>
                  <span className="text-muted-foreground">40 WPM</span>
                </div>
                <div className="flex justify-between">
                  <span>Professional Speed:</span>
                  <span className="text-muted-foreground">70+ WPM</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Accuracy Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Your Accuracy:</span>
                  <span className="font-medium">{results.accuracy}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Accuracy:</span>
                  <span className="text-muted-foreground">95%+</span>
                </div>
                <div className="flex justify-between">
                  <span>Characters Typed:</span>
                  <span className="text-muted-foreground">{results.textLength}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="space-y-4">
            <h3 className="font-semibold">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.wpm < 40 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Focus on Speed</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Practice regularly to increase your typing speed. Aim for 40+ WPM.
                  </p>
                </div>
              )}

              {results.accuracy < 95 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100">Improve Accuracy</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Slow down and focus on accuracy. Speed will naturally follow.
                  </p>
                </div>
              )}

              {results.wpm >= 40 && results.accuracy >= 95 && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100">Great Job!</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    You're performing well. Keep practicing to maintain consistency.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg" className="flex items-center gap-2">
          <Link href="/test">
            <RotateCcw className="w-4 h-4" />
            Take Another Test
          </Link>
        </Button>

        <Button asChild variant="outline" size="lg" className="flex items-center gap-2">
          <Link href="/dashboard">
            <BarChart3 className="w-4 h-4" />
            View Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
