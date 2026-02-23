/**
 * Mistral AI OCR — Direct API integration
 * Uses the dedicated /v1/ocr endpoint (not chat completions)
 * Docs: https://docs.mistral.ai/capabilities/document_ai/basic_ocr
 */

const MISTRAL_OCR_URL = "https://api.mistral.ai/v1/ocr"

interface MistralOcrPage {
    index: number
    markdown: string
    images: any[]
    tables: any[]
    dimensions: { width: number; height: number }
}

interface MistralOcrResponse {
    pages: MistralOcrPage[]
    model: string
    usage_info: { pages_processed: number; doc_size_bytes: number }
}

/**
 * Extract text from an image using Mistral OCR
 * @param imageBase64 - Base64 encoded image (without data:... prefix)
 * @param mimeType - Image MIME type (e.g. "image/jpeg")
 * @returns Extracted markdown text from all pages
 */
export async function extractWithMistralOcr(
    imageBase64: string,
    mimeType: string = "image/jpeg"
): Promise<string> {
    const apiKey = process.env.MISTRAL_API_KEY
    if (!apiKey) {
        throw new Error("MISTRAL_API_KEY is not set in environment variables")
    }

    console.log(`[MistralOCR] Starting OCR extraction...`)
    const startTime = Date.now()

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 90_000)

    try {
        const res = await fetch(MISTRAL_OCR_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "mistral-ocr-latest",
                document: {
                    type: "image_url",
                    image_url: `data:${mimeType};base64,${imageBase64}`
                },
                include_image_base64: false
            }),
            signal: controller.signal
        })

        clearTimeout(timeout)
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

        if (!res.ok) {
            const errorText = await res.text()
            console.error(`[MistralOCR] Error ${res.status} after ${elapsed}s: ${errorText.substring(0, 300)}`)
            throw new Error(`Mistral OCR error: ${res.status} - ${errorText}`)
        }

        const data: MistralOcrResponse = await res.json()
        const allMarkdown = data.pages.map(p => p.markdown).join("\n\n")

        console.log(`[MistralOCR] ✓ OCR complete in ${elapsed}s — ${data.pages.length} page(s), ${allMarkdown.length} chars extracted`)

        return allMarkdown
    } catch (err: any) {
        clearTimeout(timeout)
        if (err.name === 'AbortError') {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
            console.error(`[MistralOCR] ✗ Timeout after ${elapsed}s`)
            throw new Error("Mistral OCR timeout (90s)")
        }
        throw err
    }
}
