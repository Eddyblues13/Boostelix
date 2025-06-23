const api = axios.create({
  baseURL: 'https://some-domain.com/api/',
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  }
});

export default api;