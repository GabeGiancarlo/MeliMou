import Link from "next/link";
import { BookOpen, MessageCircle, Bot, Library, Bell, Users } from "lucide-react";

import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#2e026d] via-[#4338ca] to-[#6366f1] dark:from-[#1a0037] dark:via-[#2e1065] dark:to-[#4338ca] py-20 text-white">
          <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
          <div className="container relative mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
                Καλώς ήρθατε στο{" "}
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-300 dark:to-orange-300 bg-clip-text text-transparent">
                  MeliMou
                </span>
              </h1>
              <p className="mb-4 text-xl opacity-90 md:text-2xl">
                Welcome to MeliMou
              </p>
              <p className="mb-8 text-lg opacity-80 md:text-xl">
                Master Greek through personalized lessons, AI tutoring, and interactive community learning
              </p>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-300 dark:to-orange-300 px-8 py-4 text-lg font-semibold text-black transition-transform hover:scale-105 hover:shadow-lg"
                  >
                    Πάμε στο Dashboard! (Go to Dashboard!)
                  </Link>
                ) : (
                  <Link
                    href="/api/auth/signin"
                    className="rounded-lg bg-gradient-to-r from-yellow-400 to-orange-400 dark:from-yellow-300 dark:to-orange-300 px-8 py-4 text-lg font-semibold text-black transition-transform hover:scale-105 hover:shadow-lg"
                  >
                    Ξεκινήστε τώρα! (Start Now!)
                  </Link>
                )}
                <Link
                  href="/learning-paths"
                  className="rounded-lg border-2 border-white/30 dark:border-white/40 bg-white/10 dark:bg-white/5 px-8 py-4 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-white/20 dark:hover:bg-white/10"
                >
                  Explore Learning Paths
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-100">
                Γιατί να επιλέξετε το MeliMou; (Why Choose MeliMou?)
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Everything you need to master the Greek language
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Learning Paths Feature */}
              <div className="group rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:shadow-gray-900/30">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Structured Learning Paths
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  From alphabet basics to advanced conversation, follow our expertly crafted learning paths designed for all levels.
                </p>
                <Link
                  href="/learning-paths"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Explore Paths →
                </Link>
              </div>

              {/* AI Tutor Feature */}
              <div className="group rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:shadow-gray-900/30">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-600 dark:from-green-400 dark:to-teal-500">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  AI Greek Tutor
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Practice with our intelligent tutor that adapts to your formality preference and provides authentic Greek responses.
                </p>
                <Link
                  href="/tutor"
                  className="font-semibold text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                >
                  Start Tutoring →
                </Link>
              </div>

              {/* Community Chat Feature */}
              <div className="group rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:shadow-gray-900/30">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-600 dark:from-pink-400 dark:to-rose-500">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Community Chat
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Connect with fellow learners, practice with native speakers, and get instant help from our community.
                </p>
                <Link
                  href="/chat"
                  className="font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300"
                >
                  Join Chat →
                </Link>
              </div>

              {/* Resource Library Feature */}
              <div className="group rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:shadow-gray-900/30">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-400 dark:to-red-500">
                  <Library className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Resource Library
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Access thousands of Greek resources including grammar guides, vocabulary lists, and cultural content.
                </p>
                <Link
                  href="/resources"
                  className="font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300"
                >
                  Browse Resources →
                </Link>
              </div>

              {/* Cohort Learning Feature */}
              <div className="group rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:shadow-gray-900/30">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Cohort Learning
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Join structured cohorts with guided instruction and peer support for a complete learning experience.
                </p>
                <Link
                  href="/learning-paths"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  Join Cohort →
                </Link>
              </div>

              {/* Smart Notifications Feature */}
              <div className="group rounded-xl bg-white dark:bg-gray-800 p-8 shadow-lg transition-all hover:scale-105 hover:shadow-xl dark:shadow-gray-900/30">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Smart Notifications
                </h3>
                <p className="mb-4 text-gray-600 dark:text-gray-300">
                  Stay motivated with personalized reminders, achievement notifications, and instructor feedback.
                </p>
                <Link
                  href="/alerts"
                  className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300"
                >
                  View Alerts →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Greek Culture Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 dark:from-blue-800 dark:to-purple-900 py-20 text-white">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-6 text-4xl font-bold">
              Μάθετε την ελληνική γλώσσα και τον πολιτισμό
            </h2>
            <p className="mb-2 text-xl opacity-90">
              Learn the Greek language and culture
            </p>
            <p className="mb-8 text-lg opacity-80">
              Immerse yourself in the rich heritage of Greece while mastering one of the world's oldest languages. 
              From ancient philosophy to modern conversations, discover the beauty of Greek.
            </p>
            
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white/10 dark:bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/20 dark:hover:bg-white/10">
                <div className="mb-4 text-4xl">🏛️</div>
                <h3 className="mb-2 text-xl font-semibold">Ancient Heritage</h3>
                <p className="text-sm opacity-80">
                  Learn about Greek mythology, philosophy, and history
                </p>
              </div>
              
              <div className="rounded-lg bg-white/10 dark:bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/20 dark:hover:bg-white/10">
                <div className="mb-4 text-4xl">🍯</div>
                <h3 className="mb-2 text-xl font-semibold">Modern Culture</h3>
                <p className="text-sm opacity-80">
                  Discover contemporary Greek life, cuisine, and traditions
                </p>
              </div>
              
              <div className="rounded-lg bg-white/10 dark:bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/20 dark:hover:bg-white/10">
                <div className="mb-4 text-4xl">🌊</div>
                <h3 className="mb-2 text-xl font-semibold">Island Adventures</h3>
                <p className="text-sm opacity-80">
                  Prepare for your Greek island travels with practical language skills
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-50 dark:bg-gray-900 py-20">
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-6 text-4xl font-bold text-gray-800 dark:text-gray-100">
              Ετοιμοι να ξεκινήσετε; (Ready to begin?)
            </h2>
            <p className="mb-8 text-xl text-gray-600 dark:text-gray-300">
              Join thousands of learners discovering the joy of Greek language and culture
            </p>
            
            {session ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-700 dark:text-gray-300">
                  Welcome back, <span className="font-semibold">{session.user?.name}</span>!
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block rounded-lg bg-gradient-to-r from-[#2e026d] to-[#4338ca] dark:from-[#4338ca] dark:to-[#6366f1] px-8 py-4 text-lg font-semibold text-white transition-transform hover:scale-105 hover:shadow-lg"
                >
                  Continue Your Journey
                </Link>
              </div>
            ) : (
              <Link
                href="/api/auth/signin"
                className="inline-block rounded-lg bg-gradient-to-r from-[#2e026d] to-[#4338ca] dark:from-[#4338ca] dark:to-[#6366f1] px-8 py-4 text-lg font-semibold text-white transition-transform hover:scale-105 hover:shadow-lg"
              >
                Start Learning Greek Today
              </Link>
            )}
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
