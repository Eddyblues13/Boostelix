import api from "./api";
export const fetchSmmCategories = async () => {
     const response = await api.get('/categories');
     return response;
}

export const fetchSmmServices = async (categoryId) => {
    const response = await api.get(`/services?category_id=${categoryId}`);
     return response;
}