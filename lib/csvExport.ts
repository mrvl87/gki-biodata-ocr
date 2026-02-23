export function generateCSV(data: any[]): string {
    if (!data || data.length === 0) return ""

    // Assuming data is an array of objects representing rows from the Supabase View v_biodata_export
    const headers = Object.keys(data[0])

    const csvRows = [
        headers.join(','),
        ...data.map(row => {
            return headers.map(header => {
                let value = row[header]
                // Handle nulls and undefined
                if (value === null || value === undefined) {
                    return '""'
                }
                // Handle strings with commas, quotes, or newlines
                if (typeof value === 'string') {
                    value = value.replace(/"/g, '""')
                    if (value.search(/("|,|\n)/g) >= 0) {
                        value = `"${value}"`
                    }
                }
                return value
            }).join(',')
        })
    ]

    // Add BOM (\uFEFF) for Excel UTF-8 compatibility
    return "\uFEFF" + csvRows.join("\r\n")
}
