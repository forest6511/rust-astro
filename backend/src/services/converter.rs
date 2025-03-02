use anyhow::{Result, anyhow};
use std::path::Path;
use image::{self, ImageFormat};
use magick_rust::{MagickWand};

pub fn convert_image(input: &str, output: &str, format: &str) -> Result<()> {
    tracing::debug!("変換開始: {} → {} ({}形式)", input, output, format);

    let input_ext = Path::new(input)
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("")
        .to_lowercase();
    tracing::debug!("入力ファイル拡張子: {}", input_ext);

    // HEIC、AVIFの場合、またはこれらの形式に変換する場合はImageMagickを使用
    if input_ext == "heic" || input_ext == "avif" || format == "avif" {
        tracing::info!("ImageMagickを使用して変換します: {} -> {}", input_ext, format);
        return convert_with_imagemagick(input, output, format);
    }

    // 通常の画像変換はimageクレートを使用
    tracing::info!("標準ライブラリを使用して変換します: {} -> {}", input_ext, format);

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

// ImageMagickを使用した変換
fn convert_with_imagemagick(input: &str, output: &str, format: &str) -> Result<()> {
    tracing::debug!("ImageMagickで変換開始: {} -> {}", input, output);

    // MagickWandを作成
    let mut wand = MagickWand::new();

    // 入力画像を読み込み
    match wand.read_image(input) {
        Ok(_) => tracing::debug!("ImageMagickで画像読み込み成功"),
        Err(e) => {
            tracing::error!("ImageMagickで画像読み込みエラー: {:?}", e);
            return Err(anyhow!("Failed to read image with ImageMagick: {}", e));
        }
    }

    // フォーマットの設定
    let magick_format = match format {
        "jpeg" => "JPEG",
        "png" => "PNG",
        "webp" => "WEBP",
        "avif" => "AVIF",
        _ => {
            return Err(anyhow!("ImageMagickでサポートされていないフォーマット: {}", format));
        }
    };

    // 画像形式を設定
    if let Err(e) = wand.set_image_format(magick_format) {
        tracing::error!("画像フォーマット設定エラー: {:?}", e);
        return Err(anyhow!("Failed to set image format: {}", e));
    }

    // JPEGとWebP形式の場合は品質を設定
    if format == "jpeg" || format == "webp" {
        if let Err(e) = wand.set_compression_quality(90) {
            tracing::warn!("圧縮品質設定エラー: {:?}", e);
            // エラーは無視して続行
        }
    }

    // 画像を保存
    match wand.write_image(output) {
        Ok(_) => {
            tracing::debug!("ImageMagickで画像保存成功: {}", output);
            Ok(())
        },
        Err(e) => {
            tracing::error!("ImageMagickで画像保存エラー: {:?}", e);
            Err(anyhow!("Failed to save image with ImageMagick: {}", e))
        }
    }
}