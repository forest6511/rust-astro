// src/lib/api.ts
const API_ENDPOINT = import.meta.env.PUBLIC_API_ENDPOINT || 'http://localhost:8080';

export async function convertImages(files: File[], format: string) {
  const formData = new FormData();

  // フォーマットが空でないことを確認
  const safeFormat = format || 'webp';

  // ファイルをフォームデータに追加
  files.forEach((file) => {
    formData.append('files', file);
    console.log(`ファイル追加: ${file.name}, サイズ: ${Math.round(file.size / 1024)}KB, タイプ: ${file.type}`);
  });

  // フォーマットをフォームデータに追加
  formData.append('format', safeFormat);
  console.log(`変換フォーマット: ${safeFormat}`);

  try {
    console.log(`API リクエスト送信: ${API_ENDPOINT}/convert/images`);
    const startTime = performance.now();

    const response = await fetch(`${API_ENDPOINT}/convert/images`, {
      method: 'POST',
      body: formData,
    });

    const endTime = performance.now();
    console.log(`API レスポンス受信: ${Math.round(endTime - startTime)}ms`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`変換完了: ${data.files.length}個のファイル`);

    return data;
  } catch (error) {
    console.error('Image conversion error:', error);
    throw error;
  }
}