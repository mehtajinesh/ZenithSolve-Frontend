import { apiClient } from './config';

export const categoriesService = {
  getCategories: async (): Promise<string[]> => {
    try {
      const { data } = await apiClient.get<string[]>('/categories');
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }
};