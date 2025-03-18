export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  categories: string[];
  description: string;
  solutionApproach?: string;
  pythonSolutions?: Array<{
    name: string;
    description: string;
    code: string;
    timeComplexity: string;
    spaceComplexity: string;
  }>;
  sqlSolution?: string;
  schemaInfo?: string;
  realWorldApplications?: (string | { industry: string; description: string; impact: string; })[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  timeComplexity?: string;
  spaceComplexity?: string;
  bestTimeComplexity?: string;
  bestSpaceComplexity?: string;
}

export const mockProblems: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    categories: ['Array', 'Hash Table'],
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers in nums such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    solutionApproach: 'We can solve this problem using different approaches, each with its own trade-offs between time and space complexity.',
    bestTimeComplexity: 'O(n)',
    bestSpaceComplexity: 'O(n)',
    pythonSolutions: [
      {
        name: 'Hash Table Approach',
        description: 'We use a hash map to store the complement of each number we\'ve seen. As we iterate through the array, we check if the current number\'s complement exists in our hash map.',
        code: `def twoSum(self, nums: List[int], target: int) -> List[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []  # No solution found`,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
      },
      {
        name: 'Two-Pointer Approach',
        description: 'First sort the array and use two pointers from both ends. Move pointers based on if current sum is greater or lesser than target. Note: This approach needs to track original indices.',
        code: `def twoSum(self, nums: List[int], target: int) -> List[int]:
    # Create array of tuples with (number, index)
    nums_with_index = [(num, i) for i, num in enumerate(nums)]
    # Sort by number
    nums_with_index.sort(key=lambda x: x[0])
    left, right = 0, len(nums) - 1
    
    while left < right:
        current_sum = nums_with_index[left][0] + nums_with_index[right][0]
        if current_sum == target:
            return [nums_with_index[left][1], nums_with_index[right][1]]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []  # No solution found`,
        timeComplexity: 'O(n log n)',
        spaceComplexity: 'O(n)'
      },
      {
        name: 'Brute Force Approach',
        description: 'Check every possible pair of numbers in the array.',
        code: `def twoSum(self, nums: List[int], target: int) -> List[int]:
    n = len(nums)
    for i in range(n):
        for j in range(i + 1, n):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []  # No solution found`,
        timeComplexity: 'O(n²)',
        spaceComplexity: 'O(1)'
      }
    ],
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
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1].'
      }
    ]
  },
  {
    id: 'employee-salaries',
    title: 'Employee Highest Salaries',
    difficulty: 'Medium',
    categories: ['Database', 'SQL'],
    description: 'Write a SQL query to find the employees who earn more than their managers. Return the names of these employees.',
    solutionApproach: 'We can solve this using a self-join on the Employee table, joining each employee with their manager using the managerId field.',
    bestTimeComplexity: "O(n)",
    bestSpaceComplexity: "O(1)",
    schemaInfo: `CREATE TABLE Employee (
    id INT PRIMARY KEY,
    name VARCHAR(255),
    salary INT,
    managerId INT
);`,
    sqlSolution: `SELECT e1.name as Employee
FROM Employee e1
JOIN Employee e2 ON e1.managerId = e2.id
WHERE e1.salary > e2.salary;`,
    realWorldApplications: [
      {
        industry: "HR analytics and payroll management",
        description: "Helps HR teams analyze compensation data to ensure competitive and fair pay practices.",
        impact: "Enables better recruitment and retention by aligning compensation with market standards."
      },
      {
        industry: "Organizational hierarchy analysis",
        description: "Aids in mapping and understanding relationships within an organization for better decision-making.",
        impact: "Improves managerial oversight and operational efficiency through clear organizational structure insights."
      },
      {
        industry: "Compensation benchmarking and equity analysis",
        description: "Allows organizations to assess and compare employee compensation across different levels and markets.",
        impact: "Facilitates equitable salary distribution and reduces bias in compensation practices."
      }
    ],
    examples: [
      {
        input: `
Employee table:
+----+-------+--------+-----------+
| id | name  | salary | managerId |
+----+-------+--------+-----------+
| 1  | Joe   | 70000  | 3        |
| 2  | Henry | 80000  | 4        |
| 3  | Sam   | 60000  | NULL     |
| 4  | Max   | 90000  | NULL     |
+----+-------+--------+-----------+`,
        output: `
+----------+
| Employee |
+----------+
| Joe      |
+----------+`,
        explanation: 'Joe is the only employee who earns more than their manager. Joe earns 70000 while their manager Sam earns 60000.'
      }
    ]
  }
];