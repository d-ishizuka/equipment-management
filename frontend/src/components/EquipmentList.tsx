import { useEffect, useState } from 'react';
import { equipmentService } from '../services/equipmentService';
import { Equipment } from '../types/models';
import './EquipmentList.css';

const Equipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const data = await equipmentService.getAll();
        console.log(data);
        setEquipments(data);
      } catch (err) {
        console.error('Error fetching equipments:', err);
        setError('備品データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipments();
  }, []);

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
      <h2 className="page-title">備品一覧</h2>
      
      {equipments.length === 0 ? (
        <div className="empty-message">登録されている備品がありません</div>
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