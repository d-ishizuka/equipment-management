import { useEffect, useState } from 'react';
import { equipmentService } from '../services/equipmentService';
import { categoryService } from '../services/categoryService';
import { locationService } from '../services/locationService';
import { Equipment, Category, Location } from '../types/models';
import './EquipmentList.css';

const Equipments = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [filteredEquipments, setFilteredEquipments] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // フィルタリングと検索用の状態
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // フォーム用の状態
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: '',
    serial_number: '',
    purchase_date: '',
    purchase_price: 0,
    description: '',
    category: undefined,
    location: undefined,
  });

  // 削除関連の状態を追加
  const [equipmentToDelete, setEquipmentToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // カテゴリーと場所のリスト
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  // 最初のレンダリング時に備品データ一覧を取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [equipmentsData, categoriesData, locationsData] = await Promise.all([
          equipmentService.getAll(),
          categoryService.getAll(),
          locationService.getAll()
        ]);

        setEquipments(equipmentsData);
        setFilteredEquipments(equipmentsData);
        console.log(equipmentsData);
        setCategories(categoriesData);
        setLocations(locationsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // フィルタリングと検索の適用
  useEffect(() => {    
    if (!equipments.length) return; // 備品データがない場合は何もしない
    
    let result = [...equipments];

    // ステータスでフィルタリング
    if (statusFilter !== 'all') {
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
  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  // 検索入力ハンドラ
  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // フォーム入力ハンドラ
  // 外部キー参照のlocationとcategoryはリストから選択
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      const selectedCategory = categories.find(cat => cat.id === parseInt(value));
      setNewEquipment({
        ...newEquipment,
        category: selectedCategory?.id,
        category_name: selectedCategory?.name
      });
    } else if (name === 'location') {
        const selectedLocation = locations.find(loc => loc.id === parseInt(value));
        setNewEquipment({
          ...newEquipment,
          location: selectedLocation?.id,
          location_name: selectedLocation?.name
        });
    } else {
        setNewEquipment({
          ...newEquipment,
          [name]: value
        });
    }
  };

  // フォーム送信ハンドラ
  const handleSubmit = async (e: React.FormEvent) => {
    console.log("in handleSubmit")
    e.preventDefault();

    if (!newEquipment.name?.trim()) {
      alert('備品名を入力してください');
      return;
    }

    setIsSubmitting(true);

    try {
      // 新規作成の場合は作成API呼び出し
      const createdEquipment = await equipmentService.create(newEquipment as Equipment);

      // 備品リストを更新
      setEquipments([...equipments, createdEquipment]);

      // フォームをリセット
      setNewEquipment({
        name: '',
        serial_number: '',
        purchase_date: '',
        purchase_price: 0,
        description: '',
        category: undefined,
        location: undefined,
      });

      setShowForm(false);

    } catch (err) {
      console.error('Error creating equipment:', err);
      alert('備品の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 削除確認を表示
  const confirmDelete = (id: number) => {
    // 削除するアイテムのIDをセット
    setEquipmentToDelete(id);
  };

  // 削除処理
  const handleDelete = async () => {
    if (equipmentToDelete === null) return;
    
    setIsDeleting(true);
    try {
      await equipmentService.delete(equipmentToDelete);
      
      // 成功したらリストから削除
      setEquipments(equipments.filter(item => item.id !== equipmentToDelete));
      setFilteredEquipments(filteredEquipments.filter(item => item.id !== equipmentToDelete));
      
      // 削除モードをリセット
      setEquipmentToDelete(null);
    } catch (err) {
      console.error('Error deleting equipment:', err);
      alert('備品の削除に失敗しました');
    } finally {
      setIsDeleting(false);
    }
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
          <button
            className="add-button"
            onClick={() => setShowForm(!showForm)}
          >
            { showForm? 'キャンセル' : '新規登録' }
          </button>
        </div>
      </div>

      {/* 新規登録フォーム */}
      {showForm && (
        <div className="equipment-form-container">
          <form onSubmit={handleSubmit} className="equipment-form"  data-testid="equipment-form">
            <h3>備品登録</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">備品名 *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newEquipment.name}
                  onChange={handleFormChange}
                  required
                  placeholder="備品名を入力"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="serial_number">シリアル番号</label>
                <input
                  type="text"
                  id="serial_number"
                  name="serial_number"
                  value={newEquipment.serial_number}
                  onChange={handleFormChange}
                  placeholder="シリアル番号を入力"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="purchacse_date">購入日</label>
                <input
                  type="date"
                  id="purchase_date"
                  name="purchase_date"
                  value={newEquipment.purchase_date}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="purchase_price">購入価格</label>
                <input
                  type="number"
                  id="purchase_price"
                  name="purchase_price"
                  value={newEquipment.purchase_price}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">カテゴリー</label>
                <select
                  id="category"
                  name="category"
                  value={newEquipment.category || ''}
                  onChange={handleFormChange}
                >
                  <option value="">カテゴリーを選択</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="location">場所</label>
                <select
                  id="location"
                  name="location"
                  value={newEquipment.location || ''}
                  onChange={handleFormChange}
                >
                  <option value="">場所を選択</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="status">ステータス *</label>
              <select
                id="status"
                name="status"
                value={newEquipment.status}
                onChange={handleFormChange}
                required
              >
                <option value="available">利用可能</option>
                <option value="in_use">使用中</option>
                <option value="maintenance">メンテナンス中</option>
                <option value="broken">故障</option>
                <option value="discarded">廃棄</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">説明</label>
              <textarea
                id="description"
                name="description"
                value={newEquipment.description}
                onChange={handleFormChange}
                placeholder="備品の説明を入力"
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

      {/* フィルターと検索UI */}
      <div className="filter-search-container">
        <div className="filter-container">
          <label htmlFor="status-filter">ステータス:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
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
          {filteredEquipments.map(equipment => (
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
                <button 
                  className="delete-button" 
                  onClick={() => equipment.id && confirmDelete(equipment.id)}
                >
                  削除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {equipmentToDelete !== null && (
        <div className="delete-dialog-overlay">
          <div className="delete-dialog">
            <h3>備品の削除</h3>
            <p>
              {equipments.find(e => e.id === equipmentToDelete)?.name} を削除してもよろしいですか？
            </p>
            <p className="delete-warning">この操作は取り消せません。</p>
            <div className="delete-actions">
              <button 
                className="cancel-button" 
                onClick={() => setEquipmentToDelete(null)} 
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
    </div>
  );
};

export default Equipments;