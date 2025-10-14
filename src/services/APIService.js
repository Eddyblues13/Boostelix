import api from "./api";

// API Key Management
export const generateApiKey = async () => {
  try {
    const response = await api.post('/v2/generate-key');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Service Methods
export const fetchSmmServices = async (params = {}) => {
  try {
    const response = await api.post('/v2/services', {
      key: localStorage.getItem('api_key'),
      action: 'services',
      ...params
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Order Methods
export const placeApiOrder = async (orderData) => {
  try {
    const response = await api.post('/v2/orders', {
      key: localStorage.getItem('api_key'),
      action: 'add',
      ...orderData
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const checkOrderStatus = async (orderId) => {
  try {
    const response = await api.post('/v2/orders/status', {
      key: localStorage.getItem('api_key'),
      action: 'status',
      order: orderId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const checkMultiOrderStatus = async (orderIds) => {
  try {
    const response = await api.post('/v2/orders/multi-status', {
      key: localStorage.getItem('api_key'),
      action: 'multi-status',
      orders: orderIds.join(',')
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const requestRefill = async (orderId) => {
  try {
    const response = await api.post('/v2/refill', {
      key: localStorage.getItem('api_key'),
      action: 'refill',
      order: orderId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Balance Methods
export const getApiBalance = async () => {
  try {
    const response = await api.post('/v2/balance', {
      key: localStorage.getItem('api_key'),
      action: 'balance'
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Order History
export const fetchApiOrderHistory = async ({ status, search, page }) => {
  try {
    const response = await api.post('/v2/orders/history', {
      key: localStorage.getItem('api_key'),
      action: 'history',
      status,
      search,
      page
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Keep your existing non-API methods
export const fetchUserData = async () => {
  const response = await api.get('/user');
  return response.data;
};

export const fetchAllUpdates = async () => {
  const response = await api.get("/updates");
  return response.data;
};

export const initiatePayment = async (paymentData) => {
  const response = await api.post('/payment/initiate', paymentData);
  return response.data;
};

export const verifyPayment = async (data) => {
  const response = await api.post('/payment/callback', data);
  return response.data;
}; 

export const paymentHistory = async () => {
  const response = await api.get("/payment/history");
  return response.data;
};

export const fetchSmmCategories = async () => {
  const response = await api.get('/all-smm-categories');
  return response.data;
};

export const fetchNewServices = async () => {
  const response = await api.get('/all-smm-services');
  return response.data;
};

export const fetchRecommendedServices = async () => {
  const response = await api.get('/recommended-services');
  return response.data;
};

// Affiliate methods remain the same