import { createServerClient } from "@/lib/supabase"
import { extractWithMistralOcr } from "@/lib/mistralOcr"
import { parseStructured } from "@/lib/openrouter"
import { buildSystemPrompt } from "@/lib/systemPrompt"
import { NextResponse } from "next/server"

export const maxDuration = 60 // Allow up to 60s for LLM processing

export async function POST(req: Request) {
    try {
        const formData = await req.formData()
        const file = formData.get("file") as File

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }

        // Diagnostic: log env var status (NOT values)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY
        console.log("[OCR] ENV CHECK:", {
            SUPABASE_URL: supabaseUrl ? `SET (${supabaseUrl.substring(0, 30)}...)` : "EMPTY!",
            SERVICE_KEY: hasServiceKey ? "SET" : "EMPTY!",
            MISTRAL_KEY: !!process.env.MISTRAL_API_KEY ? "SET" : "EMPTY!",
            OPENROUTER_KEY: !!process.env.OPENROUTER_API_KEY ? "SET" : "EMPTY!",
        })

        const buffer = Buffer.from(await file.arrayBuffer())
        const base64 = buffer.toString("base64")
        console.log(`[OCR] File received: ${file.name}, size: ${buffer.length} bytes, type: ${file.type}`)

        const supabase = createServerClient()

        // 1. Upload scan ke Storage (Bucket name must be biodata-scans)
        const fileExt = file.name.split('.').pop()
        const fileName = `scans/${Date.now()}_scan.${fileExt}`

        console.log(`[OCR] Uploading to storage: bucket=biodata-scans, path=${fileName}`)

        const { error: uploadError } = await supabase.storage
            .from("biodata-scans")
            .upload(fileName, buffer, { contentType: file.type })

        if (uploadError) {
            // Log the full error object including the cause chain
            console.error("[OCR] Storage Error:", JSON.stringify(uploadError, null, 2))
            console.error("[OCR] Storage Error cause:", (uploadError as any).cause)
            console.error("[OCR] Storage Error __isStorageError:", (uploadError as any).__isStorageError)
            throw new Error(`Upload Failed: ${uploadError.message}`)
        }
        console.log("[OCR] Storage upload successful!")

        // 2. OCR via Mistral AI (dedicated OCR endpoint)
        console.log("[OCR] Step 2: Starting OCR extraction via Mistral OCR...")
        let rawOcrText = ""
        try {
            rawOcrText = await extractWithMistralOcr(base64, file.type)
            console.log(`[OCR] Step 2 complete: extracted ${rawOcrText.length} chars`)
        } catch (ocrErr: any) {
            throw new Error(`OCR Extraction Failed: ${ocrErr.message}`)
        }

        // 3. Parse + decode via OpenRouter (Gemini)
        console.log("[OCR] Step 3: Starting structured parsing via Gemini...")
        const systemPrompt = buildSystemPrompt()
        let parsed
        try {
            parsed = await parseStructured(rawOcrText, systemPrompt)
            console.log(`[OCR] Step 3 complete: ${parsed.anggota?.length || 0} anggota parsed`)
        } catch (parseErr: any) {
            throw new Error(`Parsing Failed: ${parseErr.message}`)
        }

        // 4. Simpan ke database
        // Gunakan ocr_keluarga untuk menghindari konflik dengan tabel keluarga eksis (int4)
        const { data: keluarga, error: kError } = await supabase
            .from("ocr_keluarga")
            .insert({
                ...parsed.keluarga,
                scan_url: fileName,
                raw_ocr_text: rawOcrText,
                status: "pending_review"
            })
            .select()
            .single()

        if (kError) {
            console.error("DB Error (Keluarga):", kError)
            throw new Error(`DB Insert Keluarga Failed: ${kError.message}`)
        }

        // Prepare anggota records pointing back to new family ID
        const anggotaRows = parsed.anggota.map((a: any) => ({
            ...a,
            keluarga_id: keluarga.id
        }))

        // Gunakan ocr_anggota_keluarga
        const { error: aError } = await supabase
            .from("ocr_anggota_keluarga")
            .insert(anggotaRows)

        if (aError) {
            console.error("DB Error (Anggota):", aError)
            throw new Error(`DB Insert Anggota Failed: ${aError.message}`)
        }

        // Check if any anggota needs review
        const hasReview = parsed.anggota.some((a: any) => a.needs_review)

        return NextResponse.json({
            success: true,
            keluarga_id: keluarga.id,
            needs_review: hasReview,
            anggota_count: parsed.anggota.length
        })

    } catch (err: any) {
        console.error("OCR API Error:", err)
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 })
    }
}
