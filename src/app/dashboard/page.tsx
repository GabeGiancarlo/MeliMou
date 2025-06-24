"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import { 
  BookOpen, 
  MessageCircle, 
  Bell, 
  BookMarked, 
  Bot,
  TrendingUp,
  Clock,
  Star,
  Users
} from "lucide-react";
import { api } from "~/trpc/react";

// Mock data for development - will be replaced with real tRPC calls
const mockProgress = {
  lessonsCompleted: 15,
  totalLessons: 30,
  streakDays: 7,
  hoursStudied: 24,
};

const mockUpcomingLessons = [
  { id: 1, title: "Greek Alphabet - Part 3", module: "Basics", estimatedTime: 15 },
  { id: 2, title: "Common Greetings", module: "Conversation", estimatedTime: 20 },
  { id: 3, title: "Numbers 1-20", module: "Vocabulary", estimatedTime: 10 },
];

const mockRecentAlerts = [
  { id: 1, title: "New lesson available!", content: "Greek Mythology vocabulary is ready", type: "instructor" as const, isRead: false },
  { id: 2, title: "Achievement unlocked!", content: "You completed 7 days in a row", type: "achievement" as const, isRead: false },
  { id: 3, title: "Weekly challenge", content: "Practice your pronunciation this week", type: "system" as const, isRead: true },
];

export default function DashboardPage() {
  // TODO: Replace with real tRPC calls
  // const { data: userProgress } = api.lesson.getUserProgress.useQuery();
  // const { data: alerts } = api.alert.getUserAlerts.useQuery({ limit: 5 });

  const progressPercentage = (mockProgress.lessonsCompleted / mockProgress.totalLessons) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back to your Greek journey!</h1>
          <p className="text-lg text-gray-600">Keep up the great work! Let's continue learning Greek together.</p>
        </header>

        {/* Progress Summary */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProgress.lessonsCompleted}/{mockProgress.totalLessons}</div>
              <Progress value={progressPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                {progressPercentage.toFixed(0)}% complete
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProgress.streakDays} days</div>
              <p className="text-xs text-muted-foreground">Keep it going!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Studied</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockProgress.hoursStudied}h</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Beginner</div>
              <p className="text-xs text-muted-foreground">Level 2</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upcoming Lessons */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Upcoming Lessons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUpcomingLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-medium">{lesson.title}</h4>
                      <p className="text-sm text-gray-600">{lesson.module}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lesson.estimatedTime}min
                      </Badge>
                      <Button size="sm" asChild>
                        <Link href={`/learning-paths/lesson/${lesson.id}`}>
                          Start
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/learning-paths">View All Learning Paths</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRecentAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className={`p-3 border rounded-lg ${!alert.isRead ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{alert.title}</h5>
                        <p className="text-xs text-gray-600 mt-1">{alert.content}</p>
                      </div>
                      {!alert.isRead && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/alerts">View All Alerts</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/tutor">
                    <Bot className="mr-2 h-4 w-4" />
                    Practice with AI Tutor
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/chat">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Join Study Chat
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/resources">
                    <BookMarked className="mr-2 h-4 w-4" />
                    Browse Resources
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/learning-paths">
                    <Users className="mr-2 h-4 w-4" />
                    Join a Cohort
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
