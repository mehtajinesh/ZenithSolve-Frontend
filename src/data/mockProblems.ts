import { Problem } from "@/components/problem/ProblemCard";

export const mockProblems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    difficulty: "Easy",
    categories: ["Array", "Hash Table"],
    realWorldApplications: [
      {
        industry: "E-commerce",
        description: "Finding pairs of items in a shopping cart that combine for a specific discount threshold.",
        impact: "Improves checkout optimization by 27%"
      },
      {
        industry: "Finance",
        description: "Identifying pairs of transactions that might indicate fraud when they sum to certain values.",
        impact: "Reduces fraud detection time by 35%"
      }
    ],
    likes: 542,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },
  {
    id: "longest-substring-without-repeating",
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    categories: ["String", "Sliding Window", "Hash Table"],
    realWorldApplications: [
      {
        industry: "Data Compression",
        description: "Finding patterns in data to improve compression algorithms by identifying non-repeating sequences.",
        impact: "Enhances compression ratios by up to 15%"
      },
      {
        industry: "Cybersecurity",
        description: "Analyzing network traffic for unusual patterns that might indicate security breaches.",
        impact: "Improves intrusion detection accuracy by 22%"
      }
    ],
    likes: 425,
    timeComplexity: "O(n)",
    spaceComplexity: "O(min(m,n))"
  },
  {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    description: "Given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    difficulty: "Hard",
    categories: ["LinkedList", "Divide and Conquer", "Heap"],
    realWorldApplications: [
      {
        industry: "Search Engines",
        description: "Combining sorted search results from multiple sources to create a unified, relevance-sorted list.",
        impact: "Reduces result consolidation time by 45%"
      },
      {
        industry: "Big Data",
        description: "Merging sorted data streams from distributed systems for unified processing.",
        impact: "Decreases data processing latency by 30%"
      }
    ],
    likes: 378,
    timeComplexity: "O(N log k)",
    spaceComplexity: "O(k)"
  },
  {
    id: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    description: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
    difficulty: "Medium",
    categories: ["Tree", "Breadth-First Search", "Binary Tree"],
    realWorldApplications: [
      {
        industry: "Networking",
        description: "Network topology analysis to process nodes at the same distance from a central server simultaneously.",
        impact: "Optimizes network traffic by 18%"
      },
      {
        industry: "UI Rendering",
        description: "Processing UI component trees to render elements at the same hierarchy level together.",
        impact: "Improves rendering performance by 25%"
      }
    ],
    likes: 315,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    difficulty: "Hard",
    categories: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
    realWorldApplications: [
      {
        industry: "Urban Planning",
        description: "Modeling water accumulation in city landscapes to plan drainage systems.",
        impact: "Reduces urban flooding incidents by 40%"
      },
      {
        industry: "Reservoir Management",
        description: "Calculating potential water storage capacity in uneven terrain for reservoir planning.",
        impact: "Increases storage efficiency by 22%"
      }
    ],
    likes: 405,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  },
  {
    id: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    description: "Given a string s, return the longest palindromic substring in s.",
    difficulty: "Medium",
    categories: ["String", "Dynamic Programming"],
    realWorldApplications: [
      {
        industry: "Bioinformatics",
        description: "Finding palindromic sequences in DNA that might indicate genetic markers or regulatory elements.",
        impact: "Accelerates genetic analysis by 32%"
      },
      {
        industry: "Text Processing",
        description: "Identifying meaningful palindromes in large text corpora for linguistic analysis.",
        impact: "Enhances natural language processing accuracy by 14%"
      }
    ],
    likes: 367,
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)"
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if open brackets are closed by the same type of brackets and in the correct order.",
    difficulty: "Easy",
    categories: ["String", "Stack"],
    realWorldApplications: [
      {
        industry: "Software Development",
        description: "Validating syntax in code editors to ensure properly matched brackets, parentheses, and braces.",
        impact: "Reduces syntax errors by 48%"
      },
      {
        industry: "Mathematical Expression Parsing",
        description: "Ensuring valid nested structures in mathematical or logical expressions.",
        impact: "Improves expression evaluation accuracy by 37%"
      }
    ],
    likes: 298,
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)"
  },
  {
    id: "word-search",
    title: "Word Search",
    description: "Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.",
    difficulty: "Medium",
    categories: ["Array", "Backtracking", "Matrix"],
    realWorldApplications: [
      {
        industry: "Gaming",
        description: "Powering word search games and puzzles with efficient grid traversal algorithms.",
        impact: "Enhances game responsiveness by 23%"
      },
      {
        industry: "Image Processing",
        description: "Finding specific patterns or features in image pixel matrices.",
        impact: "Accelerates feature detection by 19%"
      }
    ],
    likes: 287,
    timeComplexity: "O(m*n*4^L)",
    spaceComplexity: "O(L)"
  },
  {
    id: "lru-cache",
    title: "LRU Cache",
    description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement the LRUCache class that supports getting and setting key-value pairs with O(1) complexity.",
    difficulty: "Medium",
    categories: ["Hash Table", "Linked List", "Design"],
    realWorldApplications: [
      {
        industry: "Web Browsers",
        description: "Managing browser cache to store recently visited pages for quick access.",
        impact: "Reduces page load times by 65%"
      },
      {
        industry: "Database Systems",
        description: "Implementing query result caching to avoid redundant expensive computations.",
        impact: "Improves query performance by 43%"
      }
    ],
    likes: 324,
    timeComplexity: "O(1)",
    spaceComplexity: "O(capacity)"
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    description: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.",
    difficulty: "Medium",
    categories: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
    realWorldApplications: [
      {
        industry: "Education",
        description: "Planning academic curricula to ensure prerequisite courses are taken in the correct order.",
        impact: "Optimizes student graduation paths by 28%"
      },
      {
        industry: "Project Management",
        description: "Detecting dependency cycles in task scheduling to prevent deadlocks.",
        impact: "Reduces project timeline bottlenecks by 34%"
      }
    ],
    likes: 276,
    timeComplexity: "O(V+E)",
    spaceComplexity: "O(V+E)"
  },
  {
    id: "merge-intervals",
    title: "Merge Intervals",
    description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    difficulty: "Medium",
    categories: ["Array", "Sorting"],
    realWorldApplications: [
      {
        industry: "Calendar Applications",
        description: "Consolidating overlapping meetings or events to find available time slots.",
        impact: "Improves scheduling efficiency by 29%"
      },
      {
        industry: "Network Traffic Analysis",
        description: "Combining overlapping data packet timestamps to identify continuous communication sessions.",
        impact: "Enhances traffic pattern detection by 21%"
      }
    ],
    likes: 312,
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)"
  },
  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    difficulty: "Easy",
    categories: ["Array", "Divide and Conquer", "Dynamic Programming"],
    realWorldApplications: [
      {
        industry: "Finance",
        description: "Analyzing stock price movements to find the most profitable buying and selling periods.",
        impact: "Increases investment return analysis accuracy by 31%"
      },
      {
        industry: "Signal Processing",
        description: "Identifying strongest signal segments in noisy data streams.",
        impact: "Improves signal detection by 26%"
      }
    ],
    likes: 359,
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)"
  }
];