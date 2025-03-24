"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";
import { problemsService } from "@/services/api/problems";
import type { Problem } from "@/types/problem";

export default function ProblemDetail() {
  const params = useParams();
  const problemId = params?.id as string || '';
  
  // State for problem data and loading
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'solution'>('description');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await problemsService.getProblemById(problemId);
        setProblem(data);
      } catch (err) {
        setError('Failed to fetch problem');
        console.error('Error fetching problem:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <main className="container mx-auto px-4 py-12 min-h-screen">
          <div className="max-w-3xl mx-auto text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto mb-6"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mx-auto mb-8"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !problem) {
    return (
      <>
        <main className="container mx-auto px-4 py-12 min-h-screen">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Problem Not Found</h1>
            <p className="mb-8 text-slate-700 dark:text-slate-300">
              The problem you`&apos;`re looking for doesn`&apos;`t exist or has been removed.
            </p>
            <Link
              href="/"
              className="px-6 py-3 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors"
            >
              Return to Problems
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "Medium":
        return "bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-400";
      case "Hard":
        return "bg-rose-100 text-rose-900 dark:bg-rose-900/30 dark:text-rose-400";
      default:
        return "bg-slate-100 text-slate-900 dark:bg-slate-900/30 dark:text-slate-400";
    }
  };

  return (
    <>
      <main className="container mx-auto px-4 py-12 min-h-screen">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumb navigation */}
          <motion.div variants={itemVariants} className="mb-6">
            <nav className="flex justify-between items-center" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    Home
                  </Link>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                    </svg>
                    <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400 md:ml-2 truncate max-w-[180px]">
                      {problem.title}
                    </span>
                  </div>
                </li>
              </ol>
              <Link
                href={`/problems/${problemId}/solutions/new`}
                className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Solution
              </Link>
            </nav>
          </motion.div>
          
          {/* Problem header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold mr-3 text-slate-900 dark:text-white">{problem.title}</h1>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                {problem.difficulty}
              </span>
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {problem.categories.map((category, index) => (
                <span 
                  key={index} 
                  className="text-xs bg-teal-100 text-teal-900 dark:bg-teal-900/30 dark:text-teal-300 px-2.5 py-1 rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </motion.div>
          
          {/* Tabs navigation */}
          <motion.div variants={itemVariants} className="border-b border-slate-200 dark:border-slate-700 mb-8">
            <ul className="flex flex-wrap -mb-px">
              <li className="mr-2">
                <button
                  className={`inline-block py-4 px-4 border-b-2 rounded-t-lg ${
                    activeTab === 'description'
                      ? 'text-teal-600 border-teal-600 dark:text-teal-400 dark:border-teal-400'
                      : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-teal-600 hover:border-teal-300 dark:hover:text-teal-400 transition-colors'
                  }`}
                  onClick={() => setActiveTab('description')}
                >
                  Problem Description
                </button>
              </li>
              <li className="mr-2">
                <button
                  className={`inline-block py-4 px-4 border-b-2 rounded-t-lg ${
                    activeTab === 'solution'
                      ? 'text-teal-600 border-teal-600 dark:text-teal-400 dark:border-teal-400'
                      : 'border-transparent text-slate-700 dark:text-slate-300 hover:text-teal-600 hover:border-teal-300 dark:hover:text-teal-400 transition-colors'
                  }`}
                  onClick={() => setActiveTab('solution')}
                >
                  Solution
                </button>
              </li>
            </ul>
          </motion.div>
          
          {/* Tab content */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-teal-200 dark:border-slate-700 p-6 mb-8 hover:shadow-lg transition-shadow"
          >
            {/* Problem Description Tab */}
            {activeTab === 'description' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Problem Statement</h2>
                  <p className="text-slate-700 dark:text-slate-300">{problem.description}</p>
                </div>
                
                {/* Example input/output would go here */}
                <div>
                  <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Examples</h2>
                  {problem.examples?.map((example, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-4 border border-teal-200 dark:border-slate-700">
                      <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Example {index + 1}:</h3>
                      {example.input && (
                        <div className="mb-2">
                          <span className="font-mono text-sm text-slate-700 dark:text-slate-300">Input: </span>
                          <code className="font-mono text-sm bg-white dark:bg-slate-800 px-2 py-1 rounded border border-teal-200 dark:border-slate-700 text-slate-900 dark:text-slate-200">
                            {example.input}
                          </code>
                        </div>
                      )}
                      {example.output && (
                        <div>
                          <span className="font-mono text-sm text-slate-700 dark:text-slate-300">Output: </span>
                          <code className="font-mono text-sm bg-white dark:bg-slate-800 px-2 py-1 rounded border border-teal-200 dark:border-slate-700 text-slate-900 dark:text-slate-200">
                            {example.output}
                          </code>
                        </div>
                      )}
                      {example.explanation && (
                        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">{example.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Constraints */}
                <div>
                  <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Constraints</h2>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                  {problem.constraints?.map((constraint, index) => (
                      <li key={index}>{constraint}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Solution Tab */}
            {activeTab === 'solution' && (
              <div className="space-y-6">

                {/* Solutions */}
                <div className="space-y-8">
                  {problem.solutions?.map((solution, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-4 mb-3">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          Approach {index + 1}: {solution.name}
                        </h2>
                        <div className="flex gap-2 text-sm">
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300">
                            Time: {solution.time_complexity}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300">
                            Space: {solution.space_complexity}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-700 dark:text-slate-300 mb-4">
                        {solution.description}
                      </p>

                      <div className="relative">
                        <pre className="language-python bg-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto border border-teal-200 dark:border-slate-700">
                          <code className="text-slate-900 dark:text-slate-200 font-mono">
                            {solution.code}
                          </code>
                        </pre>
                        <button 
                          onClick={() => handleCopyCode(solution.code, index)}
                          className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-md text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none border border-teal-200 dark:border-slate-700 transition-colors"
                          title={copiedIndex === index ? "Copied!" : "Copy code"}
                        >
                          {copiedIndex === index ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Examples</h2>
                  {problem.examples?.map((example, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-4 border border-teal-200 dark:border-slate-700">
                      <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Example {index + 1}:</h3>
                      {example.input && (
                        <div className="mb-2">
                          <span className="font-mono text-sm text-slate-700 dark:text-slate-300">Input: </span>
                          <code className="font-mono text-sm bg-white dark:bg-slate-800 px-2 py-1 rounded border border-teal-200 dark:border-slate-700 text-slate-900 dark:text-slate-200">
                            {example.input}
                          </code>
                        </div>
                      )}
                      {example.output && (
                        <div>
                          <span className="font-mono text-sm text-slate-700 dark:text-slate-300">Output: </span>
                          <code className="font-mono text-sm bg-white dark:bg-slate-800 px-2 py-1 rounded border border-teal-200 dark:border-slate-700 text-slate-900 dark:text-slate-200">
                            {example.output}
                          </code>
                        </div>
                      )}
                      {example.explanation && (
                        <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">{example.explanation}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Navigation button */}
          <motion.div variants={itemVariants} className="flex justify-between">
            <Link 
              href="/#problems" 
              className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-700 dark:text-slate-300 flex items-center border border-teal-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              All Problems
            </Link>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}