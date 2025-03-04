use anyhow::{Result, anyhow};
use std::path::Path;
use image::{GenericImageView};
use mozjpeg::{Compress, ColorSpace};
use magick_rust::{MagickWand};

pub fn compress_image(input: &str, output: &str, quality: i32) -> Result<()> {
    tracing::debug!("圧縮開始: {} → {} (品質: {}%)", input, output, quality);

    let input_ext = Path::new(input)
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("")
        .to_lowercase();
    tracing::debug!("入力ファイル拡張子: {}", input_ext);

    if input_ext == "jpg" || input_ext == "jpeg" {
        // ==== JPEG の圧縮を `mozjpeg` に変更 ====
        tracing::debug!("JPEG圧縮最適化適用 (mozjpeg 使用)");

        let img = image::open(input).map_err(|e| anyhow!("JPEG 画像読み込みエラー: {}", e))?;
        let (width, height) = img.dimensions();
        let rgb = img.to_rgb8();
        let raw_data = rgb.as_raw(); // RGBデータを取得

        let mut comp = Compress::new(ColorSpace::JCS_RGB);
        comp.set_size(width as usize, height as usize);
        comp.set_quality(quality as f32);
        comp.set_progressive_mode(); // Progressive JPEG を有効化
        comp.set_optimize_scans(true); // Huffman テーブルの最適化

        // `start_compress()` に `Vec<u8>` を渡して開始
        let mut writer = comp.start_compress(Vec::new())?;

        // 画像データを `write_scanlines()` で書き込む
        writer.write_scanlines(raw_data)?;

        // `finish()` の結果を取得
        let jpeg_data = writer.finish()?;

        std::fs::write(output, jpeg_data).map_err(|e| anyhow!("JPEG保存エラー: {}", e))?;
    } else {
        // ==== PNG / WebP の処理は `magick_rust` を使う ====
        tracing::debug!("ImageMagick を使用した圧縮処理を適用");

        let mut wand = MagickWand::new();
        if let Err(e) = wand.read_image(input) {
            tracing::error!("ImageMagick で画像読み込みエラー: {:?}", e);
            return Err(anyhow!("ImageMagick 画像読み込み失敗: {}", e));
        }

        // 圧縮品質を適用
        if let Err(e) = wand.set_compression_quality(quality as usize) {
            tracing::warn!("圧縮品質設定エラー: {:?}", e);
        }

        match input_ext.as_str() {
            "png" => {
                tracing::debug!("PNG最適化設定適用");

                let _ = wand.set_compression_quality(60 as usize);
                let _ = wand.set_image_compression(magick_rust::CompressionType::Zip);

                if quality < 80 {
                    let _ = wand.quantize_image(
                        256,
                        magick_rust::ColorspaceType::RGB,
                        0,
                        magick_rust::DitherMethod::FloydSteinberg,
                        false
                    );
                }

                let _ = wand.set_image_property("png:compression-filter", "5");
                let _ = wand.set_image_property("png:compression-level", "9");
                let _ = wand.set_image_property("png:compression-strategy", "2");

                if quality < 90 {
                    let _ = wand.set_image_type(magick_rust::ImageType::Palette);
                }
            },
            "webp" => {
                tracing::debug!("WebP最適化設定適用");
                let _ = wand.set_image_property("webp:lossless", "false");
                let _ = wand.set_image_property("webp:method", "6");
            },
            _ => {
                tracing::debug!("一般的な圧縮設定を適用");
            }
        }

        // メタデータ削除
        let _ = wand.strip_image();

        // 保存処理
        if let Err(e) = wand.write_image(output) {
            tracing::error!("圧縮画像の保存エラー: {:?}", e);
            return Err(anyhow!("Failed to save compressed image: {}", e));
        }
    }

    tracing::debug!("圧縮画像の保存成功: {}", output);
    Ok(())
}
