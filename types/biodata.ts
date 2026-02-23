export interface Keluarga {
  id: string
  provinsi: string | null
  kab_kota: string | null
  distrik_kel_kamp: string | null
  nama_kepala_keluarga: string
  alamat: string | null
  kode_pos: string | null
  rt: string | null
  rw: string | null
  telepon: string | null
  sinode_wilayah: string | null
  klasis: string | null
  lingkungan: string | null
  jemaat: string | null
  wyk_rayon_sektor: string | null
  scan_url: string | null
  raw_ocr_text: string | null
  status: 'pending_review' | 'confirmed' | 'error'
  created_at: string
  updated_at: string
  anggota_keluarga?: AnggotaKeluarga[]
}

export interface AnggotaKeluarga {
  id: string
  keluarga_id: string
  no_urut: number
  nama_lengkap: string
  jenis_kelamin: number | null
  tempat_lahir: string | null
  tanggal_lahir: string | null
  golongan_darah: number | null
  jabatan_jemaat: number | null
  status_baptis: number | null
  status_sidi: number | null
  status_pernikahan: number | null
  tgl_nikah: string | null
  tempat_nikah: string | null
  status_hub_keluarga: number | null
  pendidikan_terakhir: number | null
  gelar_terakhir: string | null
  pekerjaan: number | null
  asal_gereja: string | null
  nama_ibu: string | null
  nama_ayah: string | null
  suku: string | null
  intra: number | null
  status_domisili: number | null
  needs_review: boolean
  review_fields: string[]
  confidence_score: number | null
  id_gereja: string | null
}

// Hasil parsing dari LLM (sebelum masuk DB)
export interface OcrParseResult {
  keluarga: Omit<Keluarga, 'id' | 'created_at' | 'updated_at' | 'status' | 'scan_url' | 'raw_ocr_text'>
  anggota: Omit<AnggotaKeluarga, 'id' | 'keluarga_id' | 'created_at' | 'updated_at'>[]
}
