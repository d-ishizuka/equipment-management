import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import EquipmentList from '../EquipmentList';
import { equipmentService } from '../../services/equipmentService';
import { categoryService } from '../../services/categoryService';
import { locationService } from '../../services/locationService';

// サービスをモック
vi.mock('../../services/equipmentService');
vi.mock('../../services/categoryService');
vi.mock('../../services/locationService');

// モックデータ
const mockCategories = [
  { id: 1, name: '電子機器', description: 'パソコンやタブレットなど' },
  { id: 2, name: '家具', description: 'デスクや椅子など' }
];

const mockLocations = [
  { id: 1, name: '東京オフィス', description: '東京本社' },
  { id: 2, name: '大阪オフィス', description: '大阪支社' }
];

const mockEquipments = [
  {
    id: 1,
    name: 'ノートPC',
    serial_number: 'PC001',
    purchase_date: '2023-01-01',
    purchase_price: 120000,
    status: 'available',
    description: 'デベロッパー用PC',
    category: mockCategories[0],
    location: mockLocations[0]
  },
  {
    id: 2,
    name: 'モニター',
    serial_number: 'MN002',
    purchase_date: '2023-02-15',
    purchase_price: 35000,
    status: 'in_use',
    description: 'ワイドスクリーン',
    category: mockCategories[0],
    location: mockLocations[0]
  },
  {
    id: 3,
    name: 'オフィスチェア',
    serial_number: 'CH003',
    purchase_date: '2023-03-10',
    purchase_price: 25000,
    status: 'broken',
    description: '肘掛け付き',
    category: mockCategories[1],
    location: mockLocations[1]
  }
];

// テスト前の設定
beforeEach(() => {
  vi.resetAllMocks();
  
  // モックの実装
  equipmentService.getAll = vi.fn().mockResolvedValue(mockEquipments);
  categoryService.getAll = vi.fn().mockResolvedValue(mockCategories);
  locationService.getAll = vi.fn().mockResolvedValue(mockLocations);
  equipmentService.create = vi.fn().mockImplementation(data => 
    Promise.resolve({ ...data, id: 4 })
  );
  equipmentService.update = vi.fn().mockImplementation((id, data) =>
    Promise.resolve({ ...data, id })
  );
  equipmentService.delete = vi.fn().mockResolvedValue(undefined);
});

