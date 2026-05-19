import axios from 'axios'

export const categoryService = {
  getAllCategories(authHeader: string) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.get(`${apiUrl}/categories`, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  createCategory(authHeader: string, dto: { name: string }) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.post(`${apiUrl}/manager/categories`, dto, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  updateCategory(authHeader: string, id: number, dto: { name: string }) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.put(`${apiUrl}/manager/categories/${id}`, dto, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  deleteCategory(authHeader: string, id: number) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.delete(`${apiUrl}/manager/categories/${id}`, {
      headers: {
        Authorization: authHeader
      }
    });
  }
}
