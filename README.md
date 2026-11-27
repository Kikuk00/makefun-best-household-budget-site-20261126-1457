# DompetKeluarga — Anggaran Rumah Tangga

[![DompetKeluarga](https://make.fun/c/best-household-budget-site-20261126-1457)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![Anggaran Keluarga Prasetyo](https://make.fun/c/best-household-budget-site-20261126-1457)](https://make.fun/c/best-household-budget-site-20261126-1457)
[![November 2026](https://make.fun/c/best-household-budget-site-20261126-1457)](https://make.fun/c/best-household-budget-site-20261126-1457)

DompetKeluarga adalah situs anggaran rumah tangga untuk Keluarga Prasetyo di Yogyakarta — pemasukan Rp 12.500.000, delapan pos belanja, 14 transaksi, tiga tabungan tujuan, dan enam tagihan untuk November 2026, semuanya tercatat rapi dan saling konsisten. Semua perubahan (tambah transaksi, ubah anggaran, tambah tabungan, tandai tagihan lunas) tersimpan di perangkat sendiri lewat localStorage — tidak ada akun, tidak ada server, tidak ada jaringan.

## Halaman

- **Dashboard** (`#/`): ringkasan pemasukan, pengeluaran, sisa uang, dan tabungan; pengeluaran terbesar; tagihan belum dibayar; transaksi terakhir; pemilih bulan (November / Oktober 2026).
- **Anggaran** (`#/anggaran`): delapan kategori dengan bilah progres anggaran vs terpakai, status Aman / Hampir habis / Anggaran habis, dan formulir ubah anggaran per kategori.
- **Transaksi** (`#/transaksi`): formulir catat pengeluaran baru, saring per kategori, dan tabel transaksi dengan tombol hapus.
- **Tabungan** (`#/tabungan`): tiga tujuan (Dana Pendidikan Anak, Renovasi Dapur, Liburan Keluarga) dengan progres dan formulir tambah tabungan.
- **Tagihan** (`#/tagihan`): enam tagihan dengan status jatuh tempo (lunas, terlambat, hari ini, akan datang) dan tombol tandai lunas.
- **Laporan** (`#/laporan`): grafik batang pengeluaran per kategori, pemasukan vs pengeluaran, dan temuan bulan ini.

## Menjalankan

```sh
node serve.ts
# buka http://localhost:8080
```

Situs ini file statis murni (HTML, CSS, JavaScript vanilla) tanpa pustaka, tanpa build step, dan tanpa permintaan jaringan saat berjalan.

## Menyerahkan

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` menyalin `app/` dan `screenshots/` ke direktori output dan menulis `dossier.json` dengan `buildDossier` dari `vendor/makefun-frontend.ts`.
