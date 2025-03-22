import { apiClient } from './config';


export const categoriesService = {
  getCategories: async (): Promise<string[]> => {
    try {
      const { data } = await apiClient.get<string[]>('/categories');
      return data;
    } catch (error:any) {
      throw new Error('Error fetching category: ' + error.response.data.detail.message);
    }
  },

  createCategory: async (name: string): Promise<void> => {
    try {
      await apiClient.post('/categories', { name });
    } catch (error:any) {
      throw new Error('Error creating category: ' + error.response.data.detail.message);
    }
  }
};