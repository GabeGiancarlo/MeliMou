"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { 
  MessageCircle, 
  Send, 
  Users, 
  Hash,
  Mic,
  Image,
  Settings
} from "lucide-react";
import { api } from "~/trpc/react";

// Mock data for development
const mockMessages = [
  {
    id: 1,
    sender: { id: "1", name: "Maria K.", image: null },
    content: "Good morning everyone! Has anyone completed the alphabet lesson yet?",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    type: "text" as const,
  },
  {
    id: 2,
    sender: { id: "2", name: "John D.", image: null },
    content: "Yes! It was challenging but I managed to finish it. The pronunciation section really helped.",
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    type: "text" as const,
  },
  {
    id: 3,
    sender: { id: "instructor1", name: "Instructor Sofia", image: null },
    content: "Excellent work both of you! Remember to practice the pronunciation daily. Καλή δουλειά! (Good work!)",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    type: "text" as const,
  },
  {
    id: 4,
    sender: { id: "3", name: "Elena P.", image: null },
    content: "I'm having trouble with the Θ (theta) sound. Any tips?",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    type: "text" as const,
  },
];

const mockChannels = [
  { id: null, name: "General", description: "Main discussion channel", memberCount: 24 },
  { id: 1, name: "Beginner Cohort A", description: "Cohort starting January 2024", memberCount: 15 },
  { id: 2, name: "Intermediate Group", description: "For intermediate learners", memberCount: 12 },
];

export default function ChatPage() {
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  // TODO: Replace with real tRPC calls
  // const { data: messages } = api.chat.getMessages.useQuery({ cohortId: selectedChannel });
  // const sendMessageMutation = api.chat.sendMessage.useMutation();

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // TODO: Implement real message sending
    console.log("Sending message:", newMessage);
    setNewMessage("");
  };

  const currentChannel = mockChannels.find(ch => ch.id === selectedChannel) || mockChannels[0]!

  function formatMessageTime(date: Date) {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-amber-900 p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">💬 Study Chat 🍯</h1>
          <p className="text-gray-300">Connect with fellow learners and instructors - sweet conversations await!</p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Sidebar - Channels */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-white">
                  <Hash className="h-4 w-4 text-amber-400" />
                  Channels 🍯
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mockChannels.map((channel) => (
                  <button
                    key={channel.id || 'general'}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedChannel === channel.id
                        ? 'bg-blue-100 border border-blue-200'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{channel.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{channel.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <Users className="h-3 w-3 mr-1" />
                        {channel.memberCount}
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-600">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MessageCircle className="h-5 w-5 text-amber-400" />
                    {currentChannel.name} 💬
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {currentChannel.memberCount} members
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{currentChannel.description}</p>
              </CardHeader>

              {/* Messages Area */}
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {mockMessages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-medium">
                          {message.sender.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{message.sender.name}</span>
                            <span className="text-xs text-gray-500">
                              {formatMessageTime(message.createdAt)}
                            </span>
                            {message.sender.name.includes("Instructor") && (
                              <Badge variant="secondary" className="text-xs">Instructor</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-900">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder={`Message ${currentChannel.name}...`}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button variant="ghost" size="sm" className="px-2">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="px-2">
                        <Image className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button onClick={handleSendMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
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