# 🚀 QuickToolify 開発ロードマップ

---

## ✅ 開発の流れ
1️⃣ **フロントエンドの開発（画像アップロード UI）**
2️⃣ **バックエンドの開発（Rust API: 画像リサイズ & JSON整形）**
3️⃣ **Cloudflare Pages & Fly.io へのデプロイ**

---

## 🏗 ステップ 1: フロントエンドの開発（画像アップロード UI）

### 🔹 目的
- ユーザーが直感的に画像をアップロードし、リサイズ・変換できる UI を提供
- JSON 整形ツールもフロントに実装し、便利なツール集として拡張可能にする

### 🛠 技術スタック
- **Astro + React**: 高速な静的サイト生成とインタラクティブな UI
- **shadcn/ui**: UI コンポーネントのスタイル統一
- **Tailwind CSS**: 柔軟なデザインカスタマイズ
- **lucide-react**: アイコン管理

### 🔨 開発する機能

#### ✅ 画像変換 UI
- サイズ調整（px 指定 or プリセット）
- 画像フォーマット変換（JPEG ⇄ PNG ⇄ WebP）
- 圧縮率調整

#### ✅ JSON 整形 UI
- JSON のインデント調整
- シンタックスハイライト付きのエディタ（Monaco Editor or CodeMirror）
- コピー・ダウンロード機能

#### ✅ カテゴリー管理
- 画像変換 / JSON 整形 などのツールをカテゴリごとに管理
- **アイコン・カラーのカスタマイズ対応**（lucide-react + Tailwind）

#### ✅ レスポンシブ対応
- モバイルでも使いやすい UI
- ハンバーガーメニュー & サイドバー切り替え

---

## 🏗 ステップ 2: バックエンドの開発（Rust API）

### 🔹 目的
- 画像処理を Rust で超高速化
- JSON 整形 API も Rust で提供

### 🛠 技術スタック
- **Rust + Axum**: 軽量 & 高速な Web API
- **image クレート**: 画像リサイズ & 変換
- **serde_json**: JSON 整形処理

### 🔨 開発する API
#### ✅ 画像変換 API
- `POST /resize` → 画像リサイズ
- `POST /convert` → 画像フォーマット変換
- `POST /compress` → 画像圧縮

#### ✅ JSON 整形 API
- `POST /format-json` → JSON を整形
- `POST /minify-json` → JSON を圧縮

#### ✅ 制限
- **Cloudflare R2 にアップロードせずにレスポンスで返す**（ギャラリー機能なし）
- **最大ファイルサイズ制限**（例: 5MB 以上は処理しない）

---

## 🚀 ステップ 3: Cloudflare Pages & Fly.io へのデプロイ

### 🔹 目的
- **フロントエンド** → Cloudflare Pages にデプロイ（CDN + 高速配信）
- **バックエンド** → Fly.io にデプロイ（Rust API をグローバルに展開）
- **画像の一時保存** → Cloudflare R2 で管理

### 🛠 技術スタック
- **Cloudflare Pages**: Astro + React のデプロイ
- **Fly.io**: Rust API のデプロイ
- **Cloudflare R2**: 画像処理結果を一時的に保存（不要ならレスポンス返却のみ）

### 🔨 デプロイ戦略
#### ✅ Cloudflare Pages
- GitHub Actions で自動デプロイ
- `main` ブランチにプッシュで Cloudflare Pages に反映

#### ✅ Fly.io
- Rust API の Docker コンテナをデプロイ
- `flyctl deploy` を GitHub Actions で自動化

#### ✅ 環境変数管理
- `.env` ファイルで API キー & 設定値を管理
- Cloudflare Pages / Fly.io のシークレットストレージを利用

#### ✅ 監視・ログ
- **Cloudflare Analytics**: フロントのアクセス状況を監視
- **Fly.io Logs**: Rust API のエラーログ収集

---

## 🎯 最短で QuickToolify を動かすためのアクションプラン
📌 **Step 1**: **フロントエンド UI 開発（Astro + React）**
📌 **Step 2**: **Rust API の実装（画像変換 & JSON 整形）**
📌 **Step 3**: **Cloudflare Pages & Fly.io でデプロイ & 公開**

✅ **画像アップロード UI を作成**（Astro + React）
✅ **JSON 整形 UI を作成**（シンプルなエディタ導入）
✅ **Rust API のエンドポイント設計 & 実装開始**
