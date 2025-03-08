import CategoryList from '../components/CategoryList';

const CategoryPage = () => {
  return (
    <div>
      <h1>カテゴリ管理</h1>
      <CategoryList />
      {/* 他のカテゴリ関連コンポーネント（作成フォームなど）をここに追加 */}
    </div>
  );
};

export default CategoryPage;