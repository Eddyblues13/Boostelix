import api from "./api";

export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/login', {
    email: email.trim(),
    password,
  });
  return response.data;
};

export const AdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};


export const fetchApiProviders = async () => {
  const response = await api.get('/admin/providers');
  return response.data.data;
};

export const fetchApiProviderDetails = async (id) => {
  const response = await api.get(`/admin/providers/${id}`);
  return response.data;
};

export const createApiProvider = async (providerData) => {
  const response = await api.post('/admin/providers/', providerData);
  return response.data;
};

export const updateApiProvider = async (id, providerData) => {
  const response = await api.put(`/admin/providers/${id}`, providerData);
  return response.data.data;
};

export const deleteApiProvider = async (id) => {
  const response = await api.delete(`/admin/providers/${id}`);
  return response.data;
};

export const toggleApiProviderStatus = async (id) => {
  const response = await api.patch(`/admin/providers/${id}/toggle-status`);
  return response.data;
};

export const syncApiProviderServices = async (id) => {
  const response = await api.post(`/admin/providers/${id}/sync-services`);
  return response.data;
};


export const sendEmailToUser = async (userId, subject, message) => {
  const response = await api.post(`/admin/users/${userId}/send-email`, {
    subject: subject.trim(),
    message: message.trim(),
  })
  return response.data
}





export const setCustomRateForUser = async (userId, service, rate, type) => {
  const response = await api.post(`/admin/users/${userId}/custom-rate`, {
    service,
    rate,
    type,
  });
  return response.data;
}



export const fetchUsers = async () => {
  const response = await api.get(`/admin/users`);
  return response.data;
};


export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const adjustUserBalance = async ({ user_id, amount, type, note = "" }) => {
  const response = await api.post("/admin/users/balance-adjust", {
    user_id,
    amount,
    type,
    note,
  })

  return response.data
};



// Fetch user orders
export const fetchUserOrders = async (userId) => {
  const response = await api.get(`/admin/users/${userId}/orders`);
  return response.data;
};

// Fetch all categories
export const fetchCategories = async () => {
  const response = await api.get(`/admin/users/categories`);
  return response.data;
};

// Fetch all services
export const fetchServices = async () => {
  const response = await api.get(`/admin/users/services`);
  return response.data;
};



export const deleteOrder = async (id) => {
  const res = await api.delete(`/orders/${id}`)
  return res.data
}

export const updateOrder = async (order) => {
  const res = await api.put(`/orders/${order.id}`, order)
  return res.data
}

export const updateOrderStatus = async (id, status, statusDescription, reason) => {
  const res = await api.patch(`/orders/${id}/status`, {
    status,
    statusDescription,
    reason,
  })
  return res.data
}



// Fetch user orders
export const fetchUserTransactions = async (userId) => {
  const response = await api.get(`/admin/users/${userId}/transactions`);
  return response.data;
};


export const sendEmailToAllUsers = async (subject, message) => {
  const response = await api.post('/admin/send-email-all', {
    subject,
    message,
  });
  return response.data;
}


// Fetch all support tickets for admin

export const fetchAdminTickets = async () => {
  const response = await api.get(`/admin/tickets`);
  return response.data.tickets;
};
export const fetchAllOrders = async () => {
  const response = await api.get(`/admin/orders`);
  return response;
};




// Transactions
export const fetchTransactions = async (params = {}) => {
  try {
    // Clean up params
    const cleanedParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
        cleanedParams[key] = params[key];
      }
    });

    const response = await api.get('/admin/transactions', { 
      params: cleanedParams,
      validateStatus: (status) => status < 500
    });
    
    // Ensure consistent response structure
    return {
      data: response.data?.data || [],
      current_page: response.data?.current_page || 1,
      last_page: response.data?.last_page || 1,
      per_page: response.data?.per_page || 15,
      total: response.data?.total || 0
    };
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return {
      data: [],
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0
    };
  }
};

export const fetchTransactionDetails = async (id) => {
  const response = await api.get(`/admin/transactions/${id}`);
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post('/admin/transactions', transactionData);
  return response.data;
};

export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/admin/transactions/${id}`, transactionData);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/admin/transactions/${id}`);
  return response.data;
};

export const changeTransactionStatus = async (id, status) => {
  const response = await api.patch(`/admin/transactions/${id}/status`, { status });
  return response.data;
};

export const fetchTransactionStats = async () => {
  const response = await api.get('/admin/transactions/stats');
  return response.data;
};


export const getAdminSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateAdminProfile = async (profileData) => {
  const response = await api.put('/admin/settings/profile', profileData);
  return response.data;
};

export const updateAdminSecurity = async (securityData) => {
  const response = await api.put('/admin/settings/security', securityData);
  return response.data;
};

export const getAdminActivityLogs = async () => {
  const response = await api.get('/admin/settings/activity');
  return response.data;
};


//service update
export const createServiceUpdate = async (updateData) => {
  const response = await api.post('/admin/service-updates', updateData)
  return response.data
}




export const ServiceUpdateHistory = async () => {
  try {
    const response = await api.get('/admin/service-update-history')
    // Handle both wrapped and direct data responses
    return {
      data: response.data?.data || response.data || []
    }
  } catch (error) {
    console.error('Error fetching service update history:', error);
    return {
      data: []
    }
  }
}



export const increaseServicePrices = async (payload) => {
  const response = await api.post('/admin/services/increase-prices', payload)
  return response.data
}

export const getServicePriceStats = async (params = {}) => {
  const response = await api.get('/admin/services/price-stats', { params })
  return response.data
}



