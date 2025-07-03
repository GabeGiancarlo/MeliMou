import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { BookOpen, Users, Zap, Trophy, Globe, MessageCircle, Star, ArrowRight, CheckCircle } from "lucide-react";

export default async function HomePage() {
  const session = await getServerAuthSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-amber-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Καλώς ήρθατε στο{" "}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
                MeliMou 🍯
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto">
              Master Greek with AI-powered conversations, expert-led cohorts, and personalized learning paths. 
              Join thousands discovering the sweet journey of Greek language learning.
            </p>
            <p className="text-lg text-amber-200 mb-8 font-medium">
              ✨ Where language learning meets the sweetness of honey ✨
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                session.user.hasCompletedOnboarding ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-lg px-8 py-4">
                      🍯 Continue Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/onboarding">
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-lg px-8 py-4">
                      🚀 Complete Setup
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-lg px-8 py-4">
                      🍯 Start Learning Greek
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/subscription">
                    <Button size="lg" variant="outline" className="border-amber-400 text-amber-300 hover:bg-amber-500/10 text-lg px-8 py-4">
                      💎 View Pricing
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {!session && (
              <p className="text-amber-200 mt-4">
                🆓 Free plan available • No credit card required
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose MeliMou? 🍯
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the sweetest Greek learning platform with cutting-edge technology and expert guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-gray-800 border-gray-700 hover:border-amber-500 transition-colors">
            <CardHeader>
              <Zap className="h-12 w-12 text-amber-400 mb-4" />
              <CardTitle className="text-white">🤖 AI-Powered Tutor</CardTitle>
              <CardDescription className="text-gray-300">
                Practice conversations 24/7 with our intelligent AI tutor that adapts to your level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />Natural conversation practice</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />Instant pronunciation feedback</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />Personalized difficulty adjustment</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">👥 Live Cohort Classes</CardTitle>
              <CardDescription className="text-gray-300">
                Learn with peers in instructor-led group sessions for real interaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />Expert Greek instructors</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />Small group sizes (max 8)</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />Flexible scheduling</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-amber-500 transition-colors">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-amber-400 mb-4" />
              <CardTitle className="text-white">📚 Rich Learning Content</CardTitle>
              <CardDescription className="text-gray-300">
                Comprehensive resources from alphabet basics to advanced literature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />Interactive lessons & exercises</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />Cultural context videos</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />Progressive difficulty levels</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition-colors">
            <CardHeader>
              <Trophy className="h-12 w-12 text-yellow-400 mb-4" />
              <CardTitle className="text-white">🏆 Certification Path</CardTitle>
              <CardDescription className="text-gray-300">
                Earn recognized certificates as you progress through your Greek journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-yellow-400 mr-2" />Official completion certificates</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-yellow-400 mr-2" />Progress tracking & analytics</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-yellow-400 mr-2" />Skill-based assessments</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors">
            <CardHeader>
              <Globe className="h-12 w-12 text-purple-400 mb-4" />
              <CardTitle className="text-white">🏛️ Cultural Immersion</CardTitle>
              <CardDescription className="text-gray-300">
                Dive deep into Greek culture, history, and traditions while learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />Greek mythology & history</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />Traditional music & arts</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />Regional dialects & customs</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 hover:border-amber-500 transition-colors">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-amber-400 mb-4" />
              <CardTitle className="text-white">💬 Community Support</CardTitle>
              <CardDescription className="text-gray-300">
                Connect with fellow learners and native speakers in our vibrant community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />Active discussion forums</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />Language exchange partners</li>
                <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />24/7 community support</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Greek Culture Section */}
      <div className="bg-gradient-to-r from-gray-800/50 to-amber-900/20 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Discover Greek Culture 🏛️✨
            </h2>
            <p className="text-xl text-gray-300">
              Language is the gateway to culture. Explore the rich heritage of Greece while you learn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gray-700 border-gray-600 text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🏛️</div>
                <h3 className="text-white font-semibold mb-2">Ancient History</h3>
                <p className="text-gray-300 text-sm">From Socrates to Alexander the Great</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600 text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🍯</div>
                <h3 className="text-white font-semibold mb-2">Culinary Traditions</h3>
                <p className="text-gray-300 text-sm">Mediterranean flavors and recipes</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600 text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="text-white font-semibold mb-2">Arts & Literature</h3>
                <p className="text-gray-300 text-sm">Homer, theater, and modern creativity</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600 text-center">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🏖️</div>
                <h3 className="text-white font-semibold mb-2">Island Life</h3>
                <p className="text-gray-300 text-sm">Santorini, Mykonos, and hidden gems</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing Preview */}
      {!session && (
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Start Learning Today
            </h2>
            <p className="text-xl text-gray-300">
              Choose the plan that fits your learning goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Free</CardTitle>
                <div className="text-3xl font-bold text-white">$0<span className="text-lg text-gray-400">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />3 AI tutor sessions/month</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Basic learning resources</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Community access</li>
                </ul>
                <Link href="/auth/signin">
                  <Button className="w-full bg-gray-700 hover:bg-gray-600">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-purple-500 border-2 relative">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-white">Pro</CardTitle>
                <div className="text-3xl font-bold text-white">$19<span className="text-lg text-gray-400">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />50 AI tutor sessions/month</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Premium resources</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Live cohort classes</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Email support</li>
                </ul>
                <Link href="/auth/signin">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Start Free Trial</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Premium</CardTitle>
                <div className="text-3xl font-bold text-white">$39<span className="text-lg text-gray-400">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Unlimited AI sessions</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />1-on-1 instructor sessions</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Certification path</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-400 mr-2" />Priority support</li>
                </ul>
                <Link href="/auth/signin">
                  <Button className="w-full bg-gray-700 hover:bg-gray-600">Start Free Trial</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Testimonials */}
      <div className="bg-gray-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Our Students Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The AI tutor is incredible! It's like having a patient Greek teacher available 24/7. 
                  I've learned more in 3 months than I did in a year of traditional classes."
                </p>
                <div className="text-white font-semibold">Maria K.</div>
                <div className="text-gray-400 text-sm">Pro subscriber, 6 months</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "The cohort classes are amazing! Learning with other students and having real conversations 
                  in Greek has boosted my confidence tremendously."
                </p>
                <div className="text-white font-semibold">James R.</div>
                <div className="text-gray-400 text-sm">Premium subscriber, 1 year</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">
                  "I love how MeliMou incorporates Greek culture into the lessons. I'm not just learning 
                  the language, I'm understanding the soul of Greece!"
                </p>
                <div className="text-white font-semibold">Sofia L.</div>
                <div className="text-gray-400 text-sm">Free user, 3 months</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Your Greek Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of learners discovering the beauty of Greek language and culture
          </p>
          
          {!session && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-lg px-8 py-4">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/subscription">
                <Button size="lg" variant="outline" className="border-gray-300 text-white hover:bg-gray-800 text-lg px-8 py-4">
                  View All Plans
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
