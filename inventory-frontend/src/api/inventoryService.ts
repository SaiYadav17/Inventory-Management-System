import axiosInstance from './axiosConfig';

export const getInventory = async () => {
    const response = await axiosInstance.get('/inventory');
    return response.data;
};

export const createInventory = async (itemData: any) => {
    const response = await axiosInstance.post('/inventory', itemData);
    return response.data;
};

export const updateInventory = async (id: string, itemData: any) => {
    const response = await axiosInstance.put(`/inventory/${id}`, itemData);
    return response.data;
};

export const deleteInventory = async (id: string) => {
    const response = await axiosInstance.delete(`/inventory/${id}`);
    return response.data;
};
