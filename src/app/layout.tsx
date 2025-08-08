import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/sonner";
// @ts-expect-error - ViewTransition is not a valid React component
import { unstable_ViewTransition as ViewTransition } from "react";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Idle Chat",
  description: "Your AI assistant for all your needs.",
  applicationName: "Idle",
  authors: [
    {
      name: "Alfonso Chavarro",
      url: "https://alfonso-portafolio.vercel.app/"
    }
  ],
  generator: "Next.js",
  creator: "Alfonso Chavarro",
  publisher: "Alfonso Chavarro",
  keywords: ["AI", "Assistant", "Idle", "Copilot", "Copywriting", "Copywriting Assistant", "Copywriting Copilot", "Copywriting Assistant", "Copywriting Copilot", "Yoda", "Socrates Agent", "N8N Agent"],
  robots: "index, follow",
  openGraph: {
    title: "Idle",
    description: "Your AI assistant for all your needs.",
    siteName: "Idle",
    locale: "en_US",
    type: "website"
  }
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <Navbar />
        <ViewTransition>
          <main className="overflow-hidden">
            {children}
          </main>
        </ViewTransition>
        <Toaster />
      </body>
    </html>
  );
}
