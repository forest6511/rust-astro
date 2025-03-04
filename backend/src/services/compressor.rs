// services/compressor.rs
use anyhow::{Result, anyhow};
use std::path::Path;
use magick_rust::{
    MagickWand,
    InterlaceType,
};

pub fn compress_image(input: &str, output: &str, quality: i32) -> Result<()> {
    tracing::debug!("圧縮開始: {} → {} (品質: {}%)", input, output, quality);

    let input_ext = Path::new(input)
        .extension()
        .and_then(|ext| ext.to_str())
        .unwrap_or("")
        .to_lowercase();
    tracing::debug!("入力ファイル拡張子: {}", input_ext);

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

    // 画像の元のサイズを取得
    let width = wand.get_image_width();
    let height = wand.get_image_height();
    tracing::debug!("元の画像サイズ: {}x{}", width, height);

    // 圧縮品質を設定
    if let Err(e) = wand.set_compression_quality(quality as usize) {
        tracing::warn!("圧縮品質設定エラー: {:?}", e);
        // エラーは無視して続行
    }

    // 画像タイプに応じた最適化設定
    match input_ext.as_str() {
        "jpg" | "jpeg" => {
            tracing::debug!("JPEG最適化設定適用");
            // JPEGの場合、インターレース解除と進行式表示を無効化
            let _ = wand.set_interlace_scheme(InterlaceType::No);

            // JPEGに適した品質設定
            let _ = wand.set_image_property("jpeg:optimize", "true");
            let _ = wand.set_image_property("jpeg:fancy-upsampling", "true");
        },
        "png" => {
            tracing::debug!("PNG最適化設定適用");

            // PNGの圧縮オプションを強化
            let _ = wand.set_compression_quality(60 as usize); // 品質設定
            let _ = wand.set_image_compression(magick_rust::CompressionType::Zip); // Zip圧縮を使用

            // 色数を減らすことでさらに圧縮
            if quality < 80 {
                // 低品質の場合は色数を減らす
                // 引数: 色数, カラースペース, tree_depth, ditherメソッド, measure_error(false)
                let _ = wand.quantize_image(
                    256,
                    magick_rust::ColorspaceType::RGB,
                    0,
                    magick_rust::DitherMethod::FloydSteinberg, // ディザリング方式を明示的に指定
                    false
                );
            }

            // PNG特有の最適化プロパティ
            let _ = wand.set_image_property("png:compression-filter", "5");
            let _ = wand.set_image_property("png:compression-level", "9");
            let _ = wand.set_image_property("png:compression-strategy", "2"); // 圧縮戦略を調整

            // パレット最適化を適用
            if quality < 90 {
                let _ = wand.set_image_type(magick_rust::ImageType::Palette);
            }
        },
        "webp" => {
            tracing::debug!("WebP最適化設定適用");
            // WebPに適した設定
            let _ = wand.set_image_property("webp:lossless", "false");
            let _ = wand.set_image_property("webp:method", "6"); // 最適な圧縮レベル
        },
        _ => {
            tracing::debug!("一般的な圧縮設定を適用");
            // その他の形式にはデフォルト設定を使用
        }
    }

    // 画像ストリップ処理（メタデータ削除）でさらに圧縮
    if let Err(e) = wand.strip_image() {
        tracing::warn!("メタデータ削除エラー: {:?}", e);
        // エラーは無視して続行
    }

    // 画像を保存
    match wand.write_image(output) {
        Ok(_) => {
            tracing::debug!("圧縮画像の保存成功: {}", output);
            Ok(())
        },
        Err(e) => {
            tracing::error!("圧縮画像の保存エラー: {:?}", e);
            Err(anyhow!("Failed to save compressed image: {}", e))
        }
    }
}