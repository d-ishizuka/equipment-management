import api from './api';
import { Location } from '../types/models';

// 場所に関するAPIサービス
export const locationService = {
  // 場所の一覧を取得
  getAll: async (): Promise<Location[]> => {
    try {
      const response = await api.get('locations/');
      return response.data;
    } catch (error) {
      console.error('場所の取得中にエラーが発生しました:', error);
      throw error;
    }
  },

  // 特定の場所を取得
  getById: async (id: number): Promise<Location> => {
    try {
      const response = await api.get(`locations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`ID ${id} の場所取得中にエラーが発生しました:`, error);
      throw error;
    }
  },

  // 新しい場所を作成
  create: async (location: Location): Promise<Location> => {
    try {
      const response = await api.post('locations/', location);
      return response.data;
    } catch (error) {
      console.error('場所の作成中にエラーが発生しました:', error);
      throw error;
    }
  },

  // 既存の場所を更新
  update: async (id: number, location: Location): Promise<Location> => {
    try {
      const response = await api.put(`locations/${id}`, location);
      return response.data;
    } catch (error) {
      console.error(`ID ${id} のカテゴリ更新中にエラーが発生しました:`, error);
      throw error;
    }
  },

  // 場所を削除
  delete: async (id: number): Promise<void> => {
    try{
      await api.delete(`locations/${id}/`);
    } catch (error) {
      console.error(`ID ${id}の場所削除中にエラーが発生しました:`, error);
      throw error;
    }
  }
};

export default locationService;