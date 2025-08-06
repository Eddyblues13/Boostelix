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

