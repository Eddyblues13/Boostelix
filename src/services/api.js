const api = axios.create({
  baseURL: import.meta.VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

export default api;