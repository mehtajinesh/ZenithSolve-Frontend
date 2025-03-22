"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Problem } from "@/types/problem";

type ProblemCardProps = {
  problem: Problem;
};

export default function ProblemCard({ problem }: ProblemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  
  // Get difficulty color - updated with new color scheme
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
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    },
    hover: {
      y: -5,
      transition: { 
        duration: 0.3,
        ease: "easeOut" 
      }
    }
  };
  
  return (
    <motion.div 
      className={`relative rounded-xl overflow-hidden border border-teal-200 dark:border-slate-700 ${isHovered ? 'shadow-lg glow' : 'shadow-md'} transition-all duration-300`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Card header with title and difficulty */}
      <div className="p-6 pb-4 border-b border-teal-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold truncate text-slate-900 dark:text-white">{problem.title}</h3>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
        
        {/* Categories tags */}
        <div className="flex flex-wrap gap-2 mt-3">
          {problem.categories.slice(0, 3).map((category, index) => (
            <motion.span 
              key={index} 
              className="text-xs px-2.5 py-1 rounded-full bg-teal-100 text-teal-900 dark:bg-teal-900/30 dark:text-teal-300"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
            >
              {category}
            </motion.span>
          ))}
          {problem.categories.length > 3 && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-300">
              +{problem.categories.length - 3}
            </span>
          )}
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-6 bg-slate-50 dark:bg-slate-900">
        {/* Description */}
        <p className="h-20 text-sm mb-4 text-slate-700 dark:text-slate-300 overflow-hidden">
          {problem.description}
        </p>
        
        {/* Best Complexity badges */}
        {(problem.best_time_complexity || problem.best_space_complexity) && (
          <div className="flex flex-wrap gap-3 mb-4 text-xs">
            {problem.best_time_complexity && (
              <div className="py-1 px-2 rounded bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
                <span className="font-semibold text-indigo-700 dark:text-indigo-300">Best Time:</span> 
                <span className="text-indigo-600 dark:text-indigo-400 ml-1">{problem.best_time_complexity}</span>
              </div>
            )}
            {problem.best_space_complexity && (
              <div className="py-1 px-2 rounded bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
                <span className="font-semibold text-purple-700 dark:text-purple-300">Best Space:</span> 
                <span className="text-purple-600 dark:text-purple-400 ml-1">{problem.best_space_complexity}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Real-world applications button */}
        <div className="mb-5">
          <button 
            className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 focus:outline-none flex items-center transition-colors"
            onClick={() => setShowApplications(!showApplications)}
          >
            <span>Real-world applications</span>
            <svg 
              className={`ml-1 w-4 h-4 transition-transform ${showApplications ? "rotate-180" : ""}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          {/* Applications details (collapsible) */}
          {showApplications && (
            <motion.div 
              className="mt-3 space-y-3 text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {problem.real_world_applications.map((app, index) => (
                <div 
                  key={index} 
                  className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-teal-200 dark:border-slate-700"
                >
                  <div className="font-medium mb-1 text-teal-700 dark:text-teal-400">
                    {typeof app === 'string' ? app : app.industry}
                  </div>
                  {typeof app !== 'string' && (
                    <>
                      <p className="mb-1 text-slate-700 dark:text-slate-300">{app.description}</p>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Impact: {app.impact}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </div>
        
        {/* Action buttons */}
        <div className="flex mt-4">
          <Link 
            href={`/problems/${problem.slug_id}`}
            className="w-full flex justify-center items-center py-2 px-4 text-sm font-medium rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors dark:bg-teal-700 dark:hover:bg-teal-800"
          >
            View Problem
          </Link>
        </div>
      </div>
    </motion.div>
  );
}