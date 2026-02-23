import { OcrParseResult } from "@/types/biodata"

const OR_BASE = "https://openrouter.ai/api/v1/chat/completions"
const MODELS = {
    ocr: "qwen/qwen-vl-plus",                     // Vision OCR - Qwen VL Plus
    vision: "qwen/qwen2.5-vl-72b-instruct",      // fallback vision model
    parser: "google/gemini-2.5-flash",            // Structured JSON parser
}

async function callOpenRouter(model: string, messages: any[], useJsonConfig: boolean = false) {
    const reqBody: any = { model, messages }

    if (useJsonConfig) {
        reqBody.response_format = { type: "json_object" }
    }

    console.log(`[OpenRouter] Calling model: ${model} (json=${useJsonConfig})`)
    const startTime = Date.now()

    // 90 second timeout to prevent infinite hangs
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 90_000)

    try {
        const res = await fetch(OR_BASE, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://gki-biodata.vercel.app",
            },
            body: JSON.stringify(reqBody),
            signal: controller.signal
        })

        clearTimeout(timeout)
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)

        if (!res.ok) {
            const errorText = await res.text()
            console.error(`[OpenRouter] Error ${res.status} after ${elapsed}s: ${errorText.substring(0, 200)}`)
            throw new Error(`OpenRouter error: ${res.status} - ${errorText}`)
        }

        const data = await res.json()
        const content = data.choices[0].message.content
        console.log(`[OpenRouter] ✓ Response from ${model} in ${elapsed}s (${content.length} chars)`)
        return content
    } catch (err: any) {
        clearTimeout(timeout)
        if (err.name === 'AbortError') {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
            console.error(`[OpenRouter] ✗ Timeout after ${elapsed}s for model ${model}`)
            throw new Error(`OpenRouter timeout (90s) for model ${model}`)
        }
        throw err
    }
}

// STEP 1: Ekstrak teks mentah
export async function extractOCR(imageBase64: string): Promise<string> {
    return callOpenRouter(MODELS.ocr, [{
        role: "user",
        content: [
            {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
            },
            {
                type: "text",
                text: "Ekstrak semua teks dari formulir ini secara verbatim. Pertahankan struktur tabel dan urutan kolom. Tulis label kolom di depan setiap nilai."
            }
        ]
    }])
}

// STEP 2: Parse + decode kode
export async function parseStructured(
    rawText: string,
    systemPrompt: string
): Promise<OcrParseResult> {
    const content = await callOpenRouter(MODELS.parser, [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Parse form GKI berikut ke JSON:\n\n${rawText}` }
    ], true)
    return JSON.parse(content)
}

// STEP 2b: Fallback dengan Qwen Vision jika confidence rendah
export async function validateWithVision(
    imageBase64: string,
    fieldName: string,
    currentValue: string
): Promise<{ value: string; confidence: number }> {
    const content = await callOpenRouter(MODELS.vision, [{
        role: "user",
        content: [
            {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` }
            },
            {
                type: "text",
                text: `Pada formulir ini, apa nilai untuk field "${fieldName}"? Nilai saat ini: "${currentValue}". Berikan JSON: {"value": "...", "confidence": 0.0-1.0}`
            }
        ]
    }], true)
    return JSON.parse(content)
}
