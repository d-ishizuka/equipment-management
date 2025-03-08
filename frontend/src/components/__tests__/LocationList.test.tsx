import { vi, describe, beforeEach, test, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LocationList from '../LocationList';
import { locationService } from '../../services/locationService';

// locationServiceをモック化
vi.mock('../../services/locationService');

describe('LocationList Component', () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('ローディング状態が初期表示される', () => {
    // APIレスポンスを遅延させてローディング状態を維持
    vi.mocked(locationService.getAll).mockImplementation(() => new Promise(() => {}));
    
    render(<LocationList />);
    
    // ローディング表示を確認
    expect(screen.getByText(/読み込み中/i)).toBeInTheDocument();
  });

  test('API失敗時にエラーを表示する', async () => {
    // API失敗をシミュレート
    vi.mocked(locationService.getAll).mockRejectedValue(new Error('API Error'));
    
    render(<LocationList />);
    
    // エラー表示を確認
    await waitFor(() => {
      expect(screen.getByText(/場所の取得に失敗しました/i)).toBeInTheDocument();
    });
  });

  test('API成功時に場所一覧を表示する', async () => {
    // モックデータ
    const mockLocations = [
      { id: 1, name: "1階オフィス", description: "総務部デスク" },
      { id: 2, name: "2階会議室", description: "大会議室" }
    ];
    vi.mocked(locationService.getAll).mockResolvedValue(mockLocations);
    
    render(<LocationList />);
    
    // データが表示されるのを確認
    await waitFor(() => {
      expect(screen.getByText("1階オフィス")).toBeInTheDocument();
      expect(screen.getByText("2階会議室")).toBeInTheDocument();
    });
  });

  test('新規作成ボタンクリックでフォームを表示する', async () => {
    // モックデータ
    const mockLocations = [{ id: 1, name: "1階オフィス", description: "総務部デスク" }];
    vi.mocked(locationService.getAll).mockResolvedValue(mockLocations);
    
    render(<LocationList />);
    
    // データ読み込み完了を待機
    await waitFor(() => {
      expect(screen.getByText("1階オフィス")).toBeInTheDocument();
    });
    
    // 新規作成ボタンをクリック
    fireEvent.click(screen.getByText(/新規作成/i));
    
    // フォームが表示されることを確認
    expect(screen.getByPlaceholderText(/場所名を入力/i)).toBeInTheDocument();
  });

  test('フォーム送信でAPI呼び出しを行う', async () => {
    // モックデータとレスポンス
    const mockLocations = [{ id: 1, name: "1階オフィス", description: "総務部デスク" }];
    const newLocation = { id: 2, name: "新しい場所", description: "新しい説明" };
    
    vi.mocked(locationService.getAll).mockResolvedValue(mockLocations);
    vi.mocked(locationService.create).mockResolvedValue(newLocation);
    
    render(<LocationList />);
    
    // データ読み込み完了を待機
    await waitFor(() => {
      expect(screen.getByText("1階オフィス")).toBeInTheDocument();
    });
    
    // 新規作成ボタンをクリック
    fireEvent.click(screen.getByText(/新規作成/i));
    
    // フォームに入力
    fireEvent.change(screen.getByPlaceholderText(/場所名を入力/i), { 
      target: { value: '新しい場所', name: 'name' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/場所の説明を入力/i), { 
      target: { value: '新しい説明', name: 'description' } 
    });
    
    // フォーム送信
    fireEvent.submit(screen.getByTestId('location-form'));
    
    // APIが呼ばれたか確認
    await waitFor(() => {
      expect(locationService.create).toHaveBeenCalledWith({
        name: '新しい場所',
        description: '新しい説明'
      });
    });
  });
});