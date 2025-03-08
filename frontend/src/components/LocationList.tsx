import { useEffect, useState } from 'react';
import { locationService } from '../services/locationService';
import { Location } from '../types/models';
import './LocationList.css';

const LocationList = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // フォーム用の状態
  const [showForm, setShowForm] = useState(false);
  const [newLocation, setNewLocation] = useState<{name: string, description: string}>({
    name: '',
    description: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false);

  // カテゴリー一覧の取得
  useEffect(() => {    
    const fetchLocations = async () => {
      try {
        const data = await locationService.getAll();
        setLocations(data);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('場所の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocations();
  }, []);

  // フォーム入力処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLocation({
      ...newLocation,
      [name]: value
    });
  };

  // フォーム送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newLocation.name.trim()) {
      alert('場所名を入力してください');
      return;
    }

    setIsSubmitting(true);

    try{
      const createdLocation = await locationService.create(newLocation);
      setLocations([...locations, createdLocation]);
      setNewLocation({ name: '', description: ''});
      setShowForm(false);
    } catch (err) {
      console.error('Error creating location:', err);
      alert('カテゴリーの作成に失敗しました')
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading">読み込み中...</div>;
  if (error) return <div className="error">エラー: {error}</div>;

  return (
    <div className="location-container">
      <div className="location-header">
        <h2 className="location-title">場所一覧</h2>
        <button
          className="add-button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'キャンセル' : '新規作成'}
        </button>
      </div>

      {/* 場所登録フォーム */}
      {showForm && (
        <div className="location-form-container">
          <form onSubmit={handleSubmit} className="location-form" data-testid="location-form">
            <div className="form-group">
              <label htmlFor="name">場所名 *</label>
              <input 
                type="text"
                id="name"
                name="name"
                value={newLocation.name}
                onChange={handleChange}
                required
                placeholder='場所名を入力'
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">説明(任意)</label>
              <textarea 
                id="description"
                name="description"
                value={newLocation.description}
                onChange={handleChange}
                placeholder="場所の説明を入力"
                rows={3}
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-button" 
                onClick={() => setShowForm(false)}
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
      
      {locations.length === 0 ? (
        <div className="empty-message">
          場所が登録されていません
        </div>
      ) : (
        <div className="table-container">
          <table className="location-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>場所</th>
                <th>説明</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(location => (
                <tr key={location.id}>
                  <td className="id-cell">{location.id}</td>
                  <td className="name-cell">{location.name}</td>
                  <td className="description-cell">{location.description}</td>
                  <td className="actions-cell">
                    <button className="edit-button">編集</button>
                    <button className="delete-button">削除</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LocationList;