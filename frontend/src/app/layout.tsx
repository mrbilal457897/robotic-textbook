/**
 * Root Layout
 * Global layout for the entire Next.js application
 */

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Physical AI & Humanoid Robotics - Interactive Textbook",
  description: "Learn Physical AI and Humanoid Robotics with an AI-powered interactive textbook featuring RAG-based Q&A",
  keywords: ["Physical AI", "Humanoid Robotics", "Machine Learning", "Robotics", "AI Textbook"],
  authors: [{ name: "PIAIC Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
