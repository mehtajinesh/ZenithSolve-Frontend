export interface Problem {
  slug_id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  categories: string[];
  description: string;
  constraints: string;
  clarifying_questions: string[];
  solution_approach?: string;
  solutions?: Array<{
    name: string;
    description: string;
    code: string;
    time_complexity: string;
    space_complexity: string;
  }>;
  real_world_applications?: Array<{
    industry: string;
    description: string;
    impact: string;
  }>;
  examples: string[];
  best_time_complexity?: string;
  best_space_complexity?: string;
}