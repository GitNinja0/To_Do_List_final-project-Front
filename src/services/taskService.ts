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
  },

  deleteTask(authHeader: string, id: number) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.delete(`${apiUrl}/task/${id}`, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  searchTasksByTag(authHeader: string, tag: string) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.get(`${apiUrl}/task/by-tag`, {
      headers: {
        Authorization: authHeader
      },
      params: { tag }
    });
  },

  addTagToTask(authHeader: string, taskId: number, tagId: number) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.put(`${apiUrl}/task/${taskId}/tags/${tagId}`, {}, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  removeTagFromTask(authHeader: string, taskId: number, tagId: number) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.delete(`${apiUrl}/task/${taskId}/tags/${tagId}`, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  replaceTagOnTask(authHeader: string, taskId: number, oldTagId: number, newTagId: number) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.put(`${apiUrl}/task/${taskId}/tags/${oldTagId}/replace/${newTagId}`, {}, {
      headers: {
        Authorization: authHeader
      }
    });
  }
}
