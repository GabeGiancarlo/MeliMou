"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import { CheckCircle, Zap, Users, BookOpen, Trophy, Shield, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SubscriptionPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const subscriptionPlansQuery = api.subscription.getPlans.useQuery();
  const currentSubscriptionQuery = api.subscription.getCurrentSubscription.useQuery();
  const subscriptionLimitsQuery = api.subscription.getSubscriptionLimits.useQuery();

  const activateSubscriptionMutation = api.subscription.activateSubscription.useMutation({
    onSuccess: () => {
      currentSubscriptionQuery.refetch();
      subscriptionLimitsQuery.refetch();
    },
  });

  const handleSelectPlan = async (planId: number) => {
    if (!session) return;
    
    setIsLoading(true);
    try {
      await activateSubscriptionMutation.mutateAsync({ planId });
    } catch (error) {
      console.error("Error selecting plan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const plans = subscriptionPlansQuery.data || [];
  const currentSubscription = currentSubscriptionQuery.data;
  const limits = subscriptionLimitsQuery.data;

  const getFeatureIcon = (feature: string) => {
    if (feature.includes("AI tutor")) return <Zap className="h-4 w-4 text-purple-400" />;
    if (feature.includes("cohort") || feature.includes("1-on-1")) return <Users className="h-4 w-4 text-blue-400" />;
    if (feature.includes("resources") || feature.includes("content")) return <BookOpen className="h-4 w-4 text-green-400" />;
    if (feature.includes("certification") || feature.includes("advanced")) return <Trophy className="h-4 w-4 text-yellow-400" />;
    if (feature.includes("support") || feature.includes("priority")) return <Shield className="h-4 w-4 text-red-400" />;
    return <CheckCircle className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Greek Learning Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From free basics to premium mastery - find the perfect plan for your Greek language journey
          </p>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Current Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-purple-600 text-white mb-2">
                    {currentSubscription.plan.name}
                  </Badge>
                  <p className="text-gray-300">
                    Valid until {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    ${currentSubscription.plan.price / 100}
                  </p>
                  <p className="text-gray-400">
                    per {currentSubscription.plan.intervalType}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Limits */}
        {limits && (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader>
              <CardTitle className="text-white">Your Usage This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <h3 className="text-white font-medium mb-2">AI Tutor Sessions</h3>
                  <p className="text-2xl font-bold text-purple-400">
                    {limits.limits.maxSessions === -1 ? "Unlimited" : `${limits.limits.maxSessions} left`}
                  </p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Premium Resources</h3>
                  <p className="text-2xl font-bold text-blue-400">
                    {limits.limits.maxResources === -1 ? "Unlimited" : `${limits.limits.maxResources} available`}
                  </p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Current Tier</h3>
                  <Badge className="bg-green-600">
                    {limits.currentTier.charAt(0).toUpperCase() + limits.currentTier.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan.id === plan.id;
            const isPopular = plan.name === "Pro";
            
            return (
              <Card 
                key={plan.id} 
                className={`relative bg-gray-800 border-2 transition-all hover:scale-105 ${
                  isCurrentPlan 
                    ? "border-purple-500 bg-purple-500/10" 
                    : isPopular 
                    ? "border-yellow-500" 
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                {isPopular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black">
                    Most Popular
                  </Badge>
                )}
                {isCurrentPlan && (
                  <Badge className="absolute -top-2 right-4 bg-purple-600">
                    Current Plan
                  </Badge>
                )}
                
                <CardHeader>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-300">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">
                      ${plan.price / 100}
                    </span>
                    <span className="text-gray-400 ml-2">
                      per {plan.intervalType}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {(plan.features as string[]).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        {getFeatureIcon(feature)}
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {!session ? (
                    <Link href="/auth/signin">
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Sign in to get started
                      </Button>
                    </Link>
                  ) : isCurrentPlan ? (
                    <Button disabled className="w-full bg-gray-600">
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleSelectPlan(plan.id)}
                      disabled={isLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {plan.price === 0 ? "Start Free" : "Upgrade Now"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-medium mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-300 text-sm">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">What happens to my progress?</h3>
                <p className="text-gray-300 text-sm">
                  Your learning progress is always saved, regardless of your subscription plan.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Is there a free trial?</h3>
                <p className="text-gray-300 text-sm">
                  Our Free plan lets you try MeliMou with no commitment. Paid plans include a 7-day free trial.
                </p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">How do AI tutor sessions work?</h3>
                <p className="text-gray-300 text-sm">
                  Practice conversations with our AI tutor that adapts to your level and provides instant feedback.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 