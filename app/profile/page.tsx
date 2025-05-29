"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Settings, Trophy, Target, Clock, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  name: string
  email: string
  joinDate: string
  goal: number
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile>({
    name: "John Doe",
    email: "john@example.com",
    joinDate: new Date().toISOString(),
    goal: 50,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [stats, setStats] = useState({
    totalTests: 0,
    averageWpm: 0,
    bestWpm: 0,
    totalTime: 0,
  })

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }

    // Load stats from typing history
    const history = JSON.parse(localStorage.getItem("typingHistory") || "[]")
    if (history.length > 0) {
      const totalWpm = history.reduce((sum: number, test: any) => sum + test.wpm, 0)
      const totalTime = history.reduce((sum: number, test: any) => sum + test.timeElapsed, 0)
      const bestWpm = Math.max(...history.map((test: any) => test.wpm))

      setStats({
        totalTests: history.length,
        averageWpm: Math.round(totalWpm / history.length),
        bestWpm,
        totalTime,
      })
    }
  }, [])

  const saveProfile = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile))
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    })
  }

  const clearHistory = () => {
    localStorage.removeItem("typingHistory")
    localStorage.removeItem("lastTestResults")
    setStats({
      totalTests: 0,
      averageWpm: 0,
      bestWpm: 0,
      totalTime: 0,
    })
    toast({
      title: "History Cleared",
      description: "All your typing test history has been cleared.",
    })
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getAchievements = () => {
    const achievements = []

    if (stats.totalTests >= 1)
      achievements.push({ name: "First Test", description: "Completed your first typing test" })
    if (stats.totalTests >= 10)
      achievements.push({ name: "Dedicated Learner", description: "Completed 10 typing tests" })
    if (stats.totalTests >= 50)
      achievements.push({ name: "Typing Enthusiast", description: "Completed 50 typing tests" })
    if (stats.bestWpm >= 40) achievements.push({ name: "Speed Demon", description: "Achieved 40+ WPM" })
    if (stats.bestWpm >= 70) achievements.push({ name: "Typing Master", description: "Achieved 70+ WPM" })
    if (stats.averageWpm >= profile.goal)
      achievements.push({ name: "Goal Achieved", description: `Reached your goal of ${profile.goal} WPM` })

    return achievements
  }

  const achievements = getAchievements()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and view your typing achievements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Settings className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Typing Speed Goal (WPM)</Label>
                <Input
                  id="goal"
                  type="number"
                  value={profile.goal}
                  onChange={(e) => setProfile({ ...profile, goal: Number.parseInt(e.target.value) || 50 })}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label>Member Since</Label>
                <div className="text-sm text-muted-foreground">
                  {new Date(profile.joinDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              {isEditing && (
                <Button onClick={saveProfile} className="w-full">
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <CardTitle>Achievements</CardTitle>
              </div>
              <CardDescription>Your typing milestones and accomplishments</CardDescription>
            </CardHeader>
            <CardContent>
              {achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Trophy className="w-8 h-8 text-yellow-500" />
                      <div>
                        <div className="font-medium">{achievement.name}</div>
                        <div className="text-sm text-muted-foreground">{achievement.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No Achievements Yet</h3>
                  <p className="text-sm text-muted-foreground">Complete typing tests to unlock achievements</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Tests Taken</span>
                </div>
                <Badge variant="secondary">{stats.totalTests}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Average Speed</span>
                </div>
                <Badge variant="secondary">{stats.averageWpm} WPM</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Best Speed</span>
                </div>
                <Badge variant="secondary">{stats.bestWpm} WPM</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Total Practice</span>
                </div>
                <Badge variant="secondary">{formatTime(stats.totalTime)}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Goal Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current: {stats.averageWpm} WPM</span>
                  <span>Goal: {profile.goal} WPM</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((stats.averageWpm / profile.goal) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  {stats.averageWpm >= profile.goal
                    ? "Goal Achieved! 🎉"
                    : `${profile.goal - stats.averageWpm} WPM to go`}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">Manage your typing test data and history</div>
                <Separator />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={clearHistory}
                  className="w-full"
                  disabled={stats.totalTests === 0}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All History
                </Button>
                <div className="text-xs text-muted-foreground">This action cannot be undone</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
