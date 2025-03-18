import { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import ProblemList from "@/components/problem/ProblemList";

export const metadata: Metadata = {
  title: "Algorithm Problems | ZenithSolve",
  description: "Browse our collection of algorithm problems",
};

export default function Home() {
  return (
    <>
      <main className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-5xl font-extrabold mb-4">ZenithSolve</h2>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Algorithm Practice Problems with Real-World Context
            </h1>
            <p className="text-lg max-w-2xl mx-auto">
              Bridging the gap between algorithm practice problems and
              real-world industry applications with interactive visualizations.
            </p>
          </div>
          <ProblemList />
        </div>
      </main>
      <Footer />
    </>
  );
}
