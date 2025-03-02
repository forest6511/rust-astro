// src/lib/api.ts
const API_ENDPOINT =
  import.meta.env.PUBLIC_API_ENDPOINT || 'https://api.example.com'

export async function convertImages(files: File[], format: string) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  formData.append('format', format)

  try {
    const response = await fetch(`${API_ENDPOINT}/convert/images`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Image conversion error:', error)
    throw error
  }
}