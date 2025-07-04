"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { 
  BookMarked, 
  Search, 
  Filter, 
  ExternalLink, 
  FileText, 
  Video, 
  Link as LinkIcon,
  Download
} from "lucide-react";

// Mock data for resources
const mockResources = [
  {
    id: 1,
    title: "Greek Alphabet Interactive Chart",
    description: "Interactive chart showing all Greek letters with pronunciation guides and examples.",
    url: "https://example.com/greek-alphabet",
    fileUrl: null,
    tags: ["alphabet", "beginner", "pronunciation"],
    difficulty: "beginner" as const,
    type: "link",
    createdBy: { name: "Instructor Maria", image: null }
  },
  {
    id: 2,
    title: "Essential Greek Phrases PDF",
    description: "Comprehensive PDF with 100 essential phrases for everyday conversations in Greek.",
    url: null,
    fileUrl: "https://example.com/greek-phrases.pdf",
    tags: ["phrases", "conversation", "pdf"],
    difficulty: "beginner" as const,
    type: "pdf",
    createdBy: { name: "Instructor Sofia", image: null }
  },
  {
    id: 3,
    title: "Greek Mythology Video Series",
    description: "Educational video series exploring Greek mythology and its influence on modern culture.",
    url: "https://example.com/mythology-videos",
    fileUrl: null,
    tags: ["mythology", "culture", "video"],
    difficulty: "intermediate" as const,
    type: "video",
    createdBy: { name: "Cultural Center", image: null }
  },
  {
    id: 4,
    title: "Advanced Grammar Rules",
    description: "Detailed explanation of complex Greek grammar rules with examples and exercises.",
    url: null,
    fileUrl: "https://example.com/grammar-advanced.pdf",
    tags: ["grammar", "advanced", "exercises"],
    difficulty: "advanced" as const,
    type: "pdf",
    createdBy: { name: "Instructor Dimitris", image: null }
  },
];

const difficulties = ["beginner", "intermediate", "advanced"];
const allTags = ["alphabet", "beginner", "pronunciation", "phrases", "conversation", "pdf", "mythology", "culture", "video", "grammar", "advanced", "exercises"];

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = !selectedDifficulty || resource.difficulty === selectedDifficulty;
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => resource.tags.includes(tag));
    
    return matchesSearch && matchesDifficulty && matchesTags;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5 text-red-500" />;
      case 'pdf':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'link':
        return <LinkIcon className="h-5 w-5 text-green-500" />;
      default:
        return <BookMarked className="h-5 w-5 text-gray-500" />;
    }
  };

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

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen honey-bg p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">📚 Learning Resources 🍯</h1>
          <p className="text-gray-300">Curated sweet materials to support your Greek learning journey</p>
        </header>

        {/* Filters */}
        <Card className="mb-8 honey-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Filter className="h-5 w-5 text-yellow-400" />
              Filters 🍯
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Difficulty Filter */}
            <div>
              <h4 className="font-medium mb-2">Difficulty Level</h4>
              <div className="flex gap-2">
                <Button
                  variant={selectedDifficulty === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDifficulty(null)}
                >
                  All
                </Button>
                {difficulties.map((difficulty) => (
                  <Button
                    key={difficulty}
                    variant={selectedDifficulty === difficulty ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                  >
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <h4 className="font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resources Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getResourceIcon(resource.type)}
                    <CardTitle className="text-base line-clamp-2">{resource.title}</CardTitle>
                  </div>
                  <Badge className={`text-xs ${getDifficultyColor(resource.difficulty)}`}>
                    {resource.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">{resource.description}</p>

                <div className="flex flex-wrap gap-1">
                  {resource.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">by {resource.createdBy.name}</span>
                  
                  <div className="flex gap-2">
                    {resource.url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit
                        </a>
                      </Button>
                    )}
                    {resource.fileUrl && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookMarked className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 