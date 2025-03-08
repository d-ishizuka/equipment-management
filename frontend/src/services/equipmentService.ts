import api from './api';
import { Equipment } from '../types/models';

export const equipmentService = {
  getAll: async (): Promise<Equipment[]> => {
    const response = await api.get('equipments/');
    return response.data;
  },
  
  getById: async (id: number): Promise<Equipment> => {
    const response = await api.get(`equipments/${id}/`);
    return response.data;
  },
  
  create: async (equipment: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.post('equipments/', equipment);
    return response.data;
  },
  
  update: async (id: number, equipment: Partial<Equipment>): Promise<Equipment> => {
    const response = await api.put(`equipments/${id}/`, equipment);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await api.delete(`equipments/${id}/`);
  }
};

export default equipmentService;