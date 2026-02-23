import { createServerClient } from "@/lib/supabase"
import { generateCSV } from "@/lib/csvExport"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const jemaat = searchParams.get("jemaat")
        const klasis = searchParams.get("klasis")
        const status = searchParams.get("status") ?? "confirmed" // Default only export confirmed

        const supabase = createServerClient()
        let query = supabase.from("v_biodata_export").select("*")

        if (jemaat) query = query.ilike("jemaat", `%${jemaat}%`)
        if (klasis) query = query.ilike("klasis", `%${klasis}%`)
        if (status !== "all") query = query.eq("status_data", status)

        // Order by created_at then order by no_urut
        query = query.order('keluarga_id', { ascending: false }).order('no_urut', { ascending: true })

        const { data, error } = await query
        if (error) throw error

        const csv = generateCSV(data ?? [])
        const filename = `biodata_gki_${new Date().toISOString().slice(0, 10)}.csv`

        return new Response(csv, {
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${filename}"`,
            }
        })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
