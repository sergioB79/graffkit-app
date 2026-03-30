import type { Metadata } from "next";
import { Bebas_Neue, Space_Mono } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "GRAFFKIT.",
  description: "Turn any tag into a graffiti-ready mural without writing prompts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-concrete text-ink">{children}</body>
    </html>
  );
}
