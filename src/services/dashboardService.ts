import axios from 'axios'

export const dashboardService = {
  getDashboardStats(authHeader: string, username?: string) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    const url = username ? `${apiUrl}/dashboard?username=${encodeURIComponent(username)}` : `${apiUrl}/dashboard`;
    
    return axios.get(url, {
      headers: {
        Authorization: authHeader
      }
    });
  }
}
