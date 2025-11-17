import api from "./api";

// Cache for categories and services
let categoriesCache = null;
let allServicesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const fetchSmmCategories = async () => {
  // Return cached data if available and not expired
  if (categoriesCache && cacheTimestamp && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    return { data: { data: categoriesCache } };
  }

  try {
    const response = await api.get('/categories');
    if (response.data.success) {
      categoriesCache = response.data.data;
      cacheTimestamp = Date.now();
    }
    return response;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export const fetchSmmServices = async (categoryId) => {
  const cacheKey = `services_${categoryId}`;
  const cached = sessionStorage.getItem(cacheKey);
  
  if (cached) {
    return { data: { data: JSON.parse(cached) } };
  }

  try {
    const response = await api.get(`/services?category_id=${categoryId}`);
    
    // Cache in sessionStorage for this browser session
    if (response.data.data) {
      sessionStorage.setItem(cacheKey, JSON.stringify(response.data.data));
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

// Fast search endpoint
export const searchServicesFast = async (searchQuery, limit = 20) => {
  if (!searchQuery || searchQuery.trim().length < 2) {
    return { data: { data: [] } };
  }

  try {
    const response = await api.get(`/services/search?q=${encodeURIComponent(searchQuery.trim())}&limit=${limit}`);
    return response;
  } catch (error) {
    console.error('Error searching services:', error);
    return { data: { data: [] } };
  }
}

// Debounced search function
let searchTimeout;
export const debouncedSearch = (searchQuery, callback, delay = 300) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    if (searchQuery && searchQuery.trim().length >= 2) {
      try {
        const response = await searchServicesFast(searchQuery);
        callback(response.data.data || []);
      } catch (error) {
        console.error('Search error:', error);
        callback([]);
      }
    } else {
      callback([]);
    }
  }, delay);
};

// Clear cache function
export const clearServicesCache = () => {
  categoriesCache = null;
  allServicesCache = null;
  cacheTimestamp = null;
  
  // Clear sessionStorage cache
  Object.keys(sessionStorage).forEach(key => {
    if (key.startsWith('services_')) {
      sessionStorage.removeItem(key);
    }
  });
};

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
    return response.data.data;
  } catch (error) {
    console.error('Error fetching order history:', error);
    throw error;
  }
}

export const fetchAllSmmServices = async () => {
  try {
    const response = await api.get("/all-services");
    return response;
  } catch (error) {
    console.error('Error fetching all services:', error);
    throw error;
  }
}

export const fetchNewServices = async () => {
  try {
    const response = await api.get('/all-smm-services', {
      params: { is_new: true, per_page: 20 }
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
      params: { is_recommended: true, per_page: 20 }
    });
    return response;
  } catch (error) {
    console.error('Error fetching recommended services:', error);
    throw error;
  }
};

export const fetchApiProviders = async () => {
  try {
    return await api.get("/admin/providers");
  } catch (error) {
    console.error('Error fetching API providers:', error);
    throw error;
  }
}

export const fetchServicesFromProvider = async (provider) => {
  try {
    return await api.post("/admin/providers/services/all", {
      provider
    });
  } catch (error) {
    console.error('Error fetching services from provider:', error);
    throw error;
  }
}

export const importSelectedServices = (providerId, selectedServices) => {
  return api.post('/admin/providers/services/save', {
    api_provider_id: providerId,
    services: selectedServices,
  });
};

export const fetchCurrencies = async () => {
  try {
    return await api.get("/currencies");
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};