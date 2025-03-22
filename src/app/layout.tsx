import "./globals.css";
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

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
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: "!bg-white dark:!bg-slate-800 !text-slate-900 dark:!text-slate-100 !shadow-lg",
              success: {
                icon: '✅',
                className: "!bg-emerald-50 dark:!bg-emerald-900/30 !text-emerald-900 dark:!text-emerald-300 !border !border-emerald-200 dark:!border-emerald-800",
              },
              error: {
                icon: '❌',
                className: "!bg-red-50 dark:!bg-red-900/30 !text-red-900 dark:!text-red-300 !border !border-red-200 dark:!border-red-800",
              },
            }}
          />
        </div>
      </body>
    </html>
  );
}
