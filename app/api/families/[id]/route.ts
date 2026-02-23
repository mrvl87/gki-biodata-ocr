import { createServerClient } from "@/lib/supabase"
import { generateChurchId } from "@/lib/churchId"
import { NextResponse } from "next/server"

// GET /api/families/[id] — Full family detail with anggota
export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const supabase = createServerClient()

        const { data: keluarga, error: kError } = await supabase
            .from('ocr_keluarga')
            .select('*')
            .eq('id', params.id)
            .single()

        if (kError) throw kError

        const { data: anggota, error: aError } = await supabase
            .from('ocr_anggota_keluarga')
            .select('*')
            .eq('keluarga_id', params.id)
            .order('no_urut', { ascending: true })

        if (aError) throw aError

        let scanUrlFull = null
        if (keluarga.scan_url) {
            const { data } = supabase.storage.from('biodata-scans').getPublicUrl(keluarga.scan_url)
            scanUrlFull = data.publicUrl
        }

        return NextResponse.json({
            ...keluarga,
            scan_url_full: scanUrlFull,
            anggota_keluarga: anggota || []
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// PATCH /api/families/[id] — Update family + anggota, confirm status
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        const { keluarga: keluargaUpdate, anggota: anggotaUpdates, action } = body

        const supabase = createServerClient()

        // Update keluarga fields
        if (keluargaUpdate) {
            const { error: kError } = await supabase
                .from('ocr_keluarga')
                .update({
                    ...keluargaUpdate,
                    updated_at: new Date().toISOString()
                })
                .eq('id', params.id)
            if (kError) throw kError
        }

        // Update anggota iteratively
        if (anggotaUpdates && Array.isArray(anggotaUpdates)) {
            for (const a of anggotaUpdates) {
                const { id, keluarga_id, created_at, updated_at, ...updateData } = a
                const { error: aError } = await supabase
                    .from('ocr_anggota_keluarga')
                    .update({
                        ...updateData,
                        needs_review: false,
                        review_fields: [],
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', a.id)
                    .eq('keluarga_id', params.id)
                if (aError) throw aError
            }
        }

        // Action: confirm all
        if (action === 'confirm') {
            const { error } = await supabase
                .from('ocr_keluarga')
                .update({ status: 'confirmed', updated_at: new Date().toISOString() })
                .eq('id', params.id)
            if (error) throw error

            // Clear all review flags
            const { error: clearErr } = await supabase
                .from('ocr_anggota_keluarga')
                .update({ needs_review: false, review_fields: [] })
                .eq('keluarga_id', params.id)
            if (clearErr) throw clearErr

            // Generate Church IDs for members that don't have one yet
            const { data: members } = await supabase
                .from('ocr_anggota_keluarga')
                .select('id, tanggal_lahir, no_urut, id_gereja')
                .eq('keluarga_id', params.id)
                .order('no_urut', { ascending: true })

            if (members) {
                for (const m of members) {
                    if (!m.id_gereja) {
                        const churchId = generateChurchId(m.tanggal_lahir, params.id, m.no_urut)
                        await supabase
                            .from('ocr_anggota_keluarga')
                            .update({ id_gereja: churchId })
                            .eq('id', m.id)
                    }
                }
            }
        }

        // Action: mark as needs follow-up (partial verification)
        if (action === 'followup') {
            const { error } = await supabase
                .from('ocr_keluarga')
                .update({ status: 'needs_followup', updated_at: new Date().toISOString() })
                .eq('id', params.id)
            if (error) throw error
            // Note: Church IDs are NOT generated — only on full confirm
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// POST /api/families/[id] — Add a new anggota to this family
export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json()
        const supabase = createServerClient()

        // Get next no_urut
        const { data: existing } = await supabase
            .from('ocr_anggota_keluarga')
            .select('no_urut')
            .eq('keluarga_id', params.id)
            .order('no_urut', { ascending: false })
            .limit(1)

        const nextUrut = existing && existing.length > 0 ? existing[0].no_urut + 1 : 1

        const { data: newAnggota, error } = await supabase
            .from('ocr_anggota_keluarga')
            .insert({
                keluarga_id: params.id,
                no_urut: nextUrut,
                nama_lengkap: body.nama_lengkap || "Anggota Baru",
                needs_review: true,
                review_fields: ["nama_lengkap"],
                confidence_score: 0,
                ...body
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json(newAnggota)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

// DELETE /api/families/[id]?anggota_id=xxx — Delete family or single anggota
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { searchParams } = new URL(req.url)
        const anggotaId = searchParams.get("anggota_id")
        const supabase = createServerClient()

        if (anggotaId) {
            // Delete single anggota
            const { error } = await supabase
                .from('ocr_anggota_keluarga')
                .delete()
                .eq('id', anggotaId)
                .eq('keluarga_id', params.id)
            if (error) throw error

            return NextResponse.json({ success: true, deleted: 'anggota' })
        }

        // Delete entire family: first remove scan from storage
        const { data: kData } = await supabase
            .from('ocr_keluarga')
            .select('scan_url')
            .eq('id', params.id)
            .single()

        if (kData?.scan_url) {
            await supabase.storage.from('biodata-scans').remove([kData.scan_url])
        }

        // Delete anggota first (FK constraint)
        await supabase
            .from('ocr_anggota_keluarga')
            .delete()
            .eq('keluarga_id', params.id)

        // Then delete family
        const { error } = await supabase
            .from('ocr_keluarga')
            .delete()
            .eq('id', params.id)

        if (error) throw error

        return NextResponse.json({ success: true, deleted: 'family' })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
