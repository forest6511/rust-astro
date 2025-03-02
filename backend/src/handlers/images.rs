use axum::{
    extract::Multipart,
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use base64::Engine;
use serde::Serialize;
use uuid::Uuid;
use std::io::Write;
use std::fs;
use std::path::Path;

use crate::services::converter;

#[derive(Serialize)]
pub struct ConvertedFile {
    original_name: String,
    name: String,
    url: String,
    size: usize,
}

#[derive(Serialize)]
pub struct ConversionResponse {
    files: Vec<ConvertedFile>,
}

pub async fn convert_image(mut multipart: Multipart) -> impl IntoResponse {
    tracing::info!("開始: 画像変換リクエスト受信");
    let mut result = Vec::<ConvertedFile>::new();
    let mut target_format = String::new();
    let mut files_to_process: Vec<(String, Vec<u8>)> = Vec::new();

    // 一時ディレクトリの作成
    let temp_dir = format!("/tmp/quicktoolify-{}", Uuid::new_v4());
    tracing::debug!("一時ディレクトリ作成: {}", temp_dir);
    fs::create_dir_all(&temp_dir).unwrap();

    // マルチパートフォームデータの処理 - まずすべてのフィールドを収集
    tracing::debug!("マルチパートフォームデータの処理開始");

    while let Ok(Some(field)) = multipart.next_field().await {
        let name = field.name().unwrap_or("unknown").to_string();
        tracing::debug!("フィールド検出: {}", name);

        if name == "format" {
            target_format = field.text().await.unwrap_or_else(|_| "webp".to_string());
            tracing::info!("変換先フォーマット: '{}'", target_format);
        } else if name == "files" {
            let file_name = field.file_name().unwrap_or("unknown.jpg").to_string();
            let content_type = field.content_type().unwrap_or("application/octet-stream").to_string();
            tracing::info!("ファイル検出: '{}', タイプ: {}", file_name, content_type);

            // ファイルデータの取得
            let data = field.bytes().await.unwrap();
            tracing::debug!("ファイルサイズ: {} バイト", data.len());

            // 後で処理するためにファイルを保存
            files_to_process.push((file_name, data.to_vec()));
        }
    }

    // フォーマットが空の場合はデフォルト値を設定
    if target_format.is_empty() {
        target_format = "webp".to_string();
        tracing::info!("フォーマットが空のため、デフォルト値を使用: '{}'", target_format);
    }

    // すべてのファイルを処理
    let mut file_count = 0;
    for (file_name, data) in files_to_process {
        file_count += 1;
        tracing::info!("ファイル {}の処理開始: {}", file_count, file_name);

        // 一時ファイルとして保存
        let input_path = format!("{}/{}", temp_dir, file_name);
        tracing::debug!("入力ファイルパス: {}", input_path);

        let mut file = fs::File::create(&input_path).unwrap();
        file.write_all(&data).unwrap();

        // 入力ファイルの情報取得
        let input_ext = Path::new(&file_name)
            .extension()
            .and_then(|ext| ext.to_str())
            .unwrap_or("")
            .to_lowercase();
        tracing::debug!("入力ファイル拡張子: {}", input_ext);

        // 新しいファイル名の生成
        let extension = match target_format.as_str() {
            "jpeg" => "jpg",
            format => format,
        };
        let new_filename = format!("{}.{}", Uuid::new_v4(), extension);
        let output_path = format!("{}/{}", temp_dir, new_filename);
        tracing::debug!("出力ファイルパス: {}", output_path);

        // 変換処理
        tracing::info!("変換処理開始: {} -> {}", input_ext, target_format);
        match converter::convert_image(&input_path, &output_path, &target_format) {
            Ok(_) => {
                tracing::info!("変換成功: {}", new_filename);

                // 変換されたファイルの読み込み
                let output_data = fs::read(&output_path).unwrap();
                let size = output_data.len();
                tracing::debug!("変換後ファイルサイズ: {} バイト", size);

                // Base64エンコード
                tracing::debug!("Base64エンコード開始");
                let data_base64 = base64::engine::general_purpose::STANDARD.encode(&output_data);
                tracing::debug!("Base64エンコード完了: {} 文字", data_base64.len());

                let mime_type = match target_format.as_str() {
                    "jpeg" => "image/jpeg",
                    "png" => "image/png",
                    "webp" => "image/webp",
                    "avif" => "image/avif",
                    _ => "application/octet-stream",
                };
                let url = format!("data:{};base64,{}", mime_type, data_base64);
                tracing::debug!("データURL生成完了");

                result.push(ConvertedFile {
                    original_name: file_name,
                    name: new_filename,
                    url,
                    size,
                });
                tracing::info!("ファイル {}の処理完了", file_count);
            },
            Err(e) => {
                tracing::error!("変換エラー - ファイル: '{}', フォーマット: '{}', エラー: {:?}",
                 file_name, target_format, e);
                // エラー情報をレスポンスに含める
                result.push(ConvertedFile {
                    original_name: file_name,
                    name: format!("error-{}", Uuid::new_v4()),
                    url: format!("error:{}", e),
                    size: 0,
                });
            }
        }
    }

    // 一時ディレクトリの削除
    tracing::debug!("一時ディレクトリ削除: {}", temp_dir);
    let _ = fs::remove_dir_all(temp_dir);

    tracing::info!("完了: {}ファイルを処理", result.len());
    (StatusCode::OK, Json(ConversionResponse { files: result }))
}