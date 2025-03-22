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

export async function fetchProblems(): Promise<Problem[]> {
  try {
    const response = await fetch('http://0.0.0.0:8000/problems/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const problems: Problem[] = await response.json();
    return problems;
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch('http://0.0.0.0:8000/categories');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const categories: string[] = await response.json();
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}