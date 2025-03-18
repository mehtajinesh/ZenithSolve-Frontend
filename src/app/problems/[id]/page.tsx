"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/layout/Footer";
import { mockProblems } from "@/data/mockProblems";

export default function ProblemDetail() {
  const params = useParams();
  const problemId = params.id as string;
  
  // Find the problem with the matching ID
  const problem = mockProblems.find(p => p.id === problemId);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<'description' | 'solution'>('description');
  
  // If problem not found
  if (!problem) {
    return (
      <>
        <main className="container mx-auto px-4 py-12 min-h-screen">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Problem Not Found</h1>
            <p className="mb-8 text-slate-700 dark:text-slate-300">
              The problem you're looking for doesn't exist or has been removed.
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
            <nav className="flex" aria-label="Breadcrumb">
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
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-4 border border-teal-200 dark:border-slate-700">
                    <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Example 1:</h3>
                    <div className="mb-2">
                      <span className="font-mono text-sm text-slate-700 dark:text-slate-300">Input: </span>
                      <code className="font-mono text-sm bg-white dark:bg-slate-800 px-2 py-1 rounded border border-teal-200 dark:border-slate-700 text-slate-900 dark:text-slate-200">
                        {problem.id === 'two-sum' ? 'nums = [2,7,11,15], target = 9' : 'Sample Input'}
                      </code>
                    </div>
                    <div>
                      <span className="font-mono text-sm text-slate-700 dark:text-slate-300">Output: </span>
                      <code className="font-mono text-sm bg-white dark:bg-slate-800 px-2 py-1 rounded border border-teal-200 dark:border-slate-700 text-slate-900 dark:text-slate-200">
                        {problem.id === 'two-sum' ? '[0,1]' : 'Sample Output'}
                      </code>
                    </div>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
                      {problem.id === 'two-sum' 
                        ? 'Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1].' 
                        : 'Explanation of the example would go here.'}
                    </p>
                  </div>
                </div>
                
                {/* Constraints */}
                <div>
                  <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Constraints</h2>
                  <ul className="list-disc pl-5 space-y-2 text-slate-700 dark:text-slate-300">
                    {problem.id === 'two-sum' ? (
                      <>
                        <li>2 ≤ nums.length ≤ 10^4</li>
                        <li>-10^9 ≤ nums[i] ≤ 10^9</li>
                        <li>-10^9 ≤ target ≤ 10^9</li>
                        <li>Only one valid answer exists.</li>
                      </>
                    ) : (
                      <li>Problem-specific constraints would be listed here.</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Solution Tab */}
            {activeTab === 'solution' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Solution Approach</h2>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    {problem.solutionApproach || 'A detailed explanation of the solution approach would go here.'}
                  </p>
                </div>

                {/* Solutions */}
                <div className="space-y-8">
                  {problem.pythonSolutions?.map((solution, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-4 mb-3">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                          {solution.name}
                        </h2>
                        <div className="flex gap-2 text-sm">
                          <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300">
                            Time: {solution.timeComplexity}
                          </span>
                          <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300">
                            Space: {solution.spaceComplexity}
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
                          className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-md text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none border border-teal-200 dark:border-slate-700 transition-colors"
                          title="Copy code"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* SQL Solution (unchanged) */}
                  {problem.sqlSolution && (
                    <div>
                      <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">SQL Solution</h2>
                      {problem.schemaInfo && (
                        <div className="mb-4">
                          <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Schema Information</h3>
                          <pre className="language-sql bg-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto border border-teal-200 dark:border-slate-700">
                            <code className="text-slate-900 dark:text-slate-200 font-mono">
                              {problem.schemaInfo}
                            </code>
                          </pre>
                        </div>
                      )}
                      <div className="relative">
                        <pre className="language-sql bg-slate-50 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto border border-teal-200 dark:border-slate-700">
                          <code className="text-slate-900 dark:text-slate-200 font-mono">
                            {problem.sqlSolution}
                          </code>
                        </pre>
                        <button 
                          className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-800 rounded-md text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none border border-teal-200 dark:border-slate-700 transition-colors"
                          title="Copy code"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Examples section - Make it handle both code and SQL examples */}
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
              href="/" 
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