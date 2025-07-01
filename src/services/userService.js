import api from "./api";
export const fetchUserData = async () => {
     const response = await api.get('/user');
     return response;
}

