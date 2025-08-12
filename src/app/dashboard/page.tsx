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
    <div className="min-h-screen honey-bg p-6">
      <div className="mx-auto max-w-7xl">
                  <header className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back to your Greek journey!</h1>
            <p className="text-lg text-gray-300">Keep up the great work! Let's continue learning Greek together.</p>
          </header>

        {/* Progress Summary */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="honey-card hex-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-300">Lessons Completed</CardTitle>
              <div className="hex-clip hex-icon sm"><BookOpen className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold honey-text">{mockProgress.lessonsCompleted}/{mockProgress.totalLessons}</div>
              <Progress value={progressPercentage} className="mt-3" />
              <p className="text-xs text-amber-200 mt-2">
                {progressPercentage.toFixed(0)}% complete
              </p>
            </CardContent>
          </Card>

          <Card className="honey-card hex-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-300">Study Streak</CardTitle>
              <div className="hex-clip hex-icon sm"><TrendingUp className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold honey-text">{mockProgress.streakDays} days</div>
              <p className="text-xs text-amber-200">Keep it going!</p>
            </CardContent>
          </Card>

          <Card className="honey-card hex-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-300">Hours Studied</CardTitle>
              <div className="hex-clip hex-icon sm"><Clock className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold honey-text">{mockProgress.hoursStudied}h</div>
              <p className="text-xs text-amber-200">This month</p>
            </CardContent>
          </Card>

          <Card className="honey-card hex-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-300">Level</CardTitle>
              <div className="hex-clip hex-icon sm"><Star className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold honey-text">Beginner</div>
              <p className="text-xs text-amber-200">Level 2</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upcoming Lessons */}
          <div className="lg:col-span-2">
            <Card className="honey-card hex-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="hex-clip hex-icon sm"><BookOpen className="h-4 w-4" /></div>
                  Upcoming Lessons
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUpcomingLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 rounded-lg transition-colors bg-[#1e1a28]/80 border border-amber-400/20 hover:bg-amber-500/10">
                    <div>
                      <h4 className="font-medium text-amber-200">{lesson.title}</h4>
                      <p className="text-sm text-gray-300">{lesson.module}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="flex items-center gap-1 bg-amber-500/20 text-amber-200 border border-amber-400/30">
                        <Clock className="h-3 w-3 text-amber-300" />
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
            <Card className="honey-card hex-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="hex-clip hex-icon sm"><Bell className="h-4 w-4" /></div>
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockRecentAlerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className={`p-3 border rounded-lg ${!alert.isRead ? 'bg-amber-500/10 border-amber-400/30' : 'bg-gray-700 border-gray-600'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm text-amber-200">{alert.title}</h5>
                        <p className="text-xs text-gray-300 mt-1">{alert.content}</p>
                      </div>
                      {!alert.isRead && (<div className="h-2 w-2 bg-amber-400 rounded-full mt-1"></div>)}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/alerts">View All Alerts</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="honey-card hex-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/tutor">
                    <Bot className="mr-2 h-4 w-4 text-amber-300" />
                    Practice with AI Tutor
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/chat">
                    <MessageCircle className="mr-2 h-4 w-4 text-amber-300" />
                    Join Study Chat
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/resources">
                    <BookMarked className="mr-2 h-4 w-4 text-amber-300" />
                    Browse Resources
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/learning-paths">
                    <Users className="mr-2 h-4 w-4 text-amber-300" />
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
