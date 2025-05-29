import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Keyboard, Zap, Target, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const benefits = [
    {
      icon: Zap,
      title: "Increase Speed",
      description: "Learn to type faster with structured practice sessions and real-time feedback.",
    },
    {
      icon: Target,
      title: "Improve Accuracy",
      description: "Reduce errors and build muscle memory for consistent, accurate typing.",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your improvement with detailed statistics and performance charts.",
    },
    {
      icon: Keyboard,
      title: "Master Technique",
      description: "Learn proper finger placement and typing techniques for long-term success.",
    },
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <Badge variant="secondary" className="text-sm">
            🚀 Improve Your Typing Skills
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Master the Art of
            <span className="text-primary"> Fast Typing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Boost your productivity and confidence with our interactive typing tests. Track your progress, improve your
            speed, and achieve typing mastery.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/test">Start Typing Test</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-lg px-8">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Why Learn Touch Typing?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Touch typing is an essential skill in today's digital world. Here's how it can benefit you:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 rounded-lg p-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold">Join Thousands of Learners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">50K+</div>
              <div className="text-muted-foreground">Tests Completed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">85%</div>
              <div className="text-muted-foreground">Average Improvement</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-primary">120+</div>
              <div className="text-muted-foreground">Average WPM Achieved</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12">
        <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Take your first typing test and see where you stand. Our system will track your progress and help you improve.
        </p>
        <Button asChild size="lg" className="text-lg px-8">
          <Link href="/test">Start Your First Test</Link>
        </Button>
      </section>
    </div>
  )
}
