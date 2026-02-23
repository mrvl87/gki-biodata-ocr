-- =============================================
-- STORAGE BUCKET & RLS POLICIES
-- =============================================

-- 1. Create Storage Bucket for Scans
insert into storage.buckets (id, name, public)
values ('biodata-scans', 'biodata-scans', true)
on conflict (id) do nothing;

-- 2. Enable RLS on Tables
alter table public.ocr_keluarga enable row level security;
alter table public.ocr_anggota_keluarga enable row level security;

-- 3. RLS Policies for ocr_keluarga
-- Allow users to see their own records (or all records for this pro version)
create policy "Allow public select on ocr_keluarga"
on public.ocr_keluarga for select
using (true);

create policy "Allow service_role insert on ocr_keluarga"
on public.ocr_keluarga for insert
with check (true);

create policy "Allow service_role update on ocr_keluarga"
on public.ocr_keluarga for update
using (true);

-- 4. RLS Policies for ocr_anggota_keluarga
create policy "Allow public select on ocr_anggota_keluarga"
on public.ocr_anggota_keluarga for select
using (true);

create policy "Allow service_role insert on ocr_anggota_keluarga"
on public.ocr_anggota_keluarga for insert
with check (true);

create policy "Allow service_role update on ocr_anggota_keluarga"
on public.ocr_anggota_keluarga for update
using (true);

-- 5. RLS Policies for Storage (storage.objects)
-- Allow anyone to read files from the biodata-scans bucket
create policy "Public Read Access"
on storage.objects for select
using ( bucket_id = 'biodata-scans' );

-- Allow uploads to the biodata-scans bucket
create policy "Service Role Upload Access"
on storage.objects for insert
with check ( bucket_id = 'biodata-scans' );

-- Allow updates/deletes (important for cleanup or re-uploads)
create policy "Service Role Update Access"
on storage.objects for update
using ( bucket_id = 'biodata-scans' );

create policy "Service Role Delete Access"
on storage.objects for delete
using ( bucket_id = 'biodata-scans' );
