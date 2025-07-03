"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { 
  BookOpen, 
  Users, 
  Clock, 
  Star,
  ArrowRight,
  Calendar,
  MapPin
} from "lucide-react";

// Mock data for learning paths
const mockLearningPaths = [
  {
    id: 1,
    name: "Greek Alphabet Mastery",
    description: "Master the Greek alphabet, pronunciation, and basic reading skills",
    difficulty: "beginner" as const,
    type: "solo",
    modules: 8,
    estimatedHours: 15,
    progress: 60,
    isEnrolled: true
  },
  {
    id: 2,
    name: "Conversational Greek Fundamentals",
    description: "Learn essential phrases and conversation skills for daily interactions",
    difficulty: "beginner" as const,
    type: "solo",
    modules: 12,
    estimatedHours: 25,
    progress: 30,
    isEnrolled: true
  },
  {
    id: 3,
    name: "Greek Mythology & Culture",
    description: "Explore Greek mythology, history, and cultural context",
    difficulty: "intermediate" as const,
    type: "solo",
    modules: 10,
    estimatedHours: 20,
    progress: 0,
    isEnrolled: false
  },
  {
    id: 4,
    name: "Advanced Grammar & Literature",
    description: "Deep dive into complex grammar rules and classical literature",
    difficulty: "advanced" as const,
    type: "solo",
    modules: 15,
    estimatedHours: 40,
    progress: 0,
    isEnrolled: false
  }
];

const mockCohorts = [
  {
    id: 1,
    name: "Beginner Cohort - Spring 2024",
    description: "Join fellow beginners in a structured 12-week program",
    instructor: "Instructor Maria Papadakis",
    startDate: "March 1, 2024",
    endDate: "May 24, 2024",
    schedule: "Tuesdays & Thursdays, 7:00 PM EST",
    maxStudents: 15,
    currentStudents: 12,
    difficulty: "beginner" as const,
    price: "$299"
  },
  {
    id: 2,
    name: "Intermediate Conversation Group",
    description: "Practice speaking with intermediate-level students",
    instructor: "Instructor Dimitris Kostas",
    startDate: "March 15, 2024",
    endDate: "June 7, 2024",
    schedule: "Wednesdays, 6:30 PM EST",
    maxStudents: 10,
    currentStudents: 7,
    difficulty: "intermediate" as const,
    price: "$399"
  }
];

export default function LearningPathsPage() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-amber-900 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📚 Learning Paths 🍯</h1>
          <p className="text-gray-300">Choose your sweet Greek learning journey - study solo or join a cohort</p>
        </header>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Solo Learning Paths */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-amber-400" />
                Solo Learning Paths 🍯
              </h2>
              <p className="text-gray-300">Self-paced courses you can complete at your own schedule</p>
            </div>

            <div className="space-y-4">
              {mockLearningPaths.map((path) => (
                <Card key={path.id} className="hover:shadow-md transition-shadow bg-gray-800 border-gray-700">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-white">{path.name}</CardTitle>
                        <p className="text-sm text-gray-300 mt-1">{path.description}</p>
                      </div>
                      <Badge className={`text-xs ${getDifficultyColor(path.difficulty)}`}>
                        {path.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {path.modules} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        ~{path.estimatedHours}h
                      </span>
                    </div>

                    {path.isEnrolled && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{path.progress}%</span>
                        </div>
                        <Progress value={path.progress} className="h-2" />
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-green-600">
                        {path.isEnrolled ? 'Enrolled' : 'Free'}
                      </span>
                      <Button size="sm" className={path.isEnrolled ? "bg-amber-600 hover:bg-amber-700" : "bg-purple-600 hover:bg-purple-700"} asChild>
                        <Link href={`/learning-paths/${path.id}`}>
                          {path.isEnrolled ? 'Continue 🍯' : 'Start Free 🏛️'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cohort Learning */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Users className="h-6 w-6 text-purple-400" />
                Cohort Learning 🏛️
              </h2>
              <p className="text-gray-300">Structured group learning with instructor guidance and peer support</p>
            </div>

            <div className="space-y-4">
              {mockCohorts.map((cohort) => (
                <Card key={cohort.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{cohort.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{cohort.description}</p>
                      </div>
                      <Badge className={`text-xs ${getDifficultyColor(cohort.difficulty)}`}>
                        {cohort.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Star className="h-4 w-4" />
                        <span>Instructor: {cohort.instructor}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{cohort.startDate} - {cohort.endDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{cohort.schedule}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{cohort.currentStudents}/{cohort.maxStudents} students</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-bold text-blue-600">{cohort.price}</span>
                      <Button size="sm" asChild>
                        <Link href={`/cohorts/${cohort.id}`}>
                          Join Cohort
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">More Cohorts Coming Soon</h3>
                  <p className="text-gray-600 mb-4">We're planning more cohorts for different levels and schedules.</p>
                  <Button variant="outline" size="sm">
                    Get Notified
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 