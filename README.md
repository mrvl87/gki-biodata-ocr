# 📋 GKI Biodata OCR

**Sistem digitalisasi formulir Biodata Warga Jemaat GKI** — scan formulir kertas, ekstrak data otomatis via AI OCR, review & edit, lalu simpan ke database.

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 📸 **Scan Upload** | Drag-and-drop upload formulir (JPG/PNG/PDF) ke Supabase Storage |
| 🤖 **AI OCR** | Ekstraksi teks otomatis via **Mistral OCR** (`mistral-ocr-latest`) |
| 🧠 **Smart Parsing** | Konversi teks → JSON terstruktur via **Gemini 2.5 Flash** (OpenRouter) |
| ✏️ **Review & Edit** | UI accordion per anggota, field yang perlu review ditandai amber |
| 🏷️ **Church ID** | Auto-generate ID Gereja format `GGK-YYYYMMDD-FFFF-NNN` saat konfirmasi |
| 📊 **Dashboard** | Daftar keluarga dengan filter, search, dan statistik |
| 🔄 **Full CRUD** | Tambah/hapus anggota, edit semua field, konfirmasi/hapus keluarga |

---

## 🏗️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Animation** | Framer Motion |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage (`biodata-scans` bucket) |
| **OCR** | Mistral AI OCR API (dedicated `/v1/ocr` endpoint) |
| **Parsing** | OpenRouter → Google Gemini 2.5 Flash |
| **Icons** | Lucide React |

---

## 📁 Struktur Proyek

```
gki-biodata/
├── app/
│   ├── api/
│   │   ├── ocr/route.ts              # Upload + OCR + Parse + Save
│   │   └── families/
│   │       ├── route.ts              # GET list keluarga (search, filter)
│   │       └── [id]/route.ts         # GET, PATCH, POST, DELETE per keluarga
│   ├── upload/page.tsx               # Halaman upload scan
│   ├── data/page.tsx                 # Dashboard daftar keluarga
│   └── review/[keluarga_id]/page.tsx # Review & edit data hasil OCR
├── lib/
│   ├── mistralOcr.ts                 # Integrasi Mistral AI OCR
│   ├── openrouter.ts                 # Integrasi OpenRouter (Gemini parser)
│   ├── systemPrompt.ts              # Prompt parsing formulir GKI
│   ├── codeMaps.ts                   # Mapping kode → label Indonesia
│   ├── churchId.ts                   # Generator ID Gereja
│   └── supabase.ts                   # Supabase client helpers
├── components/ui/                    # shadcn/ui components
├── types/biodata.ts                  # TypeScript interfaces
└── supabase/migrations/              # SQL migrations
```

---

## 🔧 Pipeline OCR

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  Upload  │────▶│  Mistral OCR │────▶│ Gemini Parse │────▶│ Supabase │
│  (Scan)  │     │  (Teks RAW)  │     │   (JSON)     │     │   (DB)   │
└──────────┘     └──────────────┘     └──────────────┘     └──────────┘
       │                                                         │
       └────── Supabase Storage ◀────────────────────────────────┘
                (biodata-scans)                          Review Page
```

1. **Upload** — Gambar disimpan ke Supabase Storage
2. **Mistral OCR** — `mistral-ocr-latest` mengekstrak teks dari gambar
3. **Gemini Parse** — Teks → JSON terstruktur (keluarga + anggota)
4. **Save** — Data disimpan ke tabel `ocr_keluarga` + `ocr_anggota_keluarga`
5. **Review** — User review, edit, tambah/hapus anggota, lalu konfirmasi

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Akun [Supabase](https://supabase.com)
- API Key [Mistral AI](https://console.mistral.ai)
- API Key [OpenRouter](https://openrouter.ai)

### Installation

```bash
# Clone repo
git clone https://github.com/mrvl87/gki-biodata-ocr.git
cd gki-biodata-ocr

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
```

### Environment Variables

Buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MISTRAL_API_KEY=your_mistral_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Database Setup

Jalankan migration di Supabase SQL Editor:

```sql
-- Tabel keluarga
CREATE TABLE ocr_keluarga (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nama_kepala_keluarga TEXT NOT NULL,
    jemaat TEXT,
    klasis TEXT,
    alamat TEXT,
    provinsi TEXT,
    kab_kota TEXT,
    telepon TEXT,
    scan_url TEXT,
    status TEXT DEFAULT 'pending_review',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel anggota keluarga
CREATE TABLE ocr_anggota_keluarga (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keluarga_id UUID REFERENCES ocr_keluarga(id),
    no_urut INTEGER,
    nama_lengkap TEXT NOT NULL,
    jenis_kelamin INTEGER,
    tempat_lahir TEXT,
    tanggal_lahir TEXT,
    golongan_darah INTEGER,
    jabatan_jemaat INTEGER,
    status_baptis INTEGER,
    status_sidi INTEGER,
    status_pernikahan INTEGER,
    tgl_nikah TEXT,
    tempat_nikah TEXT,
    status_hub_keluarga INTEGER,
    pendidikan_terakhir INTEGER,
    gelar_terakhir TEXT,
    pekerjaan INTEGER,
    asal_gereja TEXT,
    nama_ibu TEXT,
    nama_ayah TEXT,
    suku TEXT,
    intra INTEGER,
    status_domisili INTEGER,
    needs_review BOOLEAN DEFAULT true,
    review_fields TEXT[] DEFAULT '{}',
    confidence_score FLOAT,
    id_gereja TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 🏷️ Format Church ID

```
GGK-YYYYMMDD-FFFF-NNN
 │    │        │    └── Nomor urut anggota dalam keluarga (001, 002, ...)
 │    │        └────── 4 karakter terakhir UUID keluarga
 │    └─────────────── Tanggal lahir anggota
 └──────────────────── Prefix GKI
```

**Contoh:** `GGK-19890521-A3F8-001`

---

## 📄 License

MIT License — Bebas digunakan untuk keperluan gereja dan organisasi non-profit.
