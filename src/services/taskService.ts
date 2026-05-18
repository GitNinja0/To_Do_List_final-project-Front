import axios from 'axios'

export const taskService = {
  getAllTasks(authHeader: string) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.get(`${apiUrl}/task`, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  searchTasks(authHeader: string, params: any) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.get(`${apiUrl}/task/search`, {
      headers: {
        Authorization: authHeader
      },
      params: params
    });
  },

  createTask(authHeader: string, dto: any) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.post(`${apiUrl}/task`, dto, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  updateTask(authHeader: string, id: number, dto: any) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.put(`${apiUrl}/task/${id}`, dto, {
      headers: {
        Authorization: authHeader
      }
    });
  }
}
