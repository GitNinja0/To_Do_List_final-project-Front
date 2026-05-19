import axios from 'axios'

export const tagService = {
  getAllTags(authHeader: string) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.get(`${apiUrl}/tag`, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  getTagById(authHeader: string, id: number) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.get(`${apiUrl}/tag/${id}`, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  createTag(authHeader: string, dto: { name: string }) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.post(`${apiUrl}/tag`, dto, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  updateTag(authHeader: string, id: number, dto: { name: string }) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.put(`${apiUrl}/tag/${id}`, dto, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  deleteTag(authHeader: string, id: number) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.delete(`${apiUrl}/tag/${id}`, {
      headers: {
        Authorization: authHeader
      }
    });
  }
}
