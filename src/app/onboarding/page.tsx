"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Checkbox } from "~/components/ui/checkbox";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import { api } from "~/trpc/react";
import { Loader2, CheckCircle, ArrowRight, ArrowLeft, Users, BookOpen, Zap } from "lucide-react";

type OnboardingStep = "welcome" | "role" | "level" | "goals" | "schedule" | "interests" | "background" | "subscription" | "complete";

interface OnboardingData {
  role: "student" | "instructor";
  greekLevel: "absolute_beginner" | "beginner" | "elementary" | "intermediate" | "advanced" | "native";
  learningGoals: string[];
  studyTimePerWeek: number;
  previousExperience: string;
  interests: string[];
  howHeardAboutUs: string;
  wantsPracticeTest: boolean;
  formalityPreference: "informal" | "formal" | "mixed";
}

const LEARNING_GOALS = [
  "Traveling to Greece",
  "Speaking with family/friends",
  "Academic study",
  "Business/Professional",
  "Cultural interest",
  "Religious purposes",
  "Personal challenge",
  "Living in Greece"
];

const INTERESTS = [
  "Greek History",
  "Greek Mythology",
  "Greek Music",
  "Greek Literature",
  "Greek Food & Culture",
  "Orthodox Christianity",
  "Ancient Greek",
  "Modern Greek Poetry",
  "Greek Cinema",
  "Greek Philosophy"
];

const HOW_HEARD_OPTIONS = [
  "Search Engine (Google, etc.)",
  "Social Media",
  "Friend/Family Recommendation",
  "Greek Community/Organization",
  "Educational Institution",
  "Online Advertisement",
  "Blog/Article",
  "Other"
];

