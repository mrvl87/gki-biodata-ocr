-- =============================================
-- SCHEMA GKI BIODATA
-- =============================================

create extension if not exists "uuid-ossp";

-- -----------------------------------------------
-- TABEL UTAMA: OCR KELUARGA
-- -----------------------------------------------
create table ocr_keluarga (
  id                  uuid primary key default uuid_generate_v4(),

  -- Data wilayah
  provinsi            text,
  kab_kota            text,
  distrik_kel_kamp    text,
  sinode_wilayah      text,
  klasis              text,
  lingkungan          text,
  jemaat              text,
  wyk_rayon_sektor    text,

  -- Data kontak
  nama_kepala_keluarga text not null,
  alamat              text,
  kode_pos            varchar(10),
  rt                  varchar(5),
  rw                  varchar(5),
  telepon             varchar(20),

  -- Metadata OCR
  scan_url            text,           -- path di Supabase Storage
  raw_ocr_text        text,           -- hasil Mistral OCR mentah
  status              text default 'pending_review'
                      check (status in ('pending_review', 'confirmed', 'error')),

  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- -----------------------------------------------
-- TABEL UTAMA: OCR ANGGOTA KELUARGA
-- -----------------------------------------------
create table ocr_anggota_keluarga (
  id                  uuid primary key default uuid_generate_v4(),
  keluarga_id         uuid references ocr_keluarga(id) on delete cascade,
  no_urut             smallint,

  -- Identitas
  nama_lengkap        text not null,
  jenis_kelamin       smallint,       -- 1=L, 2=P
  tempat_lahir        text,
  tanggal_lahir       date,
  golongan_darah      smallint,       -- kode 1-13
  suku                text,

  -- Status gereja
  jabatan_jemaat      smallint,       -- kode 1-9
  status_baptis       smallint,       -- 1=Belum, 2=Sudah, 3=Tidak Tahu
  status_sidi         smallint,
  asal_gereja         text,
  intra               smallint,       -- 1=PKB, 2=PW, 3=PAM, 4=PAR

  -- Status pernikahan
  status_pernikahan   smallint,       -- kode 1-5
  tgl_nikah           date,
  tempat_nikah        text,

  -- Relasi keluarga
  status_hub_keluarga smallint,       -- kode 1-11

  -- Pendidikan & pekerjaan
  pendidikan_terakhir smallint,       -- kode 1-10
  gelar_terakhir      text,
  pekerjaan           smallint,       -- kode 1-75

  -- Silsilah
  nama_ibu            text,
  nama_ayah           text,

  -- Domisili
  status_domisili     smallint,       -- kode 1-4

  -- Metadata review
  needs_review        boolean default false,
  review_fields       text[],         -- nama field yang perlu dicek
  confidence_score    float,          -- rata-rata confidence 0.0-1.0

  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

-- Index untuk performa query
create index idx_ocr_anggota_keluarga_id  on ocr_anggota_keluarga(keluarga_id);
create index idx_ocr_keluarga_jemaat      on ocr_keluarga(jemaat);
create index idx_ocr_keluarga_klasis      on ocr_keluarga(klasis);
create index idx_ocr_keluarga_status      on ocr_keluarga(status);
create index idx_ocr_nama_search          on ocr_anggota_keluarga
  using gin(to_tsvector('simple', nama_lengkap));

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_ocr_keluarga_updated
  before update on ocr_keluarga
  for each row execute function update_updated_at();

create trigger trg_ocr_anggota_updated
  before update on ocr_anggota_keluarga
  for each row execute function update_updated_at();
