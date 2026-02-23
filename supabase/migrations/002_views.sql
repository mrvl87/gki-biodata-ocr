-- -----------------------------------------------
-- VIEW: BIODATA LENGKAP DENGAN LABEL
-- Digunakan untuk export CSV
-- -----------------------------------------------
create or replace view v_biodata_export as
select
  k.id                                                  as keluarga_id,
  k.nama_kepala_keluarga,
  k.provinsi, k.kab_kota, k.distrik_kel_kamp,
  k.sinode_wilayah, k.klasis, k.lingkungan,
  k.jemaat, k.wyk_rayon_sektor,
  k.alamat, k.kode_pos, k.rt, k.rw, k.telepon,
  k.status                                              as status_data,

  a.no_urut,
  a.nama_lengkap,
  case a.jenis_kelamin
    when 1 then 'Laki-laki'
    when 2 then 'Perempuan'
  end                                                   as jenis_kelamin,
  a.tempat_lahir,
  to_char(a.tanggal_lahir, 'DD-MM-YYYY')               as tanggal_lahir,
  case a.golongan_darah
    when 1 then 'A'   when 2 then 'B'   when 3 then 'AB'  when 4 then 'O'
    when 5 then 'A+'  when 6 then 'A-'  when 7 then 'B+'  when 8 then 'B-'
    when 9 then 'AB+' when 10 then 'AB-' when 11 then 'O+' when 12 then 'O-'
    when 13 then 'Tidak Tahu'
  end                                                   as golongan_darah,
  case a.jabatan_jemaat
    when 1 then 'Pendeta'           when 2 then 'Guru Jemaat'
    when 3 then 'Guru Injil'        when 4 then 'Penatua'
    when 5 then 'Syamas'            when 6 then 'Pengasuh Sekolah Minggu'
    when 7 then 'Kostor'            when 8 then 'Anggota Jemaat'
    when 9 then 'Lain-lain'
  end                                                   as jabatan_jemaat,
  case a.status_baptis
    when 1 then 'Belum' when 2 then 'Sudah' when 3 then 'Tidak Tahu'
  end                                                   as status_baptis,
  case a.status_sidi
    when 1 then 'Belum' when 2 then 'Sudah' when 3 then 'Tidak Tahu'
  end                                                   as status_sidi,
  case a.status_pernikahan
    when 1 then 'Belum'       when 2 then 'Sudah'
    when 3 then 'Cerai Hidup' when 4 then 'Cerai Mati'
    when 5 then 'Tidak Tahu'
  end                                                   as status_pernikahan,
  to_char(a.tgl_nikah, 'DD-MM-YYYY')                   as tgl_nikah,
  a.tempat_nikah,
  case a.status_hub_keluarga
    when 1 then 'Kepala Keluarga'   when 2 then 'Suami'
    when 3 then 'Istri'             when 4 then 'Anak'
    when 5 then 'Menantu'           when 6 then 'Cucu'
    when 7 then 'Orang Tua'         when 8 then 'Mertua'
    when 9 then 'Famili Lainnya'    when 10 then 'Pembantu'
    when 11 then 'Lainnya'
  end                                                   as hub_keluarga,
  case a.pendidikan_terakhir
    when 1 then 'Tdk/Blm Sekolah'  when 2 then 'Belum Tamat SD'
    when 3 then 'Tamat SD'         when 4 then 'SLTP'
    when 5 then 'SLTA'             when 6 then 'Diploma I'
    when 7 then 'Diploma III'      when 8 then 'Strata I'
    when 9 then 'Strata II'        when 10 then 'Strata III'
  end                                                   as pendidikan_terakhir,
  a.gelar_terakhir,
  a.pekerjaan                                           as kode_pekerjaan,
  -- label pekerjaan ditangani di aplikasi (75 nilai)
  a.asal_gereja,
  a.nama_ibu, a.nama_ayah, a.suku,
  case a.intra
    when 1 then 'PKB' when 2 then 'PW'
    when 3 then 'PAM' when 4 then 'PAR'
  end                                                   as intra,
  case a.status_domisili
    when 1 then 'Tetap'
    when 2 then 'Tidak Tetap / Menumpang'
    when 3 then 'Kontrak'
    when 4 then 'Lain-lain'
  end                                                   as status_domisili,
  a.needs_review,
  a.confidence_score

from keluarga k
join anggota_keluarga a on a.keluarga_id = k.id
order by k.created_at desc, a.no_urut asc;
