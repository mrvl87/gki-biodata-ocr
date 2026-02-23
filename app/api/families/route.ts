import { createServerClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const status = searchParams.get("status") // null = all statuses
        const search = searchParams.get("search")

        const supabase = createServerClient()

        let query = supabase
            .from('ocr_keluarga')
            .select('id, nama_kepala_keluarga, jemaat, klasis, status, created_at, updated_at')
            .order('created_at', { ascending: false })

        if (status) {
            query = query.eq('status', status)
        }

        if (search) {
            query = query.ilike('nama_kepala_keluarga', `%${search}%`)
        }

        const { data: families, error } = await query

        if (error) throw error

        // For each family, get count of anggota
        const enriched = await Promise.all(
            (families || []).map(async (f) => {
                const { count } = await supabase
                    .from('ocr_anggota_keluarga')
                    .select('*', { count: 'exact', head: true })
                    .eq('keluarga_id', f.id)

                const { count: reviewCount } = await supabase
                    .from('ocr_anggota_keluarga')
                    .select('*', { count: 'exact', head: true })
                    .eq('keluarga_id', f.id)
                    .eq('needs_review', true)

                return { ...f, anggota_count: count || 0, review_count: reviewCount || 0 }
            })
        )

        return NextResponse.json(enriched)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
