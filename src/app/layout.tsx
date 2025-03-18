import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });

export const metadata: Metadata = {
  title: "ZenithSolve | Algorithm Practice Problems with Real-World Context",
  description: "Bridging the gap between algorithm practice problems and real-world industry applications with interactive visualizations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
          <div className="min-h-screen flex flex-col bg-light-100 dark:bg-dark-300 transition-colors duration-300">
            {children}
          </div>
      </body>
    </html>
  );
}
