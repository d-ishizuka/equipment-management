import { useEffect, useState } from 'react';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/models';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // フォーム用の状態
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState<{name: string, description: string}>({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 編集モード用の状態を追加
  const [editMode, setEditMode] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);

  // 削除関連の状態を追加
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // カテゴリー一覧の取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('カテゴリーの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory.name.trim()) {
      alert('カテゴリー名を入力してください');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (editMode && editCategoryId) {
        // 編集モードの場合は更新API呼び出し
        const updatedCategory = await categoryService.update(editCategoryId, newCategory);

        // 一覧から更新対象のカテゴリーを置き換え
        setCategories(categories.map(cat => cat.id === editCategoryId ? updatedCategory : cat));

        // 編集モードを終了
        setEditMode(false);
        setEditCategoryId(null);
      } else {
        // 新規作成の場合は作成API呼び出し
        const createdCategory = await categoryService.create(newCategory);
        setCategories([...categories, createdCategory]);
      }

      // フォームをリセット
      setNewCategory({ name: '', description: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error creating category:', err);
      alert(editMode ? 'カテゴリーの更新に失敗しました' : 'カテゴリーの作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // フォームの入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };

  // 編集モード開始
  const startEditing = (category: Category) => {
    if (!category.id) return;

    // 削除モードをキャンセル(同時編集・削除を防止)
    setCategoryToDelete(null);

    // 編集対象のカテゴリー情報をフォームにセット
    setNewCategory({
      name: category.name,
      description: category.description || ''
    });

    // 編集モードを開始
    setEditMode(true);
    setEditCategoryId(category.id);
    setShowForm(true);
  };

  // 編集キャンセル
  const cancelEditing = () => {
    setEditMode(false);
    setEditCategoryId(null);
    setNewCategory({ name: '', description: '' });
    setShowForm(false);
  };

  // 削除確認ダイアログを表示
  const confirmDelete = (categoryId: number) => {
    setCategoryToDelete(categoryId);
  };

  // カテゴリー削除処理
  const handleDelete = async () => {
    if (categoryToDelete === null) return;
    
    setIsDeleting(true);
    try {
      await categoryService.delete(categoryToDelete);
      // 削除成功時に一覧から該当カテゴリーを削除
      setCategories(categories.filter(cat => cat.id !== categoryToDelete));
      setCategoryToDelete(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('カテゴリーの削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
  };

  // ローディング状態の表示
  if (loading) {
    return (
      <div className="category-container">
        <div className="category-header">
          <h2 className="category-title">カテゴリー一覧</h2>
        </div>
        <div className="category-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  // エラー状態の表示
  if (error) {
    return <div className="error">エラー: {error}</div>;
  }

  return (
    <div className="category-container">
      <div className="category-header">
        <h2 className="category-title">カテゴリー一覧</h2>
        <button 
          className="add-button" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'キャンセル' : '新規作成'}
        </button>
      </div>

      {/* カテゴリー登録/編集フォーム */}
      {showForm && (
        <div className="category-form-container">
          <form onSubmit={handleSubmit} className="category-form" data-testid="category-form">
            <h3>{editMode ? 'カテゴリーを編集' : 'カテゴリーを作成'}</h3>

            <div className="form-group">
              <label htmlFor="name">カテゴリー名 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleChange}
                required
                placeholder="カテゴリー名を入力"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">説明 (任意)</label>
              <textarea
                id="description"
                name="description"
                value={newCategory.description}
                onChange={handleChange}
                placeholder="カテゴリーの説明を入力"
                rows={3}
              />
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={editMode ? cancelEditing : () => setShowForm(false)}
              >
                キャンセル
              </button>
              <button 
                type="submit" 
                className="submit-button" 
                disabled={isSubmitting}
              >
                {isSubmitting ? '送信中...' : '登録する'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {categoryToDelete !== null && (
        <div className="delete-dialog">
          <div className="delete-dialog-content">
            <h3>カテゴリーの削除</h3>
            <p>このカテゴリーを削除してもよろしいですか？</p>
            <p>この操作は取り消せません。</p>
            <div className="delete-dialog-actions">
              <button 
                className="cancel-button" 
                onClick={() => setCategoryToDelete(null)} 
                disabled={isDeleting}
              >
                キャンセル
              </button>
              <button 
                className="delete-button" 
                onClick={handleDelete} 
                disabled={isDeleting}
              >
                {isDeleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {categories.length === 0 ? (
        <div className="empty-message">
          カテゴリーが登録されていません
        </div>
      ) : (
        <div className="category-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-card-header">
                <h3 className="category-name">{category.name}</h3>
                <div className="card-actions">
                  <button
                    className="edit-icon"
                    onClick={() => category.id && startEditing(category)}
                    aria-label="カテゴリーを編集"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="none" d="M0 0h24v24H0z"/>
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </button>
                  <button 
                    className="delete-icon" 
                    onClick={() => category.id && confirmDelete(category.id)}
                    aria-label="カテゴリーを削除"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
                      <path fill="none" d="M0 0h24v24H0z"/>
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                  </button>
                </div>
              </div>
              {category.description && (
                <p className="category-description">{category.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;