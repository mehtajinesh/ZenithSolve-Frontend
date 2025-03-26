import { apiClient } from './config';
import { Problem } from '@/types/problem';

export const problemsService = {
  getProblems: async (): Promise<Problem[]> => {
    try {
      const { data } = await apiClient.get<Problem[]>('/problems/');
      return data;
    } catch (error:any) {
      console.error('Error fetching problems:', error);
      throw new Error('Failed to get problems: ' + error);
    }
  },

  getProblemById: async (id: string): Promise<Problem | null> => {
    try {
      const { data } = await apiClient.get<Problem>(`/problems/${id}`);
      return data;
    } catch (error:any) {
      console.error('Error fetching problems:', error);
      throw new Error('Failed to get problems: ' + error);
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
      const { data } = await apiClient.post(
        `/problems/${problemId}/solutions`, 
        JSON.stringify(solution)
      );
      return data;
    } catch (error:any) {
      throw new Error('Failed to add solution: ' + error.response.data.detail.error);
    }
  },

  updateSolution: async (problemId: string, solutionId: string, solution: {
    name: string;
    description: string;
    code: string;
    time_complexity: string;
    space_complexity: string;
  }) => {
    try {
      const { data } = await apiClient.put(
        `/problems/${problemId}/solutions/${solutionId}`,
        JSON.stringify(solution)
      );
      return data;
    } catch (error: any) {
      throw new Error('Failed to update solution: ' + (error.response?.data?.detail?.error || error.message));
    }
  },

  deleteSolution: async (problemId: string, solutionId: string) => {
    try {
      const { data } = await apiClient.delete(`/problems/${problemId}/solutions/${solutionId}`);
      return data;
    } catch (error: any) {
      throw new Error('Failed to delete solution: ' + (error.response?.data?.detail?.error || error.message));
    }
  },

  updateProblem: async (problemId: string, problemData: Partial<Problem>): Promise<Problem> => {
    try {
      const { data } = await apiClient.put(
        `/problems/${problemId}`,
        JSON.stringify(problemData)
      );
      return data;
    } catch (error: any) {
      throw new Error('Failed to update problem: ' + (error.response?.data?.detail?.error || error.message));
    }
  },

  createProblem: async (problem: Problem): Promise<Problem> => {
    try {
      const { data } = await apiClient.post('/problems/', problem);
      return data;
    } catch (error:any) {
      throw new Error('Failed to create problem: ' + error.response.data.detail.error);
    }
  }
};