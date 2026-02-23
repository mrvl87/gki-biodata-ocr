export const CODE_MAPS = {
    jenisKelamin: { 1: "Laki-laki", 2: "Perempuan" },
    golonganDarah: {
        1: "A", 2: "B", 3: "AB", 4: "O",
        5: "A+", 6: "A-", 7: "B+", 8: "B-",
        9: "AB+", 10: "AB-", 11: "O+", 12: "O-", 13: "Tidak Tahu"
    },
    jabatanJemaat: {
        1: "Pendeta", 2: "Guru Jemaat", 3: "Guru Injil",
        4: "Penatua", 5: "Syamas", 6: "Pengasuh Sekolah Minggu",
        7: "Kostor", 8: "Anggota Jemaat", 9: "Lain-lain"
    },
    statusBaptisSidi: { 1: "Belum", 2: "Sudah", 3: "Tidak Tahu" },
    statusPernikahan: {
        1: "Belum", 2: "Sudah", 3: "Cerai Hidup",
        4: "Cerai Mati", 5: "Tidak Tahu"
    },
    hubKeluarga: {
        1: "Kepala Keluarga", 2: "Suami", 3: "Istri",
        4: "Anak", 5: "Menantu", 6: "Cucu",
        7: "Orang Tua", 8: "Mertua",
        9: "Famili Lainnya", 10: "Pembantu", 11: "Lainnya"
    },
    pendidikan: {
        1: "Tdk/Blm Sekolah", 2: "Belum Tamat SD", 3: "Tamat SD",
        4: "SLTP", 5: "SLTA", 6: "Diploma I",
        7: "Diploma III", 8: "Strata I", 9: "Strata II", 10: "Strata III"
    },
    pekerjaan: {
        1: "Blm/Tdk Bekerja", 2: "Mengurus RT", 3: "Pelajar/Mahasiswa",
        4: "Pensiunan", 5: "PNS", 6: "TNI",
        7: "POLRI", 8: "Perdagangan", 9: "Petani/Kebun",
        10: "Peternak", 11: "Nelayan/Perikanan", 12: "Industri",
        13: "Konstruksi", 14: "Transportasi", 15: "Kary. Swasta",
        16: "Kary. BUMN", 17: "Kary. BUMD", 18: "Kary. Honorer",
        19: "Buruh Harian Lepas", 20: "Pembantu RT", 21: "Tukang Cukur",
        22: "Tukang Listrik", 23: "Tukang Batu", 24: "Tukang Kayu",
        25: "Guru Injil", 26: "Tkg. Las/Besi", 27: "Tkg. Jahit",
        28: "Tkg. Gigi", 29: "Penata Rias", 30: "Penata Busana",
        31: "Penata Rambut", 32: "Mekanik", 33: "Seniman",
        34: "Percng. Busana", 35: "Penterjemah", 36: "Pendeta",
        37: "Wartawan", 38: "Juru Masak", 39: "Promotor Acara",
        40: "Angg. DPR RI", 41: "Angg. DPD", 42: "Angg. BPK",
        43: "Gubernur", 44: "Wakil Gubernur", 45: "Bupati",
        46: "Wakil Bupati", 47: "Wali Kota", 48: "Wakil Wali Kota",
        49: "Angg. DPRD Prov", 50: "Angg. DPRD Kab/Kota",
        51: "Dosen", 52: "Guru", 53: "Pilot",
        54: "Pengacara", 55: "Notaris", 56: "Arsitek",
        57: "Akuntan", 58: "Konsultan", 59: "Dokter",
        60: "Bidan", 61: "Perawat", 62: "Apoteker",
        63: "Psikiater/Psikolog", 64: "Penyiar Televisi", 65: "Penyiar Radio",
        66: "Pelaut", 67: "Peneliti", 68: "Sopir",
        69: "Pedagang", 70: "Perangkat Kampung", 71: "Kepala Kampung",
        72: "Wiraswasta", 73: "Guru Jemaat", 74: "Tukang Sol Sepatu",
        75: "Pegawai Gereja"
    },
    intra: { 1: "PKB", 2: "PW", 3: "PAM", 4: "PAR" },
    statusDomisili: {
        1: "Tetap", 2: "Tidak Tetap / Menumpang",
        3: "Kontrak", 4: "Lain-lain"
    }
} as const

export type CodeMapKey = keyof typeof CODE_MAPS

export function decodeLabel(map: CodeMapKey, kode: number | null): string {
    if (!kode) return "-"
    return (CODE_MAPS[map] as Record<number, string>)[kode] ?? `Kode ${kode}`
}
