import api from "./api";
export const fetchUserData = async () => {
     const response = await api.get('/user');
     return response;
}


export const fetchAllUpdates = async () => {
    const response = await api.get("/updates");
     return response;
}

export const initiatePayment = async (paymentData) => {
  try {
    const response = await api.post('/payment/initiate', paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const paymentHistory = async () => {
    const response = await api.get("/payment/history");
     return response;
}




export const fetchOrderHistory = async ({ status, search, page }) => {
  try {
    const params = {
      page,
      ...(status && { status }),
      ...(search && { search }),
    };

    const response = await api.get("/orders/history", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const fetchSmmCategories = async () => {
  const response = await api.get('/all-smm-categories');
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


export const fetchAffiliateData = async () => {
  try {
    const response = await api.get('/affiliate');
    return response.data;
  } catch (error) {
    console.error('Affiliate fetch error:', error.response?.data || error.message);
    throw error;
  }
};

export const generateAffiliateLink = async () => {
  try {
    const response = await api.post('/affiliate/generate-link');
    return response.data;
  } catch (error) {
    console.error('Affiliate link generation error:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchAffiliateStats = async () => {
  try {
    const response = await api.get('/affiliate/stats');
    return response.data;
  } catch (error) {
    console.error('Affiliate stats fetch error:', error.response?.data || error.message);
    throw error;
  }
};

export const fetchAffiliatePayouts = async () => {
  try {
    const response = await api.get('/affiliate/payouts');
    return response.data;
  } catch (error) {
    console.error('Affiliate payouts fetch error:', error.response?.data || error.message);
    throw error;
  }
};

export const requestAffiliatePayout = async () => {
  try {
    const response = await api.post('/affiliate/request-payout');
    return response.data;
  } catch (error) {
    console.error('Affiliate payout request error:', error.response?.data || error.message);
    throw error;
  }
};




