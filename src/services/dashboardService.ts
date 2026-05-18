import axios from 'axios'

export const dashboardService = {
  getDashboardStats(authHeader: string) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.get(`${apiUrl}/dashboard`, {
      headers: {
        Authorization: authHeader
      }
    });
  }
}
