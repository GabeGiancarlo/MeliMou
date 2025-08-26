import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { BookOpen, Users, Zap, Trophy, Globe, MessageCircle, Star, ArrowRight, CheckCircle } from "lucide-react";

export default async function HomePage() {
  const session = await getServerAuthSession();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Καλώς ήρθατε στο{" "}
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
                MeliMou 🍯
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4 max-w-3xl mx-auto">
              Master Greek with AI-powered conversations, expert-led cohorts, and personalized learning paths. 
              Join thousands discovering the sweet journey of Greek language learning.
            </p>
            <p className="text-lg text-amber-300 mb-8 font-medium">
              ✨ Where language learning meets the sweetness of honey ✨
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {session ? (
                session.user.hasCompletedOnboarding ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg px-8 py-4 shadow-lg">
                      🍯 Continue Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/onboarding">
                    <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-lg px-8 py-4 shadow-lg">
                      🚀 Complete Setup
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-lg px-8 py-4 shadow-lg">
                      🍯 Start Learning Greek
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/subscription">
                    <Button size="lg" variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-500/20 text-lg px-8 py-4">
                      💎 View Pricing
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {!session && (
              <p className="text-amber-300 mt-4">
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
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Experience the sweetest Greek learning platform with cutting-edge technology and expert guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <Link href="/tutor" className="block transition-transform hover:scale-105">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-purple-500/30 hover:border-purple-400 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">🤖 AI-Powered Tutor</CardTitle>
                <CardDescription className="text-blue-100">
                  Practice conversations 24/7 with our intelligent AI tutor that adapts to your level
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />Natural conversation practice</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />Instant pronunciation feedback</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-purple-400 mr-2" />Personalized difficulty adjustment</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

           <Link href="/learning-paths" className="block transition-transform hover:scale-105">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-blue-500/30 hover:border-blue-400 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">👥 Live Cohort Classes</CardTitle>
                <CardDescription className="text-blue-100">
                  Learn with peers in instructor-led group sessions for real interaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-2" />Expert Greek instructors</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-2" />Small group sizes (max 8)</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-blue-400 mr-2" />Flexible scheduling</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

           <Link href="/resources" className="block transition-transform hover:scale-105">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-amber-500/30 hover:border-amber-400 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">📚 Rich Learning Content</CardTitle>
                <CardDescription className="text-blue-100">
                  Comprehensive resources from alphabet basics to advanced literature
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />Interactive lessons & exercises</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />Cultural context videos</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-amber-400 mr-2" />Progressive difficulty levels</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

           <Link href="/certification" className="block transition-transform hover:scale-105">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">🏆 Certification Path</CardTitle>
                <CardDescription className="text-blue-100">
                  Earn recognized certificates as you progress through your Greek journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Official completion certificates</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Progress tracking & analytics</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Skill-based assessments</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

           <Link href="/culture" className="block transition-transform hover:scale-105">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-indigo-500/30 hover:border-indigo-400 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">🏛️ Cultural Immersion</CardTitle>
                <CardDescription className="text-blue-100">
                  Dive deep into Greek culture, history, and traditions while learning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-indigo-400 mr-2" />Greek mythology & history</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-indigo-400 mr-2" />Traditional music & arts</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-indigo-400 mr-2" />Regional dialects & customs</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

           <Link href="/chat" className="block transition-transform hover:scale-105">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-pink-500/30 hover:border-pink-400 transition-all duration-300 cursor-pointer h-full backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">💬 Community Support</CardTitle>
                <CardDescription className="text-blue-100">
                  Connect with fellow learners and native speakers in our vibrant community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-400 mr-2" />Active discussion forums</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-400 mr-2" />Language exchange partners</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-pink-400 mr-2" />24/7 community support</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Greek Culture Section */}
      <div className="bg-gradient-to-r from-slate-800/50 via-purple-900/30 to-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Discover Greek Culture 🏛️✨
            </h2>
            <p className="text-xl text-blue-100">
              Language is the gateway to culture. Explore the rich heritage of Greece while you learn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-purple-500/20 text-center backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🏛️</div>
                <h3 className="text-white font-semibold mb-2">Ancient History</h3>
                <p className="text-blue-100 text-sm">From Socrates to Alexander the Great</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-amber-500/20 text-center backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🍯</div>
                <h3 className="text-white font-semibold mb-2">Culinary Traditions</h3>
                <p className="text-blue-100 text-sm">Mediterranean flavors and recipes</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-blue-500/20 text-center backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="text-white font-semibold mb-2">Arts & Literature</h3>
                <p className="text-blue-100 text-sm">Homer, theater, and modern creativity</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-emerald-500/20 text-center backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">🏖️</div>
                <h3 className="text-white font-semibold mb-2">Island Life</h3>
                <p className="text-blue-100 text-sm">Santorini, Mykonos, and hidden gems</p>
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
            <p className="text-xl text-blue-100">
              Choose the plan that fits your learning goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-600/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Free</CardTitle>
                <div className="text-3xl font-bold text-white">$0<span className="text-lg text-blue-300">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-100 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />3 AI tutor sessions/month</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Basic learning resources</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Community access</li>
                </ul>
                <Link href="/auth/signin">
                  <Button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-800/80 to-purple-900/80 border-purple-500 border-2 relative backdrop-blur-sm">
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500">
                Most Popular
              </Badge>
              <CardHeader>
                <CardTitle className="text-white">Pro</CardTitle>
                <div className="text-3xl font-bold text-white">$19<span className="text-lg text-blue-300">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-100 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />50 AI tutor sessions/month</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Premium resources</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Live cohort classes</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Email support</li>
                </ul>
                <Link href="/auth/signin">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">Start Free Trial</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-amber-500/30 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Premium</CardTitle>
                <div className="text-3xl font-bold text-white">$39<span className="text-lg text-blue-300">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-blue-100 mb-6">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Unlimited AI sessions</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />1-on-1 instructor sessions</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Certification path</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-emerald-400 mr-2" />Priority support</li>
                </ul>
                <Link href="/auth/signin">
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">Start Free Trial</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-slate-800/50 via-purple-900/20 to-slate-800/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              What Our Students Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-blue-100 mb-4">
                  "The AI tutor is incredible! It's like having a patient Greek teacher available 24/7. 
                  I've learned more in 3 months than I did in a year of traditional classes."
                </p>
                <div className="text-white font-semibold">Maria K.</div>
                <div className="text-blue-300 text-sm">Pro subscriber, 6 months</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-blue-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-blue-100 mb-4">
                  "The cohort classes are amazing! Learning with other students and having real conversations 
                  in Greek has boosted my confidence tremendously."
                </p>
                <div className="text-white font-semibold">James R.</div>
                <div className="text-blue-300 text-sm">Premium subscriber, 1 year</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border-amber-500/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-blue-100 mb-4">
                  "I love how MeliMou incorporates Greek culture into the lessons. I'm not just learning 
                  the language, I'm understanding the soul of Greece!"
                </p>
                <div className="text-white font-semibold">Sofia L.</div>
                <div className="text-blue-300 text-sm">Free user, 3 months</div>
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
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of learners discovering the beauty of Greek language and culture
          </p>
          
          {!session && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-lg px-8 py-4 shadow-lg">
                  Start Learning Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/subscription">
                <Button size="lg" variant="outline" className="border-blue-400 text-blue-300 hover:bg-blue-500/20 text-lg px-8 py-4">
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
