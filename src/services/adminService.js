import api from "./api";

export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/login', {
    email: email.trim(),
    password,
  });
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

