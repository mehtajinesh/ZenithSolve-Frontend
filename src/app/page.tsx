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
    <main>
    <div className="w-full min-h-screen flex items-center justify-center">
      {/* Hero section with animated gradient background */}
      <div className="w-full bg-gradient-animated py-16 mb-12 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-5xl font-extrabold mb-4 text-white animate-float">
              ZenithSolve
            </h2>
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Algorithm Practice Problems with Real-World Context
            </h1>
            <p className="text-lg max-w-2xl mx-auto text-slate-100">
              Bridging the gap between algorithm practice problems and
              real-world industry applications with interactive visualizations.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a 
                href="#problems" 
                className="px-8 py-3 bg-white text-teal-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow glow font-medium hover:text-teal-800"
              >
                Browse Problems
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
      <div className="py-12">
        {/* Introduction section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose ZenithSolve?</h2>
          <p className="text-lg max-w-2xl mx-auto text-slate-700">
            At ZenithSolve, we provide a unique platform that combines algorithm
            practice problems with real-world context. Our problems are designed
            to help you not only understand algorithms but also see how they
            apply in real-world scenarios. With interactive visualizations and
            detailed explanations, you can enhance your problem-solving skills
            and prepare for technical interviews with confidence.
          </p>
        </div>
        {/* Problems section */}
        <div id="problems" className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ProblemList />
        </div>
      </div>
      
    </main>
      <Footer />
    </>
  );
}
