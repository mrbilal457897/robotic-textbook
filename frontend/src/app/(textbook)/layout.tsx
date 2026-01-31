/**
 * Textbook Layout
 * Layout for textbook reading pages with integrated ChatPanel
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, Menu, X, Home, ChevronRight } from "lucide-react";
import { ChatPanel } from "../../components/chat/ChatPanel";
import { cn } from "../../lib/utils";

export default function TextbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Extract book and chapter from pathname
  const pathParts = pathname?.split("/").filter(Boolean) || [];
  const bookId = pathParts[1] || "physical-ai-robotics";
  const chapterId = pathParts[2]?.replace("chapter-", "") || undefined;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Book className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="hidden font-semibold sm:inline-block">
              Physical AI & Humanoid Robotics
            </span>
          </Link>
        </div>

        {/* Breadcrumbs */}
        <nav className="hidden items-center gap-2 text-sm text-gray-600 dark:text-gray-400 md:flex">
          <Link href="/" className="hover:text-gray-900 dark:hover:text-gray-100">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/textbook" className="hover:text-gray-900 dark:hover:text-gray-100">
            Textbook
          </Link>
          {chapterId && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-gray-900 dark:text-gray-100">Chapter {chapterId}</span>
            </>
          )}
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
            "absolute inset-y-0 left-0 z-40 mt-16 lg:relative lg:mt-0 lg:z-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            "transition-transform duration-200 ease-in-out"
          )}
        >
          <nav className="space-y-1 p-4">
            <h2 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Table of Contents
            </h2>

            {/* Chapter Links - Replace with actual chapters */}
            {CHAPTERS.map((chapter) => (
              <Link
                key={chapter.id}
                href={`/textbook/${bookId}/chapter-${chapter.id}`}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  chapterId === chapter.id
                    ? "bg-blue-50 text-blue-900 dark:bg-blue-950 dark:text-blue-100"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                )}
              >
                <div className="font-semibold">Chapter {chapter.id}</div>
                <div className="text-xs opacity-75">{chapter.title}</div>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Integrated ChatPanel */}
      <ChatPanel
        bookId={bookId}
        chapter={chapterId}
        defaultOpen={false}
      />
    </div>
  );
}

// Sample chapters - Replace with actual data
const CHAPTERS = [
  { id: "1", title: "Introduction to Physical AI" },
  { id: "2", title: "Fundamentals of Humanoid Robotics" },
  { id: "3", title: "Perception Systems" },
  { id: "4", title: "Motion Planning and Control" },
  { id: "5", title: "Learning and Adaptation" },
  { id: "6", title: "Human-Robot Interaction" },
  { id: "7", title: "Case Studies and Applications" },
];
