import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { categoriesService } from "@/services/api/categories";

// Custom toast styles for consistent UX
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

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: string[];
}

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categories,
}: DeleteCategoryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(categories.length > 0 ? categories[0] : "");
    }
  }, [isOpen, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      toast.error("Please select a category to delete", toastStyles.error);
      return;
    }

    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete the category "${selectedCategory}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Deleting category...", toastStyles.loading);
    
    try {
      await categoriesService.deleteCategory(selectedCategory);
      toast.success("Category deleted successfully!", { id: toastId, ...toastStyles.success });
      onSuccess();
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete category';
      toast.error(errorMessage, { id: toastId, ...toastStyles.error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-800 rounded-lg p-6 w-full max-w-md shadow-xl"
          >
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
              Delete Category
            </h2>
            <p className="mb-4 text-slate-700 dark:text-slate-300">
              Select a category to delete. This action cannot be undone.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="selectedCategory"
                  className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1"
                >
                  Select Category
                </label>
                <select
                  id="selectedCategory"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-500 disabled:bg-red-400 dark:disabled:bg-red-700"
                >
                  {loading ? "Deleting..." : "Delete"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}