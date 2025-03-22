"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Problem } from "@/types/problem";
import ProblemCard from "./ProblemCard";
import { problemsService } from "@/services/api/problems";
import { categoriesService } from "@/services/api/categories";
import CreateCategoryModal from "./CreateCategoryModal";

type Difficulty = "Easy" | "Medium" | "Hard" | "All";
const difficulties: Difficulty[] = ["All", "Easy", "Medium", "Hard"];

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

export default function ProblemList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("All");
  const [category, setCategory] = useState("All");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);

  // Fetch problems and categories on component mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [problemsData, categoriesData] = await Promise.all([
          problemsService.getProblems(),
          categoriesService.getCategories()
        ]);
        setProblems(problemsData);
        setFilteredProblems(problemsData);
        setCategories(["All", ...categoriesData]);
      } catch (err) {
        setError('Failed to fetch problems');
        console.error('Error fetching problems:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter handling
  useEffect(() => {
    let results = [...problems];
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
        problem.categories.some(cat => cat.toLowerCase().includes(query))
      );
    }
    setFilteredProblems(results);
  }, [searchQuery, difficulty, category, problems]);

  const handleCategoryCreated = () => {
    // Refresh categories and problems
    Promise.all([
      problemsService.getProblems(),
      categoriesService.getCategories()
    ]).then(([problemsData, categoriesData]) => {
      setProblems(problemsData);
      setFilteredProblems(problemsData);
      setCategories(["All", ...categoriesData]);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 glass rounded-xl p-10 border border-red-200 dark:border-red-800">
        <div className="mb-4 text-6xl">⚠️</div>
        <h3 className="text-2xl font-bold mb-2 text-red-600 dark:text-red-400">{error}</h3>
        <p className="text-slate-700 dark:text-slate-400">
          Please try refreshing the page
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Problems</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Practice coding problems and improve your skills</p>
        </div>
        <div className="flex gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link 
              href="/problems/new"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-500 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              Create Problem
            </Link>
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateCategoryModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Category
          </motion.button>
        </div>
      </div>

      <div className="mb-10 p-6 rounded-xl shadow-md border border-teal-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button 
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setSearchQuery("")}
                >
                  <svg className="w-5 h-5 text-slate-400 hover:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="block w-full px-4 py-3 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
              Category
            </label>
            <select
              id="category"
              className="block w-full px-4 py-3 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-slate-900 dark:text-slate-200">
          Showing {filteredProblems.length} {filteredProblems.length === 1 ? 'problem' : 'problems'}
        </h2>
      </div>

      {filteredProblems.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.slug_id} problem={problem} />
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

      <CreateCategoryModal 
        isOpen={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onSuccess={handleCategoryCreated}
      />
    </div>
  );
}