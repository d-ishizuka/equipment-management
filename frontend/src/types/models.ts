// カテゴリの型定義
export interface Category {
  id?: number;
  name: string;
  description?: string;
}

// 他のモデルも同様に定義
export interface Location {
  id?: number;
  name: string;
  description?: string;
}

export interface Equipment {
  id?: number;
  name: string;
  serial_number?: string;
  category: number;
  category_name?: string;  // 読み取り専用フィールド
  location: number;
  location_name?: string;  // 読み取り専用フィールド
  purchase_date?: string;
  purchase_price?: number;
  status: string;
  description?: string;
}