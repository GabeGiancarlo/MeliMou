"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Bell, CheckCircle, AlertTriangle, Info, Star } from "lucide-react";

// Mock data for alerts
const mockAlerts = [
  {
    id: 1,
    title: "New Lesson Available: Greek Mythology",
    content: "Explore the fascinating world of Greek mythology with our latest lesson featuring gods, heroes, and epic tales.",
    type: "instructor" as const,
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    createdBy: { name: "Instructor Maria" }
  },
  {
    id: 2,
    title: "7-Day Streak Achievement!",
    content: "Congratulations! You've completed lessons for 7 consecutive days. Keep up the excellent work!",
    type: "achievement" as const,
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    createdBy: { name: "System" }
  },
  {
    id: 3,
    title: "Weekly Challenge: Pronunciation Practice",
    content: "This week's challenge focuses on mastering the Greek 'R' sound. Practice daily for best results!",
    type: "system" as const,
    isRead: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdBy: { name: "System" }
  },
  {
    id: 4,
    title: "Cohort Meeting Tomorrow",
    content: "Don't forget about our cohort meeting tomorrow at 7 PM EST. We'll be reviewing lessons 8-10.",
    type: "instructor" as const,
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdBy: { name: "Instructor Sofia" }
  },
];

export default function AlertsPage() {
  const unreadCount = mockAlerts.filter(alert => !alert.isRead).length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Star className="h-5 w-5 text-yellow-400" />;
      case 'instructor':
        return <Info className="h-5 w-5 text-yellow-400" />;
      case 'system':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getAlertBadgeColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'default';
      case 'instructor':
        return 'secondary';
      case 'system':
        return 'outline';
      default:
        return 'outline';
    }
  };

  function formatTime(date: Date) {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `${minutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    }
  }

  const handleMarkAsRead = (alertId: number) => {
    // TODO: Implement with tRPC mutation
    console.log("Marking alert as read:", alertId);
  };

  const handleMarkAllAsRead = () => {
    // TODO: Implement with tRPC mutation
    console.log("Marking all alerts as read");
  };

  return (
    <div className="min-h-screen honey-bg p-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">🍯 Alerts & Notifications</h1>
              <p className="text-gray-300">Stay updated with your learning progress and announcements</p>
            </div>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="outline" className="honey-button">
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark All as Read ({unreadCount})
              </Button>
            )}
          </div>
        </header>

        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <Card key={alert.id} className={`honey-card transition-all hover:shadow-lg hover:shadow-yellow-500/20 ${
              !alert.isRead ? 'honey-border border-l-4' : ''
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white">{alert.title}</h3>
                          {!alert.isRead && (
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-gray-300 mb-3">{alert.content}</p>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <Badge variant={getAlertBadgeColor(alert.type)}>
                            {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                          </Badge>
                          <span>{alert.createdBy.name}</span>
                          <span>•</span>
                          <span>{formatTime(alert.createdAt)}</span>
                        </div>
                      </div>

                      {!alert.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="flex-shrink-0 hover:bg-yellow-500/20 hover:text-yellow-400"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {mockAlerts.length === 0 && (
          <Card className="honey-card">
            <CardContent className="p-12 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No alerts yet</h3>
              <p className="text-gray-300">You'll see notifications and announcements here when they arrive.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 