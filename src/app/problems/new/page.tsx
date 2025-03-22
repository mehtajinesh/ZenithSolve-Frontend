"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/services/api/config";
import { useRouter } from "next/navigation";
import type { Problem } from "@/types/problem";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { categoriesService } from "@/services/api/categories";

// Constants for form options
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

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

  // Form states
  const [formData, setFormData] = useState<Problem>({
    slug_id: "",
    title: "",
    difficulty: "Easy",
    categories: [],
    description: "",
    constraints: [],
    examples: [{ input: "", output: "", explanation: "" }],
  });

  useEffect(() => {
    async function loadCategories() {
      const categoriesData = await categoriesService.getCategories();
      setCategories(categoriesData);
    }
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating problem...");

    try {
      // Form validation
      if (formData.categories.length === 0) {
        throw new Error("Please select at least one category");
      }

      if (formData.examples.some(ex => !ex.input.trim() || !ex.output.trim())) {
        throw new Error("Input and output are required for all examples");
      }

      // Submit the form
      await apiClient.post("/problems", formData);
      
      // Show success message
      toast.success("Problem created successfully!", { id: toastId });
      
      // Redirect after a short delay to ensure the user sees the success message
      setTimeout(() => {
        router.push("/problems");
      }, 1000);
    } catch (err) {
      // Show error message
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to create problem. Please try again.";
      
      toast.error(errorMessage, { id: toastId });
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

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      categories: selectedOptions,
    }));
  };

  const handleExampleChange = (index: number, field: keyof Problem["examples"][0], value: string) => {
    setFormData(prev => ({
      ...prev,
      examples: prev.examples.map((example, i) => 
        i === index ? { ...example, [field]: value } : example
      ),
    }));
  };

  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...prev.examples, { input: "", output: "", explanation: "" }],
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
        className="text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100"
      >
        Add New Problem
      </motion.h1>
      
      <motion.form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <motion.div variants={itemVariants} className="relative group">
            <label htmlFor="slug_id" className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">
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
            <label htmlFor="title" className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">
              Title
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
            <label htmlFor="difficulty" className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">
              Difficulty
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
            <label htmlFor="categories" className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">
              Categories
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
            <label htmlFor="description" className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 transition-all duration-200 hover:border-teal-300 dark:hover:border-slate-500"
              rows={6}
              placeholder="Write the problem description here..."
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-slate-900 dark:text-slate-200">Constraints</h3>
              <button
                type="button"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  constraints: [...(prev.constraints || []), ""]
                }))}
                className="px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors"
              >
                Add Constraint
              </button>
            </div>

            {formData.constraints?.map((constraint, index) => (
              <div key={index} className="relative group mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={constraint}
                    onChange={(e) => {
                      const newConstraints = [...(formData.constraints || [])];
                      newConstraints[index] = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        constraints: newConstraints
                      }));
                    }}
                    className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 transition-all duration-200 hover:border-teal-300 dark:hover:border-slate-500"
                    placeholder="e.g., 1 ≤ n ≤ 10^5"
                  />
                  {formData.constraints.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newConstraints = formData.constraints.filter((_, i) => i !== index);
                        setFormData(prev => ({
                          ...prev,
                          constraints: newConstraints
                        }));
                      }}
                      className="px-3 py-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
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
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">Input</label>
                      <textarea
                        value={example.input}
                        onChange={(e) => handleExampleChange(index, "input", e.target.value)}
                        className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 transition-all duration-200 hover:border-teal-300 dark:hover:border-slate-500"
                        rows={2}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">Output</label>
                      <textarea
                        value={example.output}
                        onChange={(e) => handleExampleChange(index, "output", e.target.value)}
                        className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 transition-all duration-200 hover:border-teal-300 dark:hover:border-slate-500"
                        rows={2}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">
                        Explanation
                      </label>
                      <textarea
                        value={example.explanation}
                        onChange={(e) => handleExampleChange(index, "explanation", e.target.value)}
                        className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 transition-all duration-200 hover:border-teal-300 dark:hover:border-slate-500"
                        rows={2}
                      />
                    </div>

                    {formData.examples.length > 1 && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => removeExample(index)}
                          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          Remove Example
                        </button>
                      </div>
                    )}
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