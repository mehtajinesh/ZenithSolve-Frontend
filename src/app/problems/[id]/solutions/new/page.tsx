"use client";

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { problemsService } from '@/services/api/problems';
import dynamic from 'next/dynamic';

// Import markdown editor with no SSR
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
  { ssr: false }
);

// Import markdown preview component
const MarkdownPreview = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default.Markdown),
  { ssr: false }
);

export default function NewSolutionPage() {
  const router = useRouter();
  const params = useParams();
  const problemId = params?.id as string || '';

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    time_complexity: '',
    space_complexity: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await problemsService.addSolution(problemId, formData);
      router.push(`/problems/${problemId}`);
      router.refresh();
    } catch (err) {
      setError('Failed to add solution. Please try again.');
      console.error('Error adding solution:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                  </svg>
                  Problems
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <Link href={`/problems/${problemId}`} className="ml-1 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors md:ml-2">Problem</Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-slate-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                  </svg>
                  <span className="ml-1 text-sm font-medium text-slate-500 dark:text-slate-400 md:ml-2">Add Solution</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-6">
          <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Add New Solution</h1>

          {error && (
            <div className="p-4 mb-6 text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">
                Solution Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                placeholder="e.g., Name of the Approach"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">
                Description
              </label>
              <div data-color-mode="dark">
                <MDEditor
                  value={formData.description}
                  onChange={(value) => {
                    setFormData(prev => ({
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

            <div>
              <label htmlFor="code" className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">
                Code
              </label>
              <div data-color-mode="dark">
                <MDEditor
                  value={formData.code}
                  onChange={(value) => {
                    setFormData(prev => ({
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="time_complexity" className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">
                  Time Complexity
                </label>
                <input
                  type="text"
                  id="time_complexity"
                  name="time_complexity"
                  value={formData.time_complexity}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g., O(n)"
                />
              </div>

              <div>
                <label htmlFor="space_complexity" className="block text-sm font-medium mb-1 text-slate-900 dark:text-slate-200">
                  Space Complexity
                </label>
                <input
                  type="text"
                  id="space_complexity"
                  name="space_complexity"
                  value={formData.space_complexity}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:border-teal-500 dark:focus:border-teal-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="e.g., O(1)"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-4">
              <Link
                href={`/problems/${problemId}`}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Adding Solution...' : 'Add Solution'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}