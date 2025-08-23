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

//user ticket 
export const createTicket = async (ticketData) => {
  try {
    const response = await api.post('/tickets', ticketData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

//user ticket history
export const fetchUserTickets = async () => {
  try {
    const response = await api.get('/ticketshistory');
    console.log('Tickets from API:', response.data.tickets); // ✅ Confirm structure
    return response.data.tickets;
  } catch (error) {
    console.error('Error fetching tickets history:', error);
    return [];
  }
};




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
  
    });
    return response;
  } catch (error) {
    console.error('Error fetching recommended services:', error);
    throw error;
  }
};


export const fetchApiProviders = async () => {
     return await api.get("/admin/providers");
}

export const fetchServicesFromProvider = async (provider) => {
     return await api.post("/admin/providers/services/all", {
          provider
     });
}

export const importSelectedServices = (providerId, selectedServices) => {
  return api.post('/admin/providers/services/save', {
    api_provider_id: providerId,
    services: selectedServices,
  });
};

export const fetchCurrencies = async () => {
  return await api.get("/currencies");
};



