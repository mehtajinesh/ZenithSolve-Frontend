"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProblemCard from "./ProblemCard";
import { mockProblems } from "@/data/mockProblems";

// Filter type definitions
type Difficulty = "Easy" | "Medium" | "Hard" | "All";
type Category = "Array" | "String" | "LinkedList" | "Tree" | "Graph" | "Dynamic Programming" | "Sorting" | "Greedy" | "SQL" | "Database" | "All";

export default function ProblemList() {
  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("All");
  const [category, setCategory] = useState<Category>("All");
  const [problems, setProblems] = useState(mockProblems);
  const [filteredProblems, setFilteredProblems] = useState(mockProblems);
  
  // Categories and difficulties arrays
  const categories: Category[] = [
    "All", 
    "Array", 
    "String", 
    "LinkedList", 
    "Tree", 
    "Graph", 
    "Dynamic Programming", 
    "Sorting", 
    "Greedy",
    "SQL",
    "Database"
  ];
  
  const difficulties: Difficulty[] = ["All", "Easy", "Medium", "Hard"];
  
  // Filter handling
  useEffect(() => {
    let results = [...mockProblems];
    
    if (difficulty !== "All") {
      results = results.filter(problem => problem.difficulty === difficulty);
    }
    
    if (category !== "All") {
      results = results.filter(problem => problem.categories.includes(category));
    }
    
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      results = results.filter(problem => 
        problem.title.toLowerCase().includes(query) || 
        problem.description.toLowerCase().includes(query) ||
        problem.categories.some(cat => cat.toLowerCase().includes(query)) ||
        problem.realWorldApplications.some(app => 
          app.industry.toLowerCase().includes(query) || 
          app.description.toLowerCase().includes(query)
        )
      );
    }
    
    setFilteredProblems(results);
  }, [searchQuery, difficulty, category]);
  
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
  
  return (
    <div>
      {/* Filters and Search section */}
      <div className="mb-10 p-6 rounded-xl shadow-md border border-teal-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Search input */}
          <div className="col-span-1 lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
              Search Problems
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by name, description, or tag..."
                className="block w-full px-4 py-3 pl-10 pr-12 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setSearchQuery("")}
                >
                  <svg className="w-5 h-5 text-slate-400 hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Difficulty filter */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="block w-full px-4 py-3 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 transition-colors"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>
          
          {/* Category filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
              Category
            </label>
            <select
              id="category"
              className="block w-full px-4 py-3 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 transition-colors"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Results count */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-200">
          Showing {filteredProblems.length} {filteredProblems.length === 1 ? 'problem' : 'problems'}
        </h2>
      </div>
      
      {/* Problems grid */}
      {filteredProblems.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-16 glass rounded-xl p-10 border border-teal-200 dark:border-slate-700">
          <div className="mb-4 text-6xl animate-float">🔍</div>
          <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-slate-200">No problems found</h3>
          <p className="text-slate-700 dark:text-slate-400">
            Try adjusting your filters or search query
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setDifficulty("All");
              setCategory("All");
            }}
            className="mt-6 px-6 py-2 bg-teal-600 hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-800 text-white rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}