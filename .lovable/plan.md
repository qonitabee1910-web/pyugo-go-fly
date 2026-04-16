

# PYU GO — Aplikasi Booking Tiket Online

Aplikasi booking hotel dan shuttle/travel dengan tampilan modern bertema biru, seluruh UI dalam Bahasa Indonesia, terinspirasi dari Airpaz.

## Halaman & Fitur

### 1. Landing Page (Beranda)
- **Header/Navbar**: Logo PYU GO, menu navigasi (Hotel, Shuttle, Pesanan, Promo, Bantuan), tombol Login/Daftar
- **Hero Section**: Banner besar dengan tagline "Pesan Tiket Mudah & Cepat"
- **Tab Pencarian**: Dua tab — **Hotel** dan **Shuttle/Travel**
  - **Hotel**: Kota tujuan, tanggal check-in/check-out, jumlah tamu & kamar, tombol Cari
  - **Shuttle/Travel**: Kota asal, kota tujuan, tanggal keberangkatan, jumlah penumpang, tombol Cari
- **Promo Banner Carousel**: Slider promo/diskon
- **Destinasi Populer**: Grid kota populer dengan gambar
- **Footer**: Info kontak, link navigasi, sosial media

### 2. Hasil Pencarian Hotel
- Filter sidebar: harga, rating bintang, fasilitas, tipe hotel
- Sorting: harga terendah/tertinggi, rating, popularitas
- Kartu hotel: foto, nama, rating, harga per malam, lokasi
- Pagination

### 3. Hasil Pencarian Shuttle/Travel
- Filter: operator (Xtrans, Baraya, dll), waktu keberangkatan, harga
- Sorting: harga, waktu, durasi
- Kartu shuttle: operator, rute, jam berangkat/tiba, harga, kursi tersedia

### 4. Detail & Booking Hotel
- Galeri foto, deskripsi, fasilitas, peta lokasi
- Pilihan tipe kamar dengan harga
- Form data tamu (nama, email, telepon)
- Ringkasan pemesanan & total harga
- Tombol "Pesan Sekarang"

### 5. Detail & Booking Shuttle
- Info operator, rute, jadwal, fasilitas bus
- Pilih kursi (seat map sederhana)
- Form data penumpang
- Ringkasan & tombol pesan

### 6. Autentikasi
- Halaman Login & Daftar (email + password) via Supabase Auth
- Profil pengguna sederhana

### 7. Riwayat Pesanan
- Daftar semua pesanan dengan status (Menunggu, Dikonfirmasi, Selesai, Dibatalkan)
- Detail pesanan: info booking, data tamu/penumpang, kode booking

## Pendekatan Teknis
- UI lengkap dengan data dummy yang terstruktur, siap disambungkan ke API nyata
- Supabase untuk auth, database pesanan, dan edge functions (untuk proxy API pihak ketiga nanti)
- Tema biru sebagai brand color PYU GO
- Responsive design (mobile-friendly)

