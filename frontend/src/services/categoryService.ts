import api from './api';
import { Category } from '../types/models';

// カテゴリに関するAPIサービス
export const categoryService = {
  // カテゴリ一覧を取得
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get('categories/');
      return response.data;
    } catch (error) {
      console.error('カテゴリの取得中にエラーが発生しました:', error);
      throw error;
    }
  },

  // 特定のカテゴリを取得
  getById: async (id: number): Promise<Category> => {
    try {
      const response = await api.get(`categories/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`ID ${id} のカテゴリ取得中にエラーが発生しました:`, error);
      throw error;
    }
  },

  // 新しいカテゴリを作成
  create: async (category: Category): Promise<Category> => {
    try {
      const response = await api.post('categories/', category);
      return response.data;
    } catch (error) {
      console.error('カテゴリの作成中にエラーが発生しました:', error);
      throw error;
    }
  },

  // 既存のカテゴリを更新
  update: async (id: number, category: Category): Promise<Category> => {
    try {
      const response = await api.put(`categories/${id}/`, category);
      return response.data;
    } catch (error) {
      console.error(`ID ${id} のカテゴリ更新中にエラーが発生しました:`, error);
      throw error;
    }
  },

  // カテゴリを削除
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`categories/${id}/`);
    } catch (error) {
      console.error(`ID ${id} のカテゴリ削除中にエラーが発生しました:`, error);
      throw error;
    }
  }
};

export default categoryService;