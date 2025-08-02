import api from "./api";
export const fetchSmmCategories = async () => {
     const response = await api.get('/categories');
     return response;
}

export const fetchSmmServices = async (categoryId) => {
    const response = await api.get(`/services?category_id=${categoryId}`);
     return response;
} 

export const fetchAllSmmServices = async () => {
    const response = await api.get("/all-services");
     return response;
}

export const fetchApiProviders = async () => {
     return await api.get("/admin/providers/api-providers");
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
