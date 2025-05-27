"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Footer from "@/components/layout/Footer";
import { problemsService } from "@/services/api/problems";
import type { Problem } from "@/types/problem";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { categoriesService } from "@/services/api/categories";

// Import markdown preview component
const MarkdownPreview = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
);

// Import markdown editor with no SSR
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

// Toast notification styles for consistent UX
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

export default function ProblemDetail() {
  const params = useParams();
  const router = useRouter();
  const problemId = params?.id as string || '';
  
  // State for problem data and loading
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'solution'>('description');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  // State for edit problem modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Problem>>({
    slug_id: "",
    title: "",
    difficulty: "Easy",
    categories: [],
    description: "",
    constraints: "",
    examples: []
  });
  
  // Add state for available categories
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");

  // State for solution management
  const [isEditSolutionModalOpen, setIsEditSolutionModalOpen] = useState(false);
  const [isDeleteSolutionModalOpen, setIsDeleteSolutionModalOpen] = useState(false);
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState<number | null>(null);
  const [solutionFormData, setSolutionFormData] = useState({
    name: "",
    description: "",
    code: "",
    time_complexity: "",
    space_complexity: ""
  });
  const [isDeletingSolution, setIsDeletingSolution] = useState(false);

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

  // Fetch available categories when modal opens
  useEffect(() => {
    if (isEditModalOpen) {
      const fetchCategories = async () => {
        try {
          const categories = await categoriesService.getCategories();
          setAvailableCategories(categories);
        } catch (err) {
          console.error('Error fetching categories:', err);
        }
      };
      fetchCategories();
    }
  }, [isEditModalOpen]);

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMarkdownChange = (value?: string) => {
    setFormData(prev => ({
      ...prev,
      description: value || "",
    }));
  };

  // Function to handle category changes
  const handleCategoryChange = (categories: string[]) => {
    setFormData(prev => ({
      ...prev,
      categories
    }));
  };

  // Function to handle example changes
  const handleExampleChange = (index: number, value: string) => {
    const newExamples = [...(formData.examples || [])];
    newExamples[index] = value;
    setFormData(prev => ({
      ...prev,
      examples: newExamples
    }));
  };

  // Function to add an example
  const addExample = () => {
    setFormData(prev => ({
      ...prev,
      examples: [...(prev.examples || []), ""]
    }));
  };

  // Function to remove an example
  const removeExample = (index: number) => {
    const newExamples = [...(formData.examples || [])];
    newExamples.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      examples: newExamples
    }));
  };

  // Function to add a new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await categoriesService.createCategory(newCategory.trim());
      setAvailableCategories(prev => [...prev, newCategory.trim()]);
      handleCategoryChange([...(formData.categories || []), newCategory.trim()]);
      setNewCategory("");
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.slug_id || !formData.description || 
        !formData.difficulty || formData.categories?.length === 0) {
      setFormError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    
    // Show loading toast
    const toastId = toast.loading("Updating problem...", toastStyles.loading);

    try {
      // Call the API to update the problem
      await problemsService.updateProblem(problemId, formData);
      
      // Update the problem in the state
      setProblem({
        ...problem!,
        ...formData
      } as Problem);
      
      // Close the modal
      setIsEditModalOpen(false);
      
      // Show success toast
      toast.success("Problem updated successfully!", { id: toastId, ...toastStyles.success });
      
      // Check if slug_id has changed and redirect if necessary
      if (formData.slug_id !== problem!.slug_id) {
        // Redirect to the new problem URL using the updated slug_id
        router.push(`/problems/${formData.slug_id}`);
      } else {
        // If slug_id hasn't changed, just refresh the current page
        router.refresh();
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update problem";
      setFormError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage, { id: toastId, ...toastStyles.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle solution form changes
  const handleSolutionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSolutionFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to handle solution update
  const handleUpdateSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!solutionFormData.name || !solutionFormData.description || !solutionFormData.code ||
        !solutionFormData.time_complexity || !solutionFormData.space_complexity) {
      setFormError("Please fill in all solution fields");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    
    // Show loading toast
    const toastId = toast.loading("Updating solution...", toastStyles.loading);

    try {
      if (selectedSolutionIndex === null || !problem?.solutions) {
        throw new Error("Solution not found");
      }

      const solutionId = problem.solutions[selectedSolutionIndex].name; // Assuming name is used as ID
      
      // Call the API to update the solution
      await problemsService.updateSolution(problemId, solutionId, solutionFormData);
      
      // Update the solution in the local state
      const updatedSolutions = [...problem.solutions];
      updatedSolutions[selectedSolutionIndex] = {
        ...updatedSolutions[selectedSolutionIndex],
        ...solutionFormData
      };
      
      setProblem({
        ...problem,
        solutions: updatedSolutions
      });
      
      // Close the modal
      setIsEditSolutionModalOpen(false);
      
      // Show success toast
      toast.success("Solution updated successfully!", { id: toastId, ...toastStyles.success });
      
      // Refresh the page to ensure data consistency
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update solution";
      setFormError(errorMessage);
      
      // Show error toast
      toast.error(errorMessage, { id: toastId, ...toastStyles.error });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle solution deletion
  const handleDeleteSolution = async () => {
    if (selectedSolutionIndex === null || !problem?.solutions) {
      return;
    }

    setIsDeletingSolution(true);
    
    // Show loading toast
    const toastId = toast.loading("Deleting solution...", toastStyles.loading);

    try {
      const solutionId = problem.solutions[selectedSolutionIndex].name; // Assuming name is used as ID
      
      // Call the API to delete the solution
      await problemsService.deleteSolution(problemId, solutionId);
      
      // Update the solutions in the local state
      const updatedSolutions = [...problem.solutions];
      updatedSolutions.splice(selectedSolutionIndex, 1);
      
      setProblem({
        ...problem,
        solutions: updatedSolutions
      });
      
      // Close the modal
      setIsDeleteSolutionModalOpen(false);
      
      // Show success toast
      toast.success("Solution deleted successfully!", { id: toastId, ...toastStyles.success });
      
      // Refresh the page to ensure data consistency
      router.refresh();
    } catch (error: any) {
      const errorMessage = error.message || "Failed to delete solution";
      
      // Show error toast
      toast.error(errorMessage, { id: toastId, ...toastStyles.error });
    } finally {
      setIsDeletingSolution(false);
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
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // Initialize form data with current problem values
                    setFormData({
                      slug_id: problem.slug_id,
                      title: problem.title,
                      difficulty: problem.difficulty,
                      categories: [...problem.categories],
                      description: problem.description,
                      constraints: problem.constraints,
                      examples: JSON.parse(JSON.stringify(problem.examples)),
                      clarifying_questions: problem.clarifying_questions ? [...problem.clarifying_questions] : [""]
                    });
                    setIsEditModalOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                  Edit Problem
                </button>
                <Link
                  href={`/problems/${problemId}/solutions/new`}
                  className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Add Solution
                </Link>
              </div>
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
                  <div data-color-mode="dark">
                    <MarkdownPreview source={problem.description} />
                  </div>
                </div>
                
                {/* Examples */}
                <div>
                  <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Examples</h2>
                  {problem.examples?.map((example, index) => (
                    <div key={index} className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg mb-4 border border-teal-200 dark:border-slate-700">
                      <h3 className="font-semibold mb-2 text-slate-900 dark:text-white">Example {index + 1}:</h3>
                      <div data-color-mode="dark">
                        <MarkdownPreview source={example} />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Constraints */}
                <div>
                  <h2 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Constraints</h2>
                  <div className="w-full p-4 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
                    <div data-color-mode="dark">
                      <MarkdownPreview source={problem.constraints} />
                    </div>
                  </div>
                </div>

                {/* Clarifying Questions Section */}
                {problem.clarifying_questions && problem.clarifying_questions.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Clarifying Questions</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {problem.clarifying_questions.map((question, index) => (
                        <li key={index} className="text-slate-700 dark:text-slate-300">
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Solution Tab */}
            {activeTab === 'solution' && (
              <div className="space-y-6">

                {/* Solutions */}
                <div className="space-y-8">
                  {problem.solutions && problem.solutions.length > 0 ? (
                    problem.solutions.map((solution, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div className="flex items-center gap-4">
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                // Initialize solution form data with current values
                                setSolutionFormData({
                                  name: solution.name,
                                  description: solution.description,
                                  code: solution.code,
                                  time_complexity: solution.time_complexity,
                                  space_complexity: solution.space_complexity
                                });
                                setSelectedSolutionIndex(index);
                                setIsEditSolutionModalOpen(true);
                              }}
                              className="p-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
                              title="Edit solution"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedSolutionIndex(index);
                                setIsDeleteSolutionModalOpen(true);
                              }}
                              className="p-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors"
                              title="Delete solution"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <div data-color-mode="dark">
                            <MarkdownPreview source={solution.description} />
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Solution Code</h3>
                            <div data-color-mode="dark">
                              <MarkdownPreview source={solution.code} />
                            </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="mb-4 text-slate-400">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">No Solutions Yet</h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-6">
                        Be the first to add a solution for this problem!
                      </p>
                      <Link
                        href={`/problems/${problemId}/solutions/new`}
                        className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Add Solution
                      </Link>
                    </div>
                  )}
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

      {/* Edit Problem Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Edit Problem</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                  {formError}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="title" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-600 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="slug_id" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                    Slug ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug_id"
                    name="slug_id"
                    value={formData.slug_id}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-600 focus:outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="difficulty" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                  Difficulty <span className="text-red-500">*</span>
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-600 focus:outline-none"
                  required
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                  Categories <span className="text-red-500">*</span>
                </label>
                <div className="space-y-4">
                  {/* Selected Categories */}
                  <div className="flex flex-wrap gap-2">
                    {formData.categories?.map((category, index) => (
                      <div 
                        key={index} 
                        className="bg-teal-100 text-teal-900 dark:bg-teal-900/30 dark:text-teal-300 px-3 py-1 rounded-full flex items-center"
                      >
                        <span className="mr-1">{category}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newCategories = [...(formData.categories || [])];
                            newCategories.splice(index, 1);
                            handleCategoryChange(newCategories);
                          }}
                          className="text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-200 focus:outline-none"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Available Categories Dropdown */}
                  <div className="relative">
                    <select
                      value=""
                      onChange={(e) => {
                        const selectedCategory = e.target.value;
                        if (selectedCategory && !formData.categories?.includes(selectedCategory)) {
                          handleCategoryChange([...(formData.categories || []), selectedCategory]);
                        }
                      }}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-600 focus:outline-none"
                    >
                      <option value="">Select a category</option>
                      {availableCategories
                        .filter(cat => !formData.categories?.includes(cat))
                        .map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Add New Category */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder="Add new category..."
                      className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-600 focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCategory();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="description" className="block font-medium text-slate-700 dark:text-slate-300">
                    Description <span className="text-red-500">*</span>
                  </label>
                </div>
                <div data-color-mode="dark">
                  <MDEditor
                    value={formData.description}
                    onChange={handleMarkdownChange}
                    preview="edit"
                    height={300}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Constraints */}
              <div>
                <label htmlFor="constraints" className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-2">
                  Constraints
                </label>
                <div data-color-mode="dark">
                  <MDEditor
                    value={formData.constraints || ""}
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
              </div>

              {/* Clarifying Questions */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                    Clarifying Questions
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        clarifying_questions: [...(prev.clarifying_questions || []), ""]
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
                  {(formData.clarifying_questions || [""]).map((question, index) => (
                    <div key={index} className="relative group">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            clarifying_questions: (prev.clarifying_questions || []).map((q, i) => 
                              i === index ? e.target.value : q
                            )
                          }));
                        }}
                        className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200 transition-all duration-200 hover:border-teal-300 dark:hover:border-slate-500"
                        placeholder="Enter a clarifying question"
                      />
                      {(formData.clarifying_questions?.length || 0) > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              clarifying_questions: (prev.clarifying_questions || []).filter((_, i) => i !== index)
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
              </div>
              
              {/* Examples */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium text-slate-700 dark:text-slate-300">Examples</label>
                  <button
                    type="button"
                    onClick={addExample}
                    className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 focus:outline-none"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </button>
                </div>
                {(formData.examples || []).map((example, index) => (
                  <div key={index} className="mb-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium text-slate-700 dark:text-slate-300">Example {index + 1}</h3>
                      {(formData.examples || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExample(index)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    <div data-color-mode="dark">
                      <MDEditor
                        value={example}
                        onChange={(value) => handleExampleChange(index, value || "")}
                        preview="edit"
                        height={200}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Problem'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Solution Modal */}
      {isEditSolutionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Solution</h2>
              <button
                onClick={() => setIsEditSolutionModalOpen(false)}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateSolution} className="p-6">
              {formError && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                  {formError}
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="solution-name" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                  Solution Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="solution-name"
                  name="name"
                  value={solutionFormData.name}
                  onChange={handleSolutionFormChange}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-600 focus:outline-none"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="solution-description" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                  Description <span className="text-red-500">*</span>
                </label>
                <div data-color-mode="dark">
                  <MDEditor
                    value={solutionFormData.description}
                    onChange={(value) => {
                      setSolutionFormData(prev => ({
                        ...prev,
                        description: value || ""
                      }));
                    }}
                    preview="edit"
                    height={200}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="solution-code" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                  Code <span className="text-red-500">*</span>
                </label>
                <div data-color-mode="dark">
                  <MDEditor
                    value={solutionFormData.code}
                    onChange={(value) => {
                      setSolutionFormData(prev => ({
                        ...prev,
                        code: value || ""
                      }));
                    }}
                    preview="edit"
                    height={300}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="time_complexity" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                    Time Complexity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="time_complexity"
                    name="time_complexity"
                    value={solutionFormData.time_complexity}
                    onChange={handleSolutionFormChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-600 focus:outline-none"
                    required
                    placeholder="e.g., O(n), O(log n)"
                  />
                </div>
                <div>
                  <label htmlFor="space_complexity" className="block mb-2 font-medium text-slate-700 dark:text-slate-300">
                    Space Complexity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="space_complexity"
                    name="space_complexity"
                    value={solutionFormData.space_complexity}
                    onChange={handleSolutionFormChange}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-white focus:border-teal-500 dark:focus:border-teal-600 focus:outline-none"
                    required
                    placeholder="e.g., O(n), O(1)"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditSolutionModalOpen(false)}
                  className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    'Update Solution'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Solution Confirmation Modal */}
      {isDeleteSolutionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center mb-4 text-red-600 dark:text-red-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-4">Delete Solution</h2>
              <p className="text-slate-700 dark:text-slate-300 text-center mb-6">
                Are you sure you want to delete this solution? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeleteSolutionModalOpen(false)}
                  className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSolution}
                  disabled={isDeletingSolution}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeletingSolution ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    'Delete Solution'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}