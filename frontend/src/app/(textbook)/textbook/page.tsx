/**
 * Textbook Index Page
 * Landing page for the textbook with chapter overview
 */

import Link from "next/link";
import { Book, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export default function TextbookPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-200 pb-8 dark:border-gray-800">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 dark:bg-blue-950 dark:text-blue-100">
          <Book className="h-4 w-4" />
          Interactive Textbook
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          Physical AI & Humanoid Robotics
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          A comprehensive guide to Physical AI and Humanoid Robotics, enhanced with AI-powered
          Q&A for interactive learning.
        </p>
      </div>

      {/* Chapters Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Table of Contents
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {CHAPTERS.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
          How to Use This Textbook
        </h3>
        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-blue-600 dark:text-blue-400">•</span>
            <span>
              <strong>Read chapters</strong> at your own pace with comprehensive content
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-blue-600 dark:text-blue-400">•</span>
            <span>
              <strong>Ask questions</strong> using the AI chat assistant (bottom right)
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-blue-600 dark:text-blue-400">•</span>
            <span>
              <strong>Highlight text</strong> for context-specific explanations
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-blue-600 dark:text-blue-400">•</span>
            <span>
              <strong>View citations</strong> to verify information sources
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  topics: string[];
}

interface ChapterCardProps {
  chapter: Chapter;
}

function ChapterCard({ chapter }: ChapterCardProps) {
  return (
    <Link
      href={`/textbook/physical-ai-robotics/chapter-${chapter.id}`}
      className="group rounded-lg border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-700"
    >
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="mb-1 text-sm font-medium text-blue-600 dark:text-blue-400">
            Chapter {chapter.id}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {chapter.title}
          </h3>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" />
      </div>

      <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{chapter.description}</p>

      <div className="flex flex-wrap gap-2">
        {chapter.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {topic}
          </span>
        ))}
      </div>
    </Link>
  );
}

// Sample chapters - Replace with actual content
const CHAPTERS: Chapter[] = [
  {
    id: "1",
    title: "Introduction to Physical AI",
    description: "Foundations of Physical AI and its applications in robotics",
    topics: ["AI Fundamentals", "Physical Intelligence", "Applications"],
  },
  {
    id: "2",
    title: "Fundamentals of Humanoid Robotics",
    description: "Core concepts in humanoid robot design and mechanics",
    topics: ["Robot Kinematics", "Actuators", "Sensors"],
  },
  {
    id: "3",
    title: "Perception Systems",
    description: "Vision, sensing, and environmental awareness",
    topics: ["Computer Vision", "Sensor Fusion", "SLAM"],
  },
  {
    id: "4",
    title: "Motion Planning and Control",
    description: "Algorithms for movement and trajectory optimization",
    topics: ["Path Planning", "Control Theory", "Stability"],
  },
  {
    id: "5",
    title: "Learning and Adaptation",
    description: "Machine learning approaches for robotics",
    topics: ["Reinforcement Learning", "Imitation Learning", "Transfer Learning"],
  },
  {
    id: "6",
    title: "Human-Robot Interaction",
    description: "Designing intuitive and safe human-robot interfaces",
    topics: ["HRI Principles", "Safety", "Social Robotics"],
  },
  {
    id: "7",
    title: "Case Studies and Applications",
    description: "Real-world applications and research projects",
    topics: ["Manufacturing", "Healthcare", "Research"],
  },
];
