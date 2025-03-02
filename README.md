# QuickToolify

```
├── frontend/         # Astroフロントエンド
└── backend/          # Rustバックエンド
    ├── src/
    │   ├── main.rs   # エントリーポイント
    │   ├── routes.rs # APIルート定義
    │   ├── handlers/ # リクエストハンドラー
    │   │   └── images.rs
    │   └── services/ # ビジネスロジック
    │       └── converter.rs
    ├── Cargo.toml    # 依存関係
    └── Dockerfile    # デプロイ用
```


バックエンドのビルドと実行  
```
cd backend
cargo build --release
cargo run
```

バックエンド確認とデプロイ  
```
docker build -t quicktoolify-backend .
flyctl deploy
```

ログの確認  
```
flyctl logs
```
