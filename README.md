# django-react-project

このプロジェクトは、Djangoをバックエンドに、Reactをフロントエンドに使用したウェブアプリケーションです。

## 構成

- **backend/**: Djangoバックエンド
  - **api/**: API関連のコード
    - `admin.py`: Django管理サイトの設定
    - `apps.py`: APIアプリケーションの設定
    - `models.py`: データベースモデルの定義
    - `serializers.py`: モデルデータをJSON形式に変換するシリアライザー
    - `tests.py`: APIのユニットテスト
    - `urls.py`: APIのURLルーティング
    - `views.py`: APIのビュー
  - **backend/**: Djangoプロジェクトの設定
    - `asgi.py`: ASGIアプリケーションのエントリポイント
    - `settings.py`: Djangoプロジェクトの設定
    - `urls.py`: プロジェクト全体のURLルーティング
    - `wsgi.py`: WSGIアプリケーションのエントリポイント
  - `manage.py`: Djangoプロジェクトを管理するためのコマンドラインツール
  - `requirements.txt`: プロジェクトの依存関係

- **frontend/**: Reactフロントエンド
  - **public/**: 公開用ファイル
    - `index.html`: ReactアプリケーションのHTMLテンプレート
    - `manifest.json`: PWAの設定
  - **src/**: ソースコード
    - **components/**: Reactコンポーネント
      - `App.js`: メインアプリケーションコンポーネント
    - `index.js`: Reactアプリケーションのエントリポイント
    - **styles/**: スタイルシート
      - `App.css`: アプリケーションのスタイル
  - `package.json`: npmの設定ファイル
  - `.gitignore`: Gitで無視するファイル

## セットアップ

1. **バックエンドのセットアップ**
   - `backend/requirements.txt`に記載された依存関係をインストールします。
   - Djangoサーバーを起動します。

2. **フロントエンドのセットアップ**
   - `frontend/package.json`に記載された依存関係をインストールします。
   - Reactアプリケーションを起動します。

## 使用方法
バックエンドとフロントエンドをそれぞれ起動した後、ブラウザでフロントエンドにアクセスしてアプリケーションを利用します。

## 仮想環境
- Dockerではなく以下の仮想環境を使っている
- Backend : venv
- Frontend : 

## pyenvメモ
```
# pyenv初期化コードを.zshrcに追加
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo 'command -v pyenv >/dev/null || export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc

# 変更を反映（パスを通す）
source ~/.zshrc

# venvの有効化
venv local x.y.z
source venv/bin/activate

# pip freezeコマンド
pip freeze > requirements.txt
```
## superuser
```
ユーザー名：admin
メールアドレス：admin@gmail.com
パスワード：password
```

## backend test
```
# すべてのテストを実行
python manage.py test

# 特定のアプリケーションのテストを実行
python manage.py test api

# 特定のテストクラスを実行
python manage.py test api.tests.CategoryModelTests

# 特定のテストメソッドを実行
python manage.py test api.tests.CategoryModelTests.test_create_category
```

## frontend test
```
# すべてのテストを実行
npm test

# 特定ファイルのテストを実行
npm test -- CategoryList.test.tsx
```