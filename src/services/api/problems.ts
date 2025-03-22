import { apiClient } from './config';
import { Problem } from '@/types/problem';

export const problemsService = {
  getProblems: async (): Promise<Problem[]> => {
    try {
      const { data } = await apiClient.get<Problem[]>('/problems/');
      return data;
    } catch (error) {
      console.error('Error fetching problems:', error);
      return [];
    }
  },

  getProblemById: async (id: string): Promise<Problem | null> => {
    try {
      const { data } = await apiClient.get<Problem>(`/problems/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching problem ${id}:`, error);
      return null;
    }
  },

  addSolution: async (problemId: string, solution: {
    name: string;
    description: string;
    code: string;
    time_complexity: string;
    space_complexity: string;
  }) => {
    try {
      const { data } = await apiClient.post(`/problems/${problemId}/solutions`, JSON.stringify(solution));
      return data;
    } catch (error) {
      console.error('Error adding solution:', error);
      throw error;
    }
  }
};