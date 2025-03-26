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

interface UpdateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: string[];
}

export default function UpdateCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  categories,
}: UpdateCategoryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedCategory(categories.length > 0 ? categories[0] : "");
      setNewCategoryName("");
    }
  }, [isOpen, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory) {
      toast.error("Please select a category to update", toastStyles.error);
      return;
    }
    
    if (!newCategoryName.trim()) {
      toast.error("New category name cannot be empty", toastStyles.error);
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating category...", toastStyles.loading);
    
    try {
      await categoriesService.updateCategory(selectedCategory, newCategoryName.trim());
      toast.success("Category updated successfully!", { id: toastId, ...toastStyles.success });
      onSuccess();
      onClose();
      setNewCategoryName("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update category';
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
              Update Category
            </h2>
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
              <div>
                <label
                  htmlFor="newCategoryName"
                  className="block text-sm font-medium text-slate-900 dark:text-slate-200 mb-1"
                >
                  New Category Name
                </label>
                <input
                  type="text"
                  id="newCategoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-teal-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-200"
                  placeholder="Enter new category name"
                  required
                />
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
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 dark:hover:bg-teal-500 disabled:bg-teal-400 dark:disabled:bg-teal-700"
                >
                  {loading ? "Updating..." : "Update"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}