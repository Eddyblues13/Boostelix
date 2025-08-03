import api from "./api";

export const fetchSmmCategories = async () => {
  const response = await api.get('/categories');
  return response;
}

export const fetchSmmServices = async (categoryId) => {
  const response = await api.get(`/services?category_id=${categoryId}`);
  return response;
}

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}



export const fetchOrderHistory = async (params = {}) => {
  try {
    // Construct query parameters
    const queryParams = new URLSearchParams();
    
    // Add optional parameters if they exist
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.per_page) queryParams.append('per_page', params.per_page);
    
    const response = await api.get(`/orders/history?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
}



export const fetchAllSmmServices = async () => {
    const response = await api.get("/all-services");
     return response;
}




export const fetchNewServices = async () => {
  try {
    const response = await api.get('/all-smm-services', {
      params: {
        is_new: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching new services:', error);
    throw error;
  }
};

export const fetchRecommendedServices = async () => {
  try {
    const response = await api.get('/all-smm-services', {
      params: {
        is_recommended: true
      }
    });
    return response;
  } catch (error) {
    console.error('Error fetching recommended services:', error);
    throw error;
  }
};

