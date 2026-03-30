import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-concrete text-ink">{children}</body>
    </html>
  );
}
