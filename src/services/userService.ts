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
  },

  changeFullName(authHeader: string, id: number, dto: { fullname: string }) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.put(`${apiUrl}/users/changeFullName/${id}`, dto, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  updateProfile(authHeader: string, dto: { fullname: string, email: string }) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.put(`${apiUrl}/user/profile`, dto, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  changePassword(authHeader: string, id: number, dto: any) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.put(`${apiUrl}/users/changePassword/${id}`, dto, {
      headers: {
        Authorization: authHeader
      }
    });
  },

  changeRole(authHeader: string, id: number, dto: any) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.put(`${apiUrl}/roles/changeRole/${id}`, dto, {
      headers: {
        Authorization: authHeader
      }
    });
  }
}
