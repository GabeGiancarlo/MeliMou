"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { 
  Bot, 
  Mic, 
  Send, 
  Settings,
  MessageCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  Lock
} from "lucide-react";

// Mock conversation data
const mockMessages = [
  {
    id: 1,
    isFromUser: false,
    content: "Γεια σας! Hello! I'm your Greek tutor. Let's practice some basic phrases. How would you say 'Good morning' in Greek?",
    feedback: null,
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 2,
    isFromUser: true,
    content: "Kalimera?",
    feedback: null,
    timestamp: new Date(Date.now() - 4 * 60 * 1000)
  },
  {
    id: 3,
    isFromUser: false,
    content: "Excellent! 'Καλημέρα' (Kalimera) is correct! You pronounced it well. Now try saying 'Thank you' in Greek.",
    feedback: {
      corrections: [],
      hints: ["Great pronunciation!", "Remember the accent on the first syllable"],
      encouragement: "You're doing great!"
    },
    timestamp: new Date(Date.now() - 3 * 60 * 1000)
  }
];

export default function TutorPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [formalityLevel, setFormalityLevel] = useState<"informal" | "formal" | "mixed">("mixed");
  const [sessionTopic, setSessionTopic] = useState("Basic Conversation");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      isFromUser: true,
      content: newMessage,
      feedback: null,
      timestamp: new Date()
    };

    // Simulate AI response
    const aiResponse = {
      id: messages.length + 2,
      isFromUser: false,
      content: generateMockResponse(newMessage, formalityLevel),
      feedback: {
        corrections: [],
        hints: ["Try to speak more slowly", "Focus on the vowel sounds"],
        encouragement: "Keep practicing!"
      },
      timestamp: new Date(Date.now() + 1000)
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setNewMessage("");
  };

  const startNewSession = () => {
    setMessages([{
      id: 1,
      isFromUser: false,
      content: getSessionStarter(formalityLevel, sessionTopic),
      feedback: null,
      timestamp: new Date()
    }]);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  };

  function generateMockResponse(input: string, formality: "informal" | "formal" | "mixed") {
    const responses = {
      informal: [
        "Ωραία! That's good! Let's try another phrase.",
        "Καλά! Nice work! How about we practice numbers next?",
        "Μπράβο! Great job! Keep going like this."
      ],
      formal: [
        "Εξαιρετικά. Your pronunciation is improving. Shall we continue?",
        "Πολύ καλά. I recommend focusing on the accent patterns.",
        "Συγχαρητήρια. Your effort is commendable."
      ],
      mixed: [
        "Good job! Καλή δουλειά! Let's practice more.",
        "That's right! Σωστά! Try the next phrase.",
        "Excellent! Τέλεια! You're learning fast."
      ]
    };

    const levelResponses = responses[formality] || responses.mixed;
    return levelResponses[Math.floor(Math.random() * levelResponses.length)] || "Let's continue practicing!";
  }

  function getSessionStarter(formality: string, topic: string) {
    return `Γεια σας! Welcome to your Greek practice session. Today we'll focus on "${topic}". I'll adjust my responses to ${formality} Greek. Ready to begin?`;
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="min-h-screen honey-bg p-6">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">🤖 AI Greek Tutor 🍯</h1>
          <p className="text-gray-300">Practice Greek conversation with your personal AI tutor - where learning is sweet!</p>
        </header>

        {/* Preview Banner for Non-Authenticated Users */}
        {!session && (
          <Card className="mb-6 honey-gradient border-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    🍯 Sweet Preview Mode
                  </h3>
                  <p className="text-yellow-100 mb-3">
                    You're viewing a demo of our AI Greek Tutor! Sign up to unlock unlimited conversations, 
                    personalized feedback, and advanced features.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/auth/signin">
                      <Button className="bg-white text-amber-600 hover:bg-gray-100 font-semibold">
                        Start Learning Free 🚀
                      </Button>
                    </Link>
                    <Link href="/subscription">
                      <Button variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600">
                        View Plans
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="text-white text-6xl opacity-50">
                  🍯
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-4">
          {/* Settings Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="honey-card">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Session Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Formality Level</label>
                  <div className="space-y-2">
                    {["informal", "formal", "mixed"].map((level) => (
                      <Button
                        key={level}
                        variant={formalityLevel === level ? "default" : "outline"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => setFormalityLevel(level as any)}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Topic</label>
                  <select 
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    className="w-full p-2 border rounded-md bg-gray-700 text-white border-gray-600"
                  >
                    <option>Basic Conversation</option>
                    <option>Ordering Food</option>
                    <option>Asking Directions</option>
                    <option>Shopping</option>
                    <option>Weather & Time</option>
                    <option>Family & Friends</option>
                  </select>
                </div>

                <Button 
                  onClick={startNewSession}
                  className="w-full honey-button "
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Session 🍯
                </Button>
              </CardContent>
            </Card>

            <Card className="honey-card">
              <CardHeader>
                <CardTitle className="text-white text-base">🍯 Sweet Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-2 text-gray-300">
                  <li>• Speak clearly and slowly</li>
                  <li>• Don't worry about mistakes</li>
                  <li>• Try to use Greek as much as possible</li>
                  <li>• Ask for help when needed</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col honey-card">
              <CardHeader className="border-b border-gray-600">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Bot className="h-5 w-5 text-yellow-400" />
                    Greek Tutor AI 🍯
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{formalityLevel}</Badge>
                    <Badge variant="outline">{sessionTopic}</Badge>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex gap-3 ${message.isFromUser ? 'justify-end' : 'justify-start'}`}>
                        {!message.isFromUser && (
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        )}
                        
                        <div className={`max-w-[70%] ${message.isFromUser ? 'order-first' : ''}`}>
                          <div className={`p-3 rounded-lg ${
                            message.isFromUser 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm">{message.content}</p>
                          </div>
                          
                          {message.feedback && !message.isFromUser && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs">
                              <div className="font-medium text-green-800">Feedback:</div>
                              <div className="text-green-700">{message.feedback.encouragement}</div>
                              {message.feedback.hints.length > 0 && (
                                <div className="mt-1">
                                  <span className="font-medium">Tips:</span> {message.feedback.hints.join(", ")}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500 mt-1">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>

                        {message.isFromUser && (
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">You</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Type your response in Greek or English..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      size="sm"
                      onClick={toggleRecording}
                      className="px-3"
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="px-3">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleSendMessage} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {isRecording && (
                  <div className="mt-2 text-sm text-red-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    Recording... Click mic to stop
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 