describe('EquipmentList Component', () => {
  test('初期ロード時にローディング状態が表示される', () => {
    render(<EquipmentList />);
    expect(screen.getByText(/備品一覧/i)).toBeInTheDocument();
    expect(screen.getByTestId('loading-skeleton-container')).toBeInTheDocument();
  });

  test('データ取得後に備品一覧が表示される', async () => {
    render(<EquipmentList />);
    
    // ローディング後にデータが表示されるのを待つ
    await waitFor(() => {
      expect(screen.getByText('ノートPC')).toBeInTheDocument();
      expect(screen.getByText('モニター')).toBeInTheDocument();
      expect(screen.getByText('オフィスチェア')).toBeInTheDocument();
    });
    
    // API呼び出しが実行されたことを確認
    expect(equipmentService.getAll).toHaveBeenCalledTimes(1);
    expect(categoryService.getAll).toHaveBeenCalledTimes(1);
    expect(locationService.getAll).toHaveBeenCalledTimes(1);
  });

  test('ステータスフィルターが正しく機能する', async () => {
    render(<EquipmentList />);
    
    // データ読み込み完了まで待機
    await waitFor(() => {
      expect(screen.getByText('ノートPC')).toBeInTheDocument();
    });
    
    // 「使用中」ステータスでフィルタリング
    fireEvent.change(screen.getByLabelText(/ステータス/i), { target: { value: 'in_use' } });
    
    // 「モニター」のみが表示され、他は非表示になる
    await waitFor(() => {
      expect(screen.queryByText('ノートPC')).not.toBeInTheDocument();
      expect(screen.getByText('モニター')).toBeInTheDocument();
      expect(screen.queryByText('オフィスチェア')).not.toBeInTheDocument();
    });
  });

  test('検索機能が正しく機能する', async () => {
    render(<EquipmentList />);
    
    // データ読み込み完了まで待機
    await waitFor(() => {
      expect(screen.getByText('ノートPC')).toBeInTheDocument();
    });
    
    // 「チェア」で検索
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: 'チェア' } });
    
    // 「オフィスチェア」のみが表示され、他は非表示になる
    await waitFor(() => {
      expect(screen.queryByText('ノートPC')).not.toBeInTheDocument();
      expect(screen.queryByText('モニター')).not.toBeInTheDocument();
      expect(screen.getByText('オフィスチェア')).toBeInTheDocument();
    });
  });

  test('新規登録フォームが正しく表示・非表示になる', async () => {
    render(<EquipmentList />);
    
    // データ読み込み完了まで待機
    await waitFor(() => {
      expect(screen.getByText('ノートPC')).toBeInTheDocument();
    });
    
    // 初期状態ではフォームは非表示
    expect(screen.queryByTestId('equipment-form')).not.toBeInTheDocument();
    
    // 「新規登録」ボタンをクリック
    fireEvent.click(screen.getByText('新規登録'));
    
    // フォームが表示される
    expect(screen.getByTestId('equipment-form')).toBeInTheDocument();
    expect(screen.getByText('備品登録')).toBeInTheDocument();
    
    // 「キャンセル」ボタンをクリック
    fireEvent.click(screen.getByTestId('form-cancel-button'));
    
    // フォームが非表示になる
    expect(screen.queryByTestId('equipment-form')).not.toBeInTheDocument();
  });

  test('新規登録フォームから備品を追加できる', async () => {
    const user = userEvent.setup();
    render(<EquipmentList />);
    
    // データ読み込み完了まで待機
    await waitFor(() => {
      expect(screen.getByText('ノートPC')).toBeInTheDocument();
    });
    
    // 「新規登録」ボタンをクリック
    await user.click(screen.getByText('新規登録'));
    
    // フォーム入力
    await user.type(screen.getByLabelText(/備品名/i), 'テスト備品');
    await user.type(screen.getByLabelText(/シリアル番号/i), 'TEST001');
    await user.selectOptions(screen.getByLabelText(/カテゴリー/i), '1');
    await user.selectOptions(screen.getByTestId("form-status-label"), 'available');

    // フォーム送信
    await user.click(screen.getByText('登録する'));
    
    // 送信処理の検証
    await waitFor(() => {
      expect(equipmentService.create).toHaveBeenCalledTimes(1);
      expect(equipmentService.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'テスト備品',
        serial_number: 'TEST001',
        status: 'available'
      }));
    });
  });

  test('編集モードが正しく機能する', async () => {
    const user = userEvent.setup();
    render(<EquipmentList />);
    
    // データ読み込み完了まで待機
    await waitFor(() => {
      expect(screen.getByText('ノートPC')).toBeInTheDocument();
    });
    
    // 最初の備品の「編集」ボタンをクリック
    const editButtons = screen.getAllByText('編集');
    await user.click(editButtons[0]);
    
    // 編集フォームが表示され、既存データが入力されている
    await waitFor(() => {
      expect(screen.getByTestId('equipment-form')).toBeInTheDocument();
      expect(screen.getByLabelText(/備品名/i)).toHaveValue('ノートPC');
      expect(screen.getByLabelText(/シリアル番号/i)).toHaveValue('PC001');
    });
    
    // データを編集
    await user.clear(screen.getByLabelText(/備品名/i));
    await user.type(screen.getByLabelText(/備品名/i), 'ノートPC（更新）');
    
    // 更新を実行
    await user.click(screen.getByText('更新する'));
    
    // 更新処理の検証
    await waitFor(() => {
      expect(equipmentService.update).toHaveBeenCalledTimes(1);
      expect(equipmentService.update).toHaveBeenCalledWith(1, expect.objectContaining({
        name: 'ノートPC（更新）',
      }));
    });
  });

  test('エラー状態が正しく表示される', async () => {
    // APIエラーをシミュレート
    equipmentService.getAll = vi.fn().mockRejectedValue(new Error('API error'));
    
    render(<EquipmentList />);
    
    // エラーメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText(/データの取得に失敗しました/i)).toBeInTheDocument();
    });
  });

  test('備品がない場合のメッセージが表示される', async () => {
    // 空の備品リストをモック
    equipmentService.getAll = vi.fn().mockResolvedValue([]);
    
    render(<EquipmentList />);
    
    // 空のメッセージが表示される
    await waitFor(() => {
      expect(screen.getByText(/登録されている備品がありません/i)).toBeInTheDocument();
    });
  });
});