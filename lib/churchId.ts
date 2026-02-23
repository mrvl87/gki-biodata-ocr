/**
 * Generates a Church ID for a family member.
 * Format: GGK-YYYYMMDD-FFFF-NNN
 *
 * @param tanggalLahir - Birth date in YYYY-MM-DD format (or null)
 * @param keluargaId   - UUID of the family record
 * @param noUrut       - Sequential member number within the family
 * @returns Formatted church ID string
 */
export function generateChurchId(
    tanggalLahir: string | null,
    keluargaId: string,
    noUrut: number
): string {
    // 1. Parse birth date → YYYYMMDD
    let datePart = "00000000"
    if (tanggalLahir) {
        // Handle both YYYY-MM-DD and DD-MM-YYYY formats
        const cleaned = tanggalLahir.replace(/\//g, "-")
        const parts = cleaned.split("-")
        if (parts.length === 3) {
            if (parts[0].length === 4) {
                // YYYY-MM-DD
                datePart = `${parts[0]}${parts[1].padStart(2, "0")}${parts[2].padStart(2, "0")}`
            } else {
                // DD-MM-YYYY
                datePart = `${parts[2]}${parts[1].padStart(2, "0")}${parts[0].padStart(2, "0")}`
            }
        }
    }

    // 2. Extract last 4 chars of keluarga UUID, uppercase
    const familyPart = keluargaId.replace(/-/g, "").slice(-4).toUpperCase()

    // 3. Pad no_urut to 3 digits
    const seqPart = String(noUrut).padStart(3, "0")

    return `GGK-${datePart}-${familyPart}-${seqPart}`
}
