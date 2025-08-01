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



export const fetchAllSmmServices = async () => {
    const response = await api.get("/all-services");
     return response;
}

