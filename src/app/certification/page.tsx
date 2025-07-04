"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { 
  Trophy, 
  Award, 
  BookOpen, 
  Clock,
  Star,
  Download,
  CheckCircle,
  Target,
  Users,
  Calendar,
  Sparkles,
  Lock
} from "lucide-react";

// Mock certification data
const mockCertifications = [
  {
    id: 1,
    name: "Greek Alphabet Mastery",
    level: "Beginner",
    description: "Master the Greek alphabet, pronunciation, and basic reading skills",
    progress: 100,
    completed: true,
    completedDate: "2024-01-15",
    badge: "🍯 Golden Alpha"
  },
  {
    id: 2,
    name: "Conversational Greek Basics",
    level: "Beginner",
    description: "Essential phrases and conversation skills for daily interactions",
    progress: 75,
    completed: false,
    requirements: ["Complete 50 conversation sessions", "Pass pronunciation test", "Learn 200 vocabulary words"]
  },
  {
    id: 3,
    name: "Greek Culture & History",
    level: "Intermediate",
    description: "Deep understanding of Greek mythology, history, and cultural context",
    progress: 0,
    completed: false,
    locked: true,
    requirements: ["Complete Conversational Greek Basics", "Study 10 cultural modules"]
  }
];

const mockUpcomingExams = [
  {
    id: 1,
    name: "Conversational Greek Assessment",
    date: "March 25, 2024",
    type: "Speaking & Listening",
    duration: "45 minutes",
    difficulty: "Beginner"
  },
  {
    id: 2,
    name: "Greek Grammar Proficiency",
    date: "April 10, 2024", 
    type: "Written Exam",
    duration: "60 minutes",
    difficulty: "Intermediate"
  }
];

export default function CertificationPage() {
  const { data: session } = useSession();

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen honey-bg p-4">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            🏆 Certification Path 🍯
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Earn recognized certificates as you progress through your sweet Greek learning journey
          </p>
        </header>

        {/* Preview Banner for Non-Authenticated Users */}
        {!session && (
          <Card className="mb-8 bg-gradient-to-r from-yellow-600 to-amber-600 border-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    🏆 Preview Certification System
                  </h3>
                  <p className="text-yellow-100 mb-3">
                    See how our certification system works! Sign up to start earning real certificates, 
                    track your progress, and showcase your Greek language skills to the world.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/auth/signin">
                      <Button className="bg-white text-yellow-600 hover:bg-gray-100 font-semibold">
                        Start Earning Certificates 🚀
                      </Button>
                    </Link>
                    <Link href="/subscription">
                      <Button variant="outline" className="border-white text-white hover:bg-white hover:text-yellow-600">
                        Upgrade to Premium
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="text-white text-6xl opacity-50">
                  🏆
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Progress Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="honey-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  Your Certification Journey
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockCertifications.map((cert) => (
                  <div key={cert.id} className={`p-6 rounded-lg border ${cert.locked ? 'bg-gray-700 border-gray-600' : 'bg-gray-750 border-gray-600'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`text-lg font-semibold ${cert.locked ? 'text-gray-400' : 'text-white'}`}>
                            {cert.name}
                          </h3>
                          <Badge className={getDifficultyColor(cert.level)}>
                            {cert.level}
                          </Badge>
                          {cert.completed && (
                            <Badge className="bg-green-600 text-white">
                              ✓ Completed
                            </Badge>
                          )}
                          {cert.locked && (
                            <Badge className="bg-gray-600 text-gray-300">
                              🔒 Locked
                            </Badge>
                          )}
                        </div>
                        <p className={`text-sm ${cert.locked ? 'text-gray-500' : 'text-gray-300'}`}>
                          {cert.description}
                        </p>
                        {cert.badge && (
                          <div className="mt-2">
                            <span className="text-yellow-400 font-medium">{cert.badge}</span>
                          </div>
                        )}
                      </div>
                      {cert.completed && (
                        <div className="text-center">
                          <Award className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                          <Button size="sm" variant="outline" className="text-yellow-400 border-yellow-400 hover:bg-amber-400 hover:text-gray-900">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {!cert.completed && !cert.locked && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300">Progress</span>
                          <span className="text-yellow-400">{cert.progress}%</span>
                        </div>
                        <Progress value={cert.progress} className="h-2" />
                        
                        {cert.requirements && (
                          <div className="mt-4">
                            <h4 className="text-white font-medium mb-2">Requirements:</h4>
                            <ul className="space-y-1">
                              {cert.requirements.map((req, index) => (
                                <li key={index} className="flex items-center text-sm text-gray-300">
                                  <CheckCircle className="h-4 w-4 text-gray-500 mr-2" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <Button className="w-full honey-button ">
                          Continue Learning 🍯
                        </Button>
                      </div>
                    )}

                    {cert.locked && cert.requirements && (
                      <div className="mt-4">
                        <h4 className="text-gray-400 font-medium mb-2">Unlock Requirements:</h4>
                        <ul className="space-y-1">
                          {cert.requirements.map((req, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-500">
                              <Target className="h-4 w-4 mr-2" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {cert.completedDate && (
                      <div className="mt-4 text-sm text-gray-400">
                        Completed on {new Date(cert.completedDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Exams */}
            <Card className="honey-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-purple-400" />
                  Upcoming Assessments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUpcomingExams.map((exam) => (
                  <div key={exam.id} className="p-4 bg-gray-750 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold">{exam.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {exam.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {exam.duration}
                          </span>
                          <Badge className={getDifficultyColor(exam.difficulty)}>
                            {exam.difficulty}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{exam.type}</p>
                      </div>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="honey-card">
              <CardHeader>
                <CardTitle className="text-white">🍯 Sweet Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-400" />
                    <span>Internationally recognized certificates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>LinkedIn profile integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-yellow-400" />
                    <span>Community recognition badges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-yellow-400" />
                    <span>Portfolio building credentials</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="honey-card">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start honey-button " asChild>
                  <Link href="/learning-paths">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Continue Learning 🍯
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/subscription">
                    <Trophy className="mr-2 h-4 w-4" />
                    Upgrade for More Certs
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/dashboard">
                    <Star className="mr-2 h-4 w-4" />
                    View Progress
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="honey-card">
              <CardHeader>
                <CardTitle className="text-white">Certification Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium text-green-400 mb-1">🍯 Beginner (A1-A2)</div>
                  <p className="text-gray-400">Basic communication and alphabet mastery</p>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-yellow-400 mb-1">🏛️ Intermediate (B1-B2)</div>
                  <p className="text-gray-400">Conversational fluency and cultural knowledge</p>
                </div>
                <div className="text-sm">
                  <div className="font-medium text-red-400 mb-1">🏆 Advanced (C1-C2)</div>
                  <p className="text-gray-400">Native-like proficiency and literature</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 