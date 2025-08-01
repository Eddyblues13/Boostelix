import api from './api';

// // User Auth Services
// export const userLogin = async (credentials) => {
//   const response = await api.post('/login', credentials);
//   localStorage.setItem('userToken', response.data.token);
//   localStorage.setItem('userData', JSON.stringify(response.data.user));
//   return response.data;
// };

// export const userLogout = async () => {
//   await api.post('/logout');
//   localStorage.removeItem('userToken');
//   localStorage.removeItem('userData');
// };

// Admin Auth Services
export const adminLogin = async (credentials) => {
  const response = await api.post('/admin/login', credentials);
  localStorage.setItem('adminToken', response.data.token);
  localStorage.setItem('adminData', JSON.stringify(response.data.admin));
  return response.data;
};

export const adminLogout = async () => {
  await api.post('/admin/logout');
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminData');
};