const SUBSCRIPTION_PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    interval: "forever",
    description: "Perfect for getting started",
    features: [
      "3 AI tutor sessions per month",
      "Basic learning resources",
      "Community access",
      "Progress tracking"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    interval: "month",
    description: "For serious learners",
    features: [
      "50 AI tutor sessions per month",
      "Premium learning resources",
      "Live cohort classes",
      "Personalized study plans",
      "Email support"
    ],
    popular: true
  },
  {
    id: "premium",
    name: "Premium",
    price: 39,
    interval: "month",
    description: "Complete Greek mastery",
    features: [
      "Unlimited AI tutor sessions",
      "All premium content",
      "1-on-1 instructor sessions",
      "Priority support",
      "Certification path"
    ]
  }
];

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [selectedPlan, setSelectedPlan] = useState<string>("free");

  const completeOnboardingMutation = api.user.completeOnboarding.useMutation({
    onSuccess: () => {
      setCurrentStep("complete");
    },
  });

  const subscriptionPlansQuery = api.subscription.getPlans.useQuery();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const steps: OnboardingStep[] = ["welcome", "role", "level", "goals", "schedule", "interests", "background", "subscription", "complete"];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]!);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]!);
    }
  };

  const handleComplete = async () => {
    if (!onboardingData.role || !onboardingData.greekLevel || !onboardingData.learningGoals?.length) {
      return;
    }

    try {
      await completeOnboardingMutation.mutateAsync({
        role: onboardingData.role,
        greekLevel: onboardingData.greekLevel,
        learningGoals: onboardingData.learningGoals,
        studyTimePerWeek: onboardingData.studyTimePerWeek || 5,
        previousExperience: onboardingData.previousExperience || "",
        interests: onboardingData.interests || [],
        howHeardAboutUs: onboardingData.howHeardAboutUs || "",
        wantsPracticeTest: onboardingData.wantsPracticeTest || false,
        formalityPreference: onboardingData.formalityPreference || "mixed",
      });
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };

  const handleStartLearning = () => {
    router.push("/dashboard");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "welcome":
        return (
          <Card className="honey-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-white mb-4">
                Καλώς ήρθατε! Welcome to MeliMou! 🇬🇷
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Let's personalize your Greek learning journey. This will take just a few minutes.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-white font-medium">Personalized Learning</h3>
                  <p className="text-gray-400 text-sm">Tailored to your goals and level</p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <BookOpen className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-white font-medium">Rich Content</h3>
                  <p className="text-gray-400 text-sm">Interactive lessons and resources</p>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <Zap className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="text-white font-medium">AI-Powered Tutor</h3>
                  <p className="text-gray-400 text-sm">Practice conversation anytime</p>
                </div>
              </div>
              <Button onClick={handleNext} size="lg" className="bg-purple-600 hover:bg-purple-700">
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );

      case "role":
        return (
          <Card className="honey-card">
            <CardHeader>
              <CardTitle className="text-white">What brings you to MeliMou?</CardTitle>
              <CardDescription className="text-gray-300">
                This helps us customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={onboardingData.role}
                onValueChange={(value) => setOnboardingData({...onboardingData, role: value as "student" | "instructor"})}
              >
                <div className="flex items-center space-x-2 p-4 border border-gray-600 rounded-lg hover:border-purple-500 transition-colors">
                  <RadioGroupItem value="student" id="student" />
                  <label htmlFor="student" className="flex-1 cursor-pointer">
                    <div className="text-white font-medium">I'm here to learn Greek</div>
                    <div className="text-gray-400 text-sm">Student learner looking to master Greek</div>
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-4 border border-gray-600 rounded-lg hover:border-purple-500 transition-colors">
                  <RadioGroupItem value="instructor" id="instructor" />
                  <label htmlFor="instructor" className="flex-1 cursor-pointer">
                    <div className="text-white font-medium">I'm here to teach Greek</div>
                    <div className="text-gray-400 text-sm">Instructor wanting to create and share content</div>
                  </label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        );

      case "level":
        return (
          <Card className="honey-card">
            <CardHeader>
              <CardTitle className="text-white">What's your current Greek level?</CardTitle>
              <CardDescription className="text-gray-300">
                Be honest - we'll help you grow from wherever you are!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={onboardingData.greekLevel}
                onValueChange={(value) => setOnboardingData({...onboardingData, greekLevel: value as any})}
              >
                {[
                  { value: "absolute_beginner", label: "Absolute Beginner", desc: "Never studied Greek before" },
                  { value: "beginner", label: "Beginner", desc: "Know the alphabet and basic words" },
                  { value: "elementary", label: "Elementary", desc: "Can form simple sentences" },
                  { value: "intermediate", label: "Intermediate", desc: "Can have basic conversations" },
                  { value: "advanced", label: "Advanced", desc: "Comfortable with complex topics" },
                  { value: "native", label: "Native/Near-Native", desc: "Fluent speaker" },
                ].map((level) => (
                  <div key={level.value} className="flex items-center space-x-2 p-4 border border-gray-600 rounded-lg hover:border-purple-500 transition-colors">
                    <RadioGroupItem value={level.value} id={level.value} />
                    <label htmlFor={level.value} className="flex-1 cursor-pointer">
                      <div className="text-white font-medium">{level.label}</div>
                      <div className="text-gray-400 text-sm">{level.desc}</div>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        );

      case "goals":
        return (
          <Card className="honey-card">
            <CardHeader>
              <CardTitle className="text-white">What are your learning goals?</CardTitle>
              <CardDescription className="text-gray-300">
                Select all that apply - this helps us personalize your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LEARNING_GOALS.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg hover:border-purple-500 transition-colors">
                    <Checkbox
                      id={goal}
                      checked={onboardingData.learningGoals?.includes(goal)}
                      onCheckedChange={(checked) => {
                        const goals = onboardingData.learningGoals || [];
                        if (checked) {
                          setOnboardingData({...onboardingData, learningGoals: [...goals, goal]});
                        } else {
                          setOnboardingData({...onboardingData, learningGoals: goals.filter(g => g !== goal)});
                        }
                      }}
                    />
                    <label htmlFor={goal} className="text-white cursor-pointer flex-1">
                      {goal}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "schedule":
        return (
          <Card className="honey-card">
            <CardHeader>
              <CardTitle className="text-white">How much time can you dedicate to learning?</CardTitle>
              <CardDescription className="text-gray-300">
                Hours per week - we'll help you make the most of your time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="study-time" className="text-white">Study time per week</Label>
                  <Input
                    id="study-time"
                    type="number"
                    min="1"
                    max="50"
                    value={onboardingData.studyTimePerWeek || 5}
                    onChange={(e) => setOnboardingData({...onboardingData, studyTimePerWeek: parseInt(e.target.value)})}
                    className="bg-gray-700 border-gray-600 text-white mt-2"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="practice-test"
                    checked={onboardingData.wantsPracticeTest}
                    onCheckedChange={(checked) => setOnboardingData({...onboardingData, wantsPracticeTest: checked as boolean})}
                  />
                  <label htmlFor="practice-test" className="text-white cursor-pointer">
                    I'd like to take a placement test to assess my level
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "interests":
        return (
          <Card className="honey-card">
            <CardHeader>
              <CardTitle className="text-white">What aspects of Greek culture interest you?</CardTitle>
              <CardDescription className="text-gray-300">
                We'll recommend relevant content based on your interests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {INTERESTS.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg hover:border-purple-500 transition-colors">
                    <Checkbox
                      id={interest}
                      checked={onboardingData.interests?.includes(interest)}
                      onCheckedChange={(checked) => {
                        const interests = onboardingData.interests || [];
                        if (checked) {
                          setOnboardingData({...onboardingData, interests: [...interests, interest]});
                        } else {
                          setOnboardingData({...onboardingData, interests: interests.filter(i => i !== interest)});
                        }
                      }}
                    />
                    <label htmlFor={interest} className="text-white cursor-pointer flex-1">
                      {interest}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );

      case "background":
        return (
          <Card className="honey-card">
            <CardHeader>
              <CardTitle className="text-white">Tell us a bit more</CardTitle>
              <CardDescription className="text-gray-300">
                This helps us understand your background and motivations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="previous-experience" className="text-white">
                  Previous Greek learning experience (optional)
                </Label>
                <Textarea
                  id="previous-experience"
                  placeholder="E.g., Took classes in college, learned from family, studied abroad..."
                  value={onboardingData.previousExperience || ""}
                  onChange={(e) => setOnboardingData({...onboardingData, previousExperience: e.target.value})}
                  className="bg-gray-700 border-gray-600 text-white mt-2"
                />
              </div>
              <div>
                <Label htmlFor="how-heard" className="text-white">
                  How did you hear about MeliMou?
                </Label>
                <RadioGroup
                  value={onboardingData.howHeardAboutUs}
                  onValueChange={(value) => setOnboardingData({...onboardingData, howHeardAboutUs: value})}
                  className="mt-2"
                >
                  {HOW_HEARD_OPTIONS.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={option} />
                      <label htmlFor={option} className="text-white cursor-pointer text-sm">
                        {option}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="text-white">Preferred conversation style</Label>
                <RadioGroup
                  value={onboardingData.formalityPreference}
                  onValueChange={(value) => setOnboardingData({...onboardingData, formalityPreference: value as any})}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="informal" id="informal" />
                    <label htmlFor="informal" className="text-white cursor-pointer">
                      Informal (friends, family)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="formal" id="formal" />
                    <label htmlFor="formal" className="text-white cursor-pointer">
                      Formal (business, academic)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mixed" id="mixed" />
                    <label htmlFor="mixed" className="text-white cursor-pointer">
                      Mixed (both styles)
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        );

      case "subscription":
        return (
          <Card className="honey-card">
            <CardHeader>
              <CardTitle className="text-white">Choose your learning plan</CardTitle>
              <CardDescription className="text-gray-300">
                You can always upgrade or change your plan later. Start with our free option!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SUBSCRIPTION_PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-4 bg-purple-600">
                        Most Popular
                      </Badge>
                    )}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400">/{plan.interval}</span>
                      </div>
                      <p className="text-gray-300 text-sm mb-4">{plan.description}</p>
                      <ul className="space-y-2 text-sm text-gray-400">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-gray-700/50 rounded-lg">
                <p className="text-gray-300 text-sm">
                  ✨ <strong>No commitment required!</strong> Start with the free plan and upgrade anytime. 
                  All paid plans include a 7-day free trial.
                </p>
              </div>
            </CardContent>
          </Card>
        );

      case "complete":
        return (
          <Card className="honey-card">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl text-white mb-4">
                Συγχαρητήρια! You're all set! 🎉
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Your Greek learning journey starts now. We've personalized everything based on your preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Your Level</h3>
                  <Badge variant="secondary">{onboardingData.greekLevel?.replace('_', ' ')}</Badge>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Weekly Goal</h3>
                  <Badge variant="secondary">{onboardingData.studyTimePerWeek} hours</Badge>
                </div>
              </div>
              <Button onClick={handleStartLearning} size="lg" className="bg-purple-600 hover:bg-purple-700">
                Start Learning <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {currentStep !== "welcome" && currentStep !== "complete" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">Set up your profile</h1>
              <span className="text-gray-300">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {renderStepContent()}

        {currentStep !== "welcome" && currentStep !== "complete" && (
          <div className="flex justify-between mt-6">
            <Button
              onClick={handlePrevious}
              variant="outline"
              disabled={currentStepIndex === 0}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {currentStep === "subscription" ? (
              <Button
                onClick={handleComplete}
                disabled={completeOnboardingMutation.isLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {completeOnboardingMutation.isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Complete Setup
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === "role" && !onboardingData.role) ||
                  (currentStep === "level" && !onboardingData.greekLevel) ||
                  (currentStep === "goals" && !onboardingData.learningGoals?.length)
                }
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 