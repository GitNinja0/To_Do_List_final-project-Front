import axios from 'axios'

export const userService = {
  getAllUsers(authHeader: string) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.get(`${apiUrl}/users/`, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  promoteUser(authHeader: string, id: number) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.post(`${apiUrl}/users/${id}/promote`, {}, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  demoteUser(authHeader: string, id: number) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.post(`${apiUrl}/users/${id}/demote`, {}, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  deleteUser(authHeader: string, id: number) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.delete(`${apiUrl}/users/${id}`, {
      headers: {
        Authorization: authHeader
      }
    });
  }
}
