import { type Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { FluidCursor } from "@/components/FluidCursor";
import { AuthGuard } from "@/components/AuthGuard";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ASCEND | Elite Roadmap Competition",
  description: "A minimalist competitive roadmap platform for a private AI/ML learning group.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${orbitron.variable} ${spaceGrotesk.variable} antialiased min-h-screen`}
      >
        <AuthGuard>
          <FluidCursor />
          <div className="shifting-bg" />
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
