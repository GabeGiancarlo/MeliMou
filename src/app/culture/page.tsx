"use client";

import React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { 
  Globe, 
  BookOpen, 
  Music, 
  Utensils,
  MapPin,
  Camera,
  Play,
  Star,
  Calendar,
  Users,
  Heart,
  Clock,
  Sparkles,
  Lock
} from "lucide-react";

// Mock cultural content data
const mockCulturalModules = [
  {
    id: 1,
    title: "Ancient Greek Mythology",
    description: "Explore the stories of gods, heroes, and legends that shaped Western civilization",
    category: "History & Mythology",
    duration: "45 min",
    lessons: 12,
    difficulty: "Beginner",
    image: "🏛️",
    completed: true,
    rating: 4.9
  },
  {
    id: 2,
    title: "Greek Island Traditions",
    description: "Discover the unique customs and festivals of Greek islands",
    category: "Traditions",
    duration: "30 min",
    lessons: 8,
    difficulty: "Beginner",
    image: "🏖️",
    completed: false,
    rating: 4.8
  },
  {
    id: 3,
    title: "Greek Cuisine & Food Culture",
    description: "Learn about Mediterranean diet, traditional recipes, and dining customs",
    category: "Food & Culture",
    duration: "60 min",
    lessons: 15,
    difficulty: "Intermediate",
    image: "🍯",
    completed: false,
    rating: 4.7
  },
  {
    id: 4,
    title: "Byzantine History & Orthodox Christianity",
    description: "Understanding the Byzantine Empire and Orthodox traditions",
    category: "History & Religion",
    duration: "75 min",
    lessons: 18,
    difficulty: "Advanced",
    image: "⛪",
    completed: false,
    rating: 4.9
  }
];

const mockCulturalEvents = [
  {
    id: 1,
    title: "Virtual Greek Festival Experience",
    date: "March 25, 2024",
    time: "3:00 PM EST",
    type: "Live Event",
    description: "Join us for a virtual celebration of Greek Independence Day with music, dance, and stories",
    participants: 156
  },
  {
    id: 2,
    title: "Greek Cooking Workshop",
    date: "April 5, 2024", 
    time: "6:00 PM EST",
    type: "Interactive Workshop",
    description: "Learn to make traditional spanakopita and baklava with honey 🍯",
    participants: 32
  }
];

const culturalHighlights = [
  {
    icon: "🏛️",
    title: "Ancient Wonders",
    description: "Parthenon, Delphi, and archaeological treasures"
  },
  {
    icon: "🎭",
    title: "Arts & Theater",
    description: "From ancient Greek drama to modern cinema"
  },
  {
    icon: "🍯",
    title: "Culinary Heritage",
    description: "Mediterranean flavors and honey traditions"
  },
  {
    icon: "🎵",
    title: "Music & Dance",
    description: "Bouzouki, rebetiko, and traditional folk dances"
  },
  {
    icon: "🏖️",
    title: "Island Culture",
    description: "Santorini, Mykonos, and hidden island gems"
  },
  {
    icon: "📚",
    title: "Philosophy & Literature", 
    description: "From Homer to modern Greek poetry"
  }
];

export default function CulturePage() {
  const { data: session } = useSession();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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
            🏛️ Cultural Immersion 🍯
          </h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Dive deep into Greek culture, history, and traditions while learning the language. 
            Discover the sweet heritage that makes Greece unique.
          </p>
        </header>

        {/* Cultural Highlights Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Explore Greek Heritage 🇬🇷
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {culturalHighlights.map((highlight, index) => (
              <Card key={index} className="honey-card hover:border-yellow-500 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{highlight.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{highlight.title}</h3>
                  <p className="text-gray-300 text-sm">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cultural Modules */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="honey-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="h-6 w-6 text-purple-400" />
                  Cultural Learning Modules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {mockCulturalModules.map((module) => (
                  <div key={module.id} className="p-6 bg-gray-750 rounded-lg border border-gray-600 hover:border-yellow-500 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{module.image}</div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-white font-semibold text-lg mb-1">{module.title}</h3>
                            <p className="text-gray-300 text-sm mb-2">{module.description}</p>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {module.lessons} lessons
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {module.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400" />
                                {module.rating}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getDifficultyColor(module.difficulty)}>
                              {module.difficulty}
                            </Badge>
                            {module.completed && (
                              <Badge className="bg-green-600 text-white mt-2 block">
                                ✓ Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                            {module.category}
                          </Badge>
                          <Button 
                            size="sm" 
                            className={module.completed ? "bg-gray-600 hover:bg-gray-700" : "honey-button "}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            {module.completed ? "Review" : "Start"} 🍯
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cultural Events */}
            <Card className="honey-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-yellow-400" />
                  Upcoming Cultural Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCulturalEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-gray-750 rounded-lg border border-gray-600">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-1">{event.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {event.participants} joined
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-2 bg-purple-600 text-white">
                          {event.type}
                        </Badge>
                        <br />
                        <Button size="sm" className="honey-button ">
                          Join Event
                        </Button>
                      </div>
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
                <CardTitle className="text-white">🍯 Sweet Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <Camera className="h-4 w-4 text-yellow-400" />
                    <span>Virtual museum tours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-yellow-400" />
                    <span>Traditional music library</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-yellow-400" />
                    <span>Recipe collection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-yellow-400" />
                    <span>Interactive cultural map</span>
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
                    Start Cultural Path 🍯
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/resources">
                    <Globe className="mr-2 h-4 w-4" />
                    Browse Resources
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/chat">
                    <Users className="mr-2 h-4 w-4" />
                    Join Community
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="honey-card">
              <CardHeader>
                <CardTitle className="text-white">Did You Know? 🤔</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-gray-300">
                  <div>
                    <div className="font-medium text-yellow-400 mb-1">🍯 Honey in Ancient Greece</div>
                    <p>Honey was considered "food of the gods" and used in religious ceremonies and as currency!</p>
                  </div>
                  <div>
                    <div className="font-medium text-purple-400 mb-1">🏛️ Language Legacy</div>
                    <p>Over 150,000 English words have Greek origins, making Greek valuable for vocabulary building.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 