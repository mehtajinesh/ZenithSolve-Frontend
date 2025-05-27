"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Problem } from "@/types/problem";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { categoriesService } from "@/services/api/categories";
import { problemsService } from "@/services/api/problems";
import dynamic from "next/dynamic";

// Import markdown editor with no SSR
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

// Constants for form options
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

// Custom toast styles
const toastStyles = {
  success: {
    style: {
      background: '#10B981',
      color: 'white',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      borderRadius: '8px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#10B981',
    },
    duration: 3000,
  },
  error: {
    style: {
      background: '#EF4444',
      color: 'white',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      borderRadius: '8px',
      fontWeight: '500',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#EF4444',
    },
    duration: 4000,
  },
  loading: {
    style: {
      background: '#3B82F6',
      color: 'white',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      borderRadius: '8px',
      fontWeight: '500',
    },
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function NewProblemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<Problem>({
    slug_id: "",
    title: "",
    difficulty: "Easy",
    categories: [],
    description: "",
    constraints: "",
    clarifying_questions: [""],
    examples: [""],
  });

  useEffect(() => {
    async function loadCategories() {
      const categoriesData = await categoriesService.getCategories();
      setCategories(categoriesData);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    const slugify = (text: string) => {
      return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
        .replace(/(^-|-$)/g, ''); // Remove leading or trailing hyphens
    };

    setFormData((prev) => ({
      ...prev,
      slug_id: slugify(formData.title),
    }));
  }, [formData.title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating problem...", toastStyles.loading);

    try {
      // Form validation
      if (formData.categories.length === 0) {
        throw new Error("Please select at least one category");
      }

      if (formData.examples.some(ex => !ex.trim())) {
        throw new Error("Input and output are required for all examples");
      }

      // Call the problems service instead of direct API call
      await problemsService.createProblem(formData);
      
      // Show success message
      toast.success("Problem created successfully!", { id: toastId, ...toastStyles.success });
      
      // Redirect after a short delay to ensure the user sees the success message
      setTimeout(() => {
        router.push("/#problems");
      }, 1000);
    } catch (err) {
      // The error message is already formatted by our axios interceptor
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error(errorMessage, { id: toastId, ...toastStyles.error });
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMarkdownChange = (value?: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value || "",
    }));
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      categories: selectedOptions,
    }));
  };

  const handleExampleChange = (index: number, value?: string) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.map((example, i) => 
        i === index ? (value || "") : example
      ),
    }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, ""],
    }));
  };

  const removeExample = (index: number) => {
    if (formData.examples.length > 1) {
      setFormData(prev => ({
        ...prev,
        examples: prev.examples.filter((_, i) => i !== index),
      }));
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      <motion.h1 
        variants={itemVariants}
        className="text-lg font-bold mb-8 text-slate-900 dark:text-slate-100"
      >
        Add New Problem
      </motion.h1>
      
      <motion.form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <motion.div variants={itemVariants} className="relative group">
            <label htmlFor="slug_id" className="block text-lg font-medium mb-1 text-slate-900 dark:text-slate-200">
              Problem ID (Slug)
            </label>
            <input
              type="text"
              id="slug_id"
              name="slug_id"
              required
              value={formData.slug_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 transition-all duration-200 hover:border-teal-300 dark:hover:border-slate-500"
              placeholder="problem name in lowercase with hyphens (e.g., two-sum)"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <label htmlFor="title" className="block text-lg font-medium mb-1 text-slate-900 dark:text-slate-200">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 transition-all duration-200 hover:border-teal-300 dark:hover:border-slate-500"
              placeholder="problem title (e.g., Two Sum)"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <label htmlFor="difficulty" className="block text-lg font-medium mb-1 text-slate-900 dark:text-slate-200">
              Difficulty <span className="text-red-500">*</span>
            </label>
            <select
              id="difficulty"
              name="difficulty"
              required
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 transition-all duration-200 hover:border-teal-300 dark:hover:border-slate-500"
            >
              {DIFFICULTIES.map(difficulty => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <label htmlFor="categories" className="block text-lg font-medium mb-1 text-slate-900 dark:text-slate-200">
              Categories <span className="text-red-500">*</span>
            </label>
            <select
              id="categories"
              name="categories"
              multiple
              required
              value={formData.categories}
              onChange={handleCategoriesChange}
              className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 transition-all duration-200 hover:border-teal-300 dark:hover:border-slate-500"
              size={5}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Hold Ctrl/Cmd to select multiple categories
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative group">
            <label htmlFor="description" className="block text-lg font-medium text-slate-900 dark:text-slate-200 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <div data-color-mode="dark">
              <MDEditor
                value={formData.description}
                onChange={handleMarkdownChange}
                preview="edit"
                height={300}
                className="w-full"
              />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label htmlFor="constraints" className="block text-lg font-medium text-slate-900 dark:text-slate-200 mb-2">
              Constraints
            </label>
            <div data-color-mode="dark">
              <MDEditor
                value={formData.constraints}
                onChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    constraints: value || ""
                  }));
                }}
                preview="edit"
                height={200}
                className="w-full"
              />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Use markdown to format your constraints. Each constraint should be on a new line.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-lg font-medium text-slate-900 dark:text-slate-200">
                Clarifying Questions
              </label>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    clarifying_questions: [...prev.clarifying_questions, ""]
                  }));
                }}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 focus:outline-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {formData.clarifying_questions.map((question, index) => (
                <div key={index} className="relative group">
                  <div data-color-mode="dark">
                    <MDEditor
                      value={question}
                      onChange={(value) => {
                        setFormData(prev => ({
                          ...prev,
                          clarifying_questions: prev.clarifying_questions.map((q, i) => 
                            i === index ? (value || "") : q
                          )
                        }));
                      }}
                      preview="edit"
                      height={100}
                      className="w-full"
                    />
                  </div>
                  {formData.clarifying_questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          clarifying_questions: prev.clarifying_questions.filter((_, i) => i !== index)
                        }));
                      }}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Add clarifying questions that help users better understand the problem requirements.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Examples</h3>
              <button
                type="button"
                onClick={addExample}
                className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                Add Example
              </button>
            </div>

            {formData.examples.map((example, index) => (
              <div key={index} className="relative group">
                <div 
                  className="p-4 border border-teal-200 dark:border-slate-600 rounded-lg mb-4 bg-white dark:bg-slate-800 group-hover:border-teal-300 dark:group-hover:border-slate-500 transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-md font-medium text-slate-900 dark:text-slate-200">Example {index + 1}</h4>
                      {formData.examples.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExample(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          Remove Example
                        </button>
                      )}
                    </div>
                    <div data-color-mode="dark">
                      <MDEditor
                        value={example}
                        onChange={(value) => handleExampleChange(index, value)}
                        preview="edit"
                        height={200}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Problem'}
          </button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}