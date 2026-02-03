/**
 * Chapter Page
 * Dynamic page for displaying textbook chapters
 */

import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChapterContent } from "@/components/textbook/ChapterContent";

interface ChapterPageProps {
  params: {
    book: string;
    chapter: string;
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { book, chapter } = params;

  // Extract chapter ID from "chapter-1" format
  const chapterId = chapter.replace("chapter-", "");

  // Get chapter data (in production, this would fetch from a database or CMS)
  const chapterData = await getChapterData(book, chapterId);

  if (!chapterData) {
    notFound();
  }

  return (
    <ChapterContent bookId={book} chapterId={chapterId}>
      <article className="space-y-8">
        {/* Chapter Header */}
        <header className="border-b border-gray-200 pb-6 dark:border-gray-800">
        <div className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
          Chapter {chapterData.id}
        </div>
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">
          {chapterData.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {chapterData.description}
        </p>

        {/* Chapter Metadata */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>
            <span className="font-medium">Reading time:</span> {chapterData.readingTime}
          </div>
          <div>
            <span className="font-medium">Topics:</span> {chapterData.topics.join(", ")}
          </div>
        </div>
      </header>

      {/* Learning Objectives */}
      {chapterData.objectives && chapterData.objectives.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-900 dark:bg-blue-950/20">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Learning Objectives
          </h2>
          <ul className="space-y-2">
            {chapterData.objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="mt-1 text-blue-600 dark:text-blue-400">✓</span>
                <span>{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chapter Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {chapterData.content}
        </ReactMarkdown>
      </div>

      {/* Chapter Summary */}
      {chapterData.summary && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Chapter Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{chapterData.summary}</p>
        </div>
      )}

      {/* Key Takeaways */}
      {chapterData.keyTakeaways && chapterData.keyTakeaways.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950/20">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Key Takeaways
          </h2>
          <ul className="space-y-2">
            {chapterData.keyTakeaways.map((takeaway, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                <span className="mt-1 text-green-600 dark:text-green-400">→</span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Further Reading */}
      {chapterData.furtherReading && chapterData.furtherReading.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Further Reading
          </h2>
          <ul className="space-y-2">
            {chapterData.furtherReading.map((item, index) => (
              <li key={index} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      </article>
    </ChapterContent>
  );
}

// Sample data fetching function
async function getChapterData(bookId: string, chapterId: string) {
  // In production, this would fetch from a database, CMS, or API
  // For now, return sample data

  const chapters: Record<string, any> = {
    "1": {
      id: "1",
      title: "Introduction to Physical AI",
      description: "Understanding the fundamentals of Physical AI and its role in robotics",
      readingTime: "15 minutes",
      topics: ["AI Fundamentals", "Physical Intelligence", "Applications"],
      objectives: [
        "Understand what Physical AI is and how it differs from traditional AI",
        "Learn about the key components of Physical AI systems",
        "Explore real-world applications of Physical AI in robotics",
      ],
      content: `# Introduction to Physical AI

## What is Physical AI?

Physical AI represents the intersection of artificial intelligence and the physical world. Unlike traditional AI systems that operate purely in digital spaces, Physical AI enables machines to perceive, reason about, and interact with the real world.

### Key Characteristics

Physical AI systems possess three fundamental capabilities:

1. **Perception**: The ability to sense and understand the physical environment
2. **Reasoning**: Processing sensory data to make informed decisions
3. **Action**: Executing physical movements and manipulations

## Applications in Robotics

Physical AI has transformed modern robotics, enabling:

- **Autonomous Navigation**: Robots that can navigate complex environments
- **Object Manipulation**: Precise handling and assembly tasks
- **Human Interaction**: Natural and safe collaboration with humans

### Case Study: Humanoid Robots

Humanoid robots represent one of the most challenging applications of Physical AI. They require:

- Real-time balance and stability control
- Complex motion planning for bipedal locomotion
- Advanced perception for safe human interaction

## The Future of Physical AI

As Physical AI continues to evolve, we can expect to see:

- More adaptive and learning-capable robots
- Better integration with human environments
- Increased safety and reliability in physical interactions

> "Physical AI is not just about making robots smarter—it's about making them truly capable of operating in the real world." - Dr. Jane Smith, Robotics Researcher`,
      summary: "This chapter introduced the concept of Physical AI, exploring its key characteristics of perception, reasoning, and action. We examined how Physical AI enables robots to interact with the physical world and discussed its applications in modern robotics, particularly in humanoid robots.",
      keyTakeaways: [
        "Physical AI bridges the gap between digital intelligence and physical interaction",
        "The three pillars of Physical AI are perception, reasoning, and action",
        "Humanoid robots are one of the most complex applications of Physical AI",
        "The field is rapidly evolving toward more adaptive and capable systems",
      ],
      furtherReading: [
        {
          title: "Physical Intelligence in Robotics (Research Paper)",
          url: "https://example.com/paper1",
        },
        {
          title: "The Future of Humanoid Robots",
          url: "https://example.com/paper2",
        },
      ],
    },
    // Add more chapters as needed
  };

  return chapters[chapterId] || null;
}
