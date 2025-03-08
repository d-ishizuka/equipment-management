import { vi, describe, beforeEach, test, expect } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CategoryList from '../CategoryList';
import { categoryService } from '../../services/categoryService';

// categoryServiceをモック化
vi.mock('../../services/categoryService');

describe('CategoryList Component CRUD Tests', () => {
  // テスト用のカテゴリーデータ
  const mockCategories = [
    { id: 1, name: "電子機器", description: "パソコンやタブレットなど" },
    { id: 2, name: "オフィス家具", description: "デスクや椅子など" }
  ];

  // 各テスト前にモックをリセット
  beforeEach(() => {
    vi.resetAllMocks();
    // デフォルトのレスポンスを設定
    vi.mocked(categoryService.getAll).mockResolvedValue(mockCategories);
  });

  // READ: カテゴリー一覧の表示テスト
  test('カテゴリー一覧を正しく表示する', async () => {
    render(<CategoryList />);
    
    // カテゴリー名が表示されるのを確認
    await waitFor(() => {
      expect(screen.getByText("電子機器")).toBeInTheDocument();
      expect(screen.getByText("オフィス家具")).toBeInTheDocument();
    });
    
    // 説明文も表示されていることを確認
    expect(screen.getByText("パソコンやタブレットなど")).toBeInTheDocument();
    expect(screen.getByText("デスクや椅子など")).toBeInTheDocument();
  });

  // CREATE: 新規カテゴリー作成テスト
  test('新しいカテゴリーを作成できる', async () => {
    const newCategory = { id: 3, name: "新カテゴリー", description: "新規追加の説明" };
    vi.mocked(categoryService.create).mockResolvedValue(newCategory);
    
    render(<CategoryList />);
    
    // データ読み込み完了を待機
    await waitFor(() => {
      expect(screen.getByText("電子機器")).toBeInTheDocument();
    });
    
    // 新規作成ボタンをクリック
    fireEvent.click(screen.getByText(/新規作成/i));
    
    // フォームが表示されることを確認
    expect(screen.getByText("カテゴリーを作成")).toBeInTheDocument();
    
    // フォームに入力
    fireEvent.change(screen.getByLabelText(/カテゴリー名/i), { 
      target: { value: '新カテゴリー', name: 'name' } 
    });
    
    fireEvent.change(screen.getByLabelText(/説明/i), { 
      target: { value: '新規追加の説明', name: 'description' } 
    });
    
    // フォーム送信
    fireEvent.submit(screen.getByTestId('category-form'));
    
    // API呼び出しを確認
    await waitFor(() => {
      expect(categoryService.create).toHaveBeenCalledWith({
        name: '新カテゴリー',
        description: '新規追加の説明'
      });
    });
    
    // UIが更新されて新しいカテゴリーが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText("新カテゴリー")).toBeInTheDocument();
      expect(screen.getByText("新規追加の説明")).toBeInTheDocument();
    });
  });

  // UPDATE: カテゴリー編集テスト
  test('既存のカテゴリーを編集できる', async () => {
    const updatedCategory = { id: 1, name: "編集済み電子機器", description: "更新された説明" };
    vi.mocked(categoryService.update).mockResolvedValue(updatedCategory);
    
    render(<CategoryList />);
    
    // データ読み込み完了を待機
    await waitFor(() => {
      expect(screen.getByText("電子機器")).toBeInTheDocument();
    });
    
    // 編集ボタンを見つけて押す（最初のカテゴリーの編集ボタン）
    const editButtons = screen.getAllByLabelText('カテゴリーを編集');
    fireEvent.click(editButtons[0]);
    
    // 編集フォームが表示され、既存の値が入力されていることを確認
    expect(screen.getByText("カテゴリーを編集")).toBeInTheDocument();
    expect(screen.getByLabelText(/カテゴリー名/i)).toHaveValue("電子機器");
    expect(screen.getByLabelText(/説明/i)).toHaveValue("パソコンやタブレットなど");
    
    // フォームの値を変更
    fireEvent.change(screen.getByLabelText(/カテゴリー名/i), { 
      target: { value: '編集済み電子機器', name: 'name' } 
    });
    
    fireEvent.change(screen.getByLabelText(/説明/i), { 
      target: { value: '更新された説明', name: 'description' } 
    });
    
    // 更新ボタンをクリック
    fireEvent.submit(screen.getByTestId('category-form'));
    
    // API更新が呼び出されたか確認
    await waitFor(() => {
      expect(categoryService.update).toHaveBeenCalledWith(1, {
        name: '編集済み電子機器',
        description: '更新された説明'
      });
    });
    
    // UIが更新されて編集後のカテゴリーが表示されることを確認
    await waitFor(() => {
      expect(screen.getByText("編集済み電子機器")).toBeInTheDocument();
      expect(screen.getByText("更新された説明")).toBeInTheDocument();
    });
  });

  // DELETE: カテゴリー削除テスト
  test('カテゴリーを削除できる', async () => {
    vi.mocked(categoryService.delete).mockResolvedValue(undefined);
    
    render(<CategoryList />);
    
    // データ読み込み完了を待機
    await waitFor(() => {
      expect(screen.getByText("電子機器")).toBeInTheDocument();
    });
    
    // 削除ボタンを見つけて押す（最初のカテゴリーの削除ボタン）
    const deleteButtons = screen.getAllByLabelText('カテゴリーを削除');
    fireEvent.click(deleteButtons[0]);
    
    // 削除確認ダイアログが表示されることを確認
    expect(screen.getByText(/このカテゴリーを削除してもよろしいですか？/i)).toBeInTheDocument();
    
    // 削除を確定
    fireEvent.click(screen.getByText('削除する'));
    
    // API削除が呼び出されたか確認
    await waitFor(() => {
      expect(categoryService.delete).toHaveBeenCalledWith(1);
    });
    
    // 削除されたカテゴリーがUIから消えていることを確認
    await waitFor(() => {
      expect(screen.queryByText("電子機器")).not.toBeInTheDocument();
      expect(screen.queryByText("パソコンやタブレットなど")).not.toBeInTheDocument();
    });
    
    // 残りのカテゴリーは表示されていることを確認
    expect(screen.getByText("オフィス家具")).toBeInTheDocument();
  });

  // エラーケースのテスト
  test('カテゴリー作成失敗時にエラー表示される', async () => {
    // APIエラーをシミュレート
    vi.mocked(categoryService.create).mockRejectedValue(new Error("API Error"));
    
    // スパイでalertを監視
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    render(<CategoryList />);
    
    // データ読み込み完了を待機
    await waitFor(() => {
      expect(screen.getByText("電子機器")).toBeInTheDocument();
    });
    
    // 新規作成ボタンをクリック
    fireEvent.click(screen.getByText(/新規作成/i));
    
    // フォームに入力して送信
    fireEvent.change(screen.getByLabelText(/カテゴリー名/i), { 
      target: { value: 'テスト', name: 'name' } 
    });
    
    fireEvent.submit(screen.getByTestId('category-form'));
    
    // エラーアラートが表示されたことを確認
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('カテゴリーの作成に失敗しました');
    });
  });
});