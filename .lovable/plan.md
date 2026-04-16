# Modul Ride On Demand (Ojek Online) — PYU GO

Menambahkan fitur ride-hailing seperti Gojek/Grab ke dalam aplikasi PYU GO.

## Fitur Utama

### 1. Tab Ride di Landing Page

- Tambah tab ketiga "Ride" di search card (icon: Car)
- Form: lokasi jemput, lokasi tujuan, tombol "Cari Ride"

### 2. Data & Tipe

- Interface `RideService` (tipe layanan: Motor, Pengemudi Wanita, Mobil) dengan harga per km, estimasi waktu
- Interface `Driver` (nama, rating, kendaraan, plat nomor, foto)
- Dummy data: daftar layanan ride + driver simulasi
- Update `Booking` type untuk support `type: 'ride'`

### 3. Halaman Pencarian Ride (`/ride`)

- Input lokasi jemput & tujuan (dengan autocomplete kota)
- Peta simulasi sederhana (Leafleat Map / OSM)
- Pilihan tipe layanan (Motor / Pengemudi Wanita/ Mobil) dengan estimasi harga & waktu
- Setiap tipe menampilkan: icon, nama, estimasi harga, estimasi waktu tiba

### 4. Halaman Konfirmasi & Booking Ride (`/ride/book`)

- Detail perjalanan: jemput, tujuan, jarak estimasi, tipe kendaraan
- Info driver yang di-assign (simulasi random dari dummy)
- Harga final
- Form nama penumpang & nomor HP
- Tombol "Pesan Ride"
- Insert booking ke database (tipe: 'ride')

### 5. Halaman Status Ride (`/ride/status/:id`)

- Simulasi status perjalanan: Mencari Driver → Driver Ditemukan → Dalam Perjalanan → Selesai
- Info driver, kendaraan, estimasi tiba
- Tombol "Batalkan" (jika belum jalan)

### 6. Integrasi Existing

- **Navbar**: Tambah menu "Ride" dengan icon Car/Motorcycle
- **Orders**: Tampilkan pesanan ride di riwayat pesanan (icon Car, filter baru)
- **Database**: Update bookings table — field `type` sudah text, jadi bisa langsung pakai value `'ride'`

## Perubahan Teknis


| File                        | Perubahan                                              |
| --------------------------- | ------------------------------------------------------ |
| `src/data/dummy.ts`         | Tambah interface & data RideService, Driver            |
| `src/pages/Index.tsx`       | Tambah tab "Ride" di search card                       |
| `src/pages/RideSearch.tsx`  | Halaman baru — pilih layanan ride                      |
| `src/pages/RideBook.tsx`    | Halaman baru — konfirmasi & booking                    |
| `src/pages/RideStatus.tsx`  | Halaman baru — status perjalanan simulasi              |
| `src/pages/Orders.tsx`      | Support tipe 'ride' di tampilan pesanan                |
| `src/components/Navbar.tsx` | Tambah menu Ride                                       |
| `src/App.tsx`               | Tambah route `/ride`, `/ride/book`, `/ride/status/:id` |


Tidak perlu migrasi database karena field `type` pada tabel `bookings` sudah bertipe text.