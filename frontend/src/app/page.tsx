/**
 * Homepage
 * Landing page for the interactive textbook
 */

import Link from "next/link";
import { Book, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Book className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold">Physical AI & Humanoid Robotics</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/textbook"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                Textbook
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
              >
                About
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 dark:bg-blue-950 dark:text-blue-100">
            <Sparkles className="h-4 w-4" />
            AI-Powered Interactive Learning
          </div>

          <h2 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
            Learn Physical AI &<br />
            Humanoid Robotics
          </h2>

          <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            An interactive textbook powered by RAG (Retrieval-Augmented Generation) that provides
            instant, citation-backed answers to your questions about Physical AI and Humanoid
            Robotics.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/textbook">
              <Button size="lg" className="w-full sm:w-auto">
                Start Reading
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Book className="h-6 w-6" />}
            title="Interactive Textbook"
            description="Read comprehensive chapters on Physical AI, humanoid robotics, and cutting-edge technologies."
          />
          <FeatureCard
            icon={<MessageCircle className="h-6 w-6" />}
            title="AI-Powered Q&A"
            description="Ask questions and get instant, citation-backed answers grounded in the textbook content."
          />
          <FeatureCard
            icon={<Sparkles className="h-6 w-6" />}
            title="Three Learning Modes"
            description="Book-Only, Selected-Text, and General Knowledge modes for flexible learning."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>© 2026 PIAIC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
