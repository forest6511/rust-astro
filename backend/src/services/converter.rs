use anyhow::{Result, anyhow};
use std::path::Path;
use image::{self, ImageFormat};

pub fn convert_image(input: &str, output: &str, format: &str) -> Result<()> {
    tracing::debug!("変換開始: {} → {} ({}形式)", input, output, format);

    let input_ext = Path::new(input)
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("")
        .to_lowercase();
    tracing::debug!("入力ファイル拡張子: {}", input_ext);

    // HEICとAVIFの変換は現在サポートしていないためエラー
    if input_ext == "heic" || input_ext == "avif" {
        tracing::warn!("未サポート形式: {}", input_ext);
        return Err(anyhow!("HEIC and AVIF input formats are currently not supported in this build"));
    }

    // 画像を読み込み
    tracing::debug!("画像ファイル読み込み開始: {}", input);
    let img = match image::open(input) {
        Ok(img) => {
            tracing::debug!("画像読み込み成功: {}x{}", img.width(), img.height());
            img
        },
        Err(e) => {
            tracing::error!("画像読み込みエラー: {:?}", e);
            return Err(anyhow!("Failed to open image: {}", e));
        }
    };

    // 出力フォーマットを決定
    tracing::debug!("出力フォーマット決定: {}", format);
    let format_enum = match format {
        "jpeg" => {
            tracing::debug!("JPEG形式として変換");
            ImageFormat::Jpeg
        },
        "png" => {
            tracing::debug!("PNG形式として変換");
            ImageFormat::Png
        },
        "webp" => {
            tracing::debug!("WebP形式として変換");
            ImageFormat::WebP
        },
        _ => {
            tracing::error!("未サポート出力形式: {}", format);
            return Err(anyhow!("Unsupported output format: {}", format));
        }
    };

    // 画像を保存
    tracing::debug!("変換画像の保存開始: {}", output);
    match img.save_with_format(output, format_enum) {
        Ok(_) => {
            tracing::debug!("変換画像の保存成功");
            Ok(())
        },
        Err(e) => {
            tracing::error!("変換画像の保存エラー: {:?}", e);
            Err(anyhow!("Failed to save converted image: {}", e))
        }
    }
}