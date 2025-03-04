use std::net::SocketAddr;
use std::env;

use axum::{
    routing::{get, post},
    Router,
};
use axum::extract::DefaultBodyLimit;
use tower_http::cors::{Any, CorsLayer};
use tracing::{Level, info};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, filter::EnvFilter};

mod handlers;
mod services;

#[tokio::main]
async fn main() {
    // ImageMagickの初期化
    magick_rust::magick_wand_genesis();
    info!("ImageMagick初期化完了");

    // ロギングの初期化 - より詳細に設定
    let filter = EnvFilter::from_default_env()
        .add_directive(Level::DEBUG.into())
        .add_directive("tower_http=debug".parse().unwrap())
        .add_directive("quicktoolify_backend=debug".parse().unwrap());

    tracing_subscriber::registry()
        .with(filter)
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("QuickToolify バックエンドサーバー起動中...");

    // CORSの設定
    let origins_str = env::var("ALLOWED_ORIGINS")
        .unwrap_or_else(|_| "https://quickify.tools".to_string());


    let allowed_origins: Vec<String> = origins_str
        .split(',')
        .map(|s| s.to_string())
        .collect();

    let cors = CorsLayer::new()
        .allow_origin(
            allowed_origins
                .iter()
                .map(|origin| origin.parse().unwrap())
                .collect::<Vec<_>>()
        )
        .allow_methods(Any)
        .allow_headers(Any);

    info!("CORS設定完了 {}", origins_str);

    // ルーティングの設定
    let app = Router::new()
        .route("/", get(handlers::health_check))
        .route("/convert/images", post(handlers::images::convert_image))
        .route("/compress/images", post(handlers::images::compress_image))
        .layer(DefaultBodyLimit::max(20 * 1024 * 1024))
        .layer(cors);

    info!("ルーティング設定完了");

    // サーバーの起動
    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    info!("サーバー起動準備完了: {}", addr);

    // サーバー起動
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    info!("🚀 サーバー起動完了 - リクエスト待機中...");

    let server = axum::serve(listener, app);

    // サーバー終了時にImageMagickのクリーンアップを行う
    match server.await {
        Ok(_) => info!("サーバー正常終了"),
        Err(e) => tracing::error!("サーバーエラー: {}", e),
    }

    // ImageMagickのクリーンアップ
    magick_rust::magick_wand_terminus();
    info!("ImageMagickクリーンアップ完了");
}