pub mod converter;
pub mod compressor;

#[cfg(test)]
mod tests {
    use super::converter;
    use std::fs;
    use std::path::PathBuf;

    #[test]
    fn test_imagemagick_conversion() {
        // ImageMagickの初期化
        magick_rust::magick_wand_genesis();

        // テストディレクトリを取得
        let test_dir = PathBuf::from("tests/fixtures");

        // 入力ファイルと出力ファイルのパスを設定
        let input_jpg = test_dir.join("test_input.jpg");
        let output_webp = test_dir.join("test_output.webp");

        println!("入力ファイル: {:?}", input_jpg);
        println!("出力ファイル: {:?}", output_webp);

        // 入力ファイルの存在確認
        assert!(input_jpg.exists(), "テスト用入力ファイルが見つかりません");

        // JPGからWebPへの変換テスト
        let result = converter::convert_image(
            input_jpg.to_str().unwrap(),
            output_webp.to_str().unwrap(),
            "webp"
        );

        // テスト関数内に追加
        println!("出力ファイルの存在確認: {}", output_webp.exists());
        if output_webp.exists() {
            println!("出力ファイルサイズ: {} bytes", fs::metadata(&output_webp).unwrap().len());
        } else {
            println!("出力ファイルが見つかりません！");
        }

        // ImageMagickのクリーンアップ
        magick_rust::magick_wand_terminus();

        // 結果確認
        assert!(result.is_ok(), "変換に失敗: {:?}", result);

        // 出力ファイルができているか確認
        assert!(output_webp.exists(), "出力ファイルが作成されていません");

        // 後片付け outputファイルを削除する
        let _ = fs::remove_file(output_webp);
    }
}