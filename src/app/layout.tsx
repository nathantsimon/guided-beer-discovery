import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/Nav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Guided Beer Discovery",
  description: "We choose, you cheers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Nav />
        <div className="flex-1">{children}</div>
        <footer className="bg-amber-950 text-amber-400 text-xs text-center py-5 px-4">
          © {new Date().getFullYear()} Guided Beer Discovery · We choose, you cheers.
        </footer>
      </body>
    </html>
  );
}
