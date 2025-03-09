import { useEffect, useState } from 'react';
import { equipmentService } from '../services/equipmentService';
import { Equipment } from '../types/models';
import './EquipmentList.css';

const Equipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // フィルタリングと検索用の状態
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 最初のレンダリング時に備品データ一覧を取得
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const data = await equipmentService.getAll();
        setEquipments(data);
        setFilteredEquipments(data);
      } catch (err) {
        console.error('Error fetching equipments:', err);
        setError('備品データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []); // ここに空の配列を渡すことで、最初のレンダリング時のみ実行される

  // フィルタリングと検索の適用
  useEffect(() => {    
    if (!equipments.length) return; // 備品データがない場合は何もしない
    
    let result = [...equipments];

    // ステータスでフィルタリング
    if (statusFilter && statusFilter !== 'all') {
      result = result.filter(equipment => equipment.status === statusFilter);
    }

    // 名前による検索
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(equipment => equipment.name.toLowerCase().includes(term) || (equipment.description && equipment.description.toLowerCase().includes(term))
      );
    }

    setFilteredEquipments(result)}, [equipments, statusFilter, searchTerm]); // 依存配列に変数を指定することで、その変数が変更されたときに再実行される

  // ステータスフィルターの変更時に呼ばれるイベントハンドラ
  const handleStatusFileterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // 検索入力ハンドラ
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // ステータスに応じたクラス名を返す関数
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available': return 'status-available';
      case 'in_use': return 'status-in-use';
      case 'maintenance': return 'status-maintenance';
      case 'broken': return 'status-broken';
      case 'discarded': return 'status-discarded';
      default: return '';
    }
  };

  // ステータスの日本語表示
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return '利用可能';
      case 'in_use': return '使用中';
      case 'maintenance': return 'メンテナンス中';
      case 'broken': return '故障';
      case 'discarded': return '廃棄';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="equipment-container">
        <h2 className="page-title">備品一覧</h2>
        <div className="equipment-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="equipment-card skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="equipment-container">
      <div className="equipment-header">
        <h2 className="page-title">備品一覧</h2>
        <div className="equipment-actions">
          <button className="add-button">新規登録</button>
        </div>
      </div>

      {/* フィルターと検索UI */}
      <div className="filter-search-container">
        <div className="filter-container">
          <label htmlFor="status-filter">ステータス:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFileterChange}
            className="filter-select"
          >
            <option value="all">全て</option>
            <option value="available">利用可能</option>
            <option value="in_use">使用中</option>
            <option value="maintenance">メンテナンス中</option>
            <option value="broken">故障</option>
            <option value="discarded">廃棄</option>
          </select>
        </div>

        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder="備品名、説明で検索..."
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm('')}
              aria-label="検索をクリア"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* フィルター結果サマリー */}
      <div className="filter-summary">
        {filteredEquipments.length} / {equipments.length} 件表示中
      </div>
      
      {filteredEquipments.length === 0 ? (
        <div className="empty-message">
          {equipments.length > 0 ? '条件に一致する備品がありません' : '登録されている備品がありません'}
        </div>
      ) : (
        <div className="equipment-grid">
          {equipments.map(equipment => (
            <div key={equipment.id} className="equipment-card">
              <div className={`status-indicator ${getStatusClass(equipment.status)}`}>
                <span className="status-label">{getStatusLabel(equipment.status)}</span>
              </div>
              <h3 className="equipment-name">{equipment.name}</h3>
              
              {equipment.serial_number && (
                <div className="equipment-detail">
                  <span className="detail-label">S/N:</span> {equipment.serial_number}
                </div>
              )}
              
              <div className="equipment-detail">
                <span className="detail-label">カテゴリ:</span> {equipment.category_name || '未分類'}
              </div>
              
              <div className="equipment-detail">
                <span className="detail-label">場所:</span> {equipment.location_name || '未設定'}
              </div>
              
              {equipment.purchase_date && (
                <div className="equipment-detail">
                  <span className="detail-label">購入日:</span> {equipment.purchase_date}
                </div>
              )}
              
              {equipment.description && (
                <p className="equipment-description">{equipment.description}</p>
              )}
              
              <div className="card-actions">
                <button className="view-button">詳細</button>
                <button className="edit-button">編集</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Equipments;