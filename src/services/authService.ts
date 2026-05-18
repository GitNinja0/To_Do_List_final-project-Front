import axios from 'axios'

export const authService = {
  
  login(credentials: string) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    // credentials should be "Basic " + btoa(username + ":" + password)
    console.log(apiUrl + '/auth/login');
    return axios.get(apiUrl + '/auth/login', {
      headers: {
        Authorization: credentials
      }
    })
    
  },
  
  register(userData: any) {
    const apiUrl = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080/to-do-list';
    
    return axios.post(apiUrl + '/auth/register', userData)
  }
}
