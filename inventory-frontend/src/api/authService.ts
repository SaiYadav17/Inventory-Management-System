import axiosInstance from './axiosConfig';

export const login = async (email: string, password: String) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    if (response.data) {
        localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
};

export const register = async (name: string, email: string, password: String, role?: string) => {
    const response = await axiosInstance.post('/auth/register', { name, email, password, role });
    if (response.data) {
        localStorage.setItem('userInfo', JSON.stringify(response.data));
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('userInfo');
};
