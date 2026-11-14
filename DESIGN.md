---
name: Sagansa Order
description: Etalase pemesanan Sagansa — Lumbung Emas: rak gelap untuk menjelajah, buku kas terang untuk bertransaksi.
colors:
  gold: "#C6A96B"
  gold-bright: "#D4AF37"
  ink: "#0A0A0A"
  charcoal: "#141414"
  paper: "#FFFFFF"
  text-secondary: "#757575"
  text-muted: "#9E9E9E"
  danger: "#D32F2F"
  gold-tint: "rgba(198,169,107,0.05)"
  gold-border: "rgba(198,169,107,0.2)"
typography:
  display:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
  title:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
  body:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
  label:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.02em"
  money:
    fontFamily: "Figtree, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 800
    fontFeature: "tnum"
rounded:
  card: "16px"
  control: "8px"
spacing:
  card-padding: "24px"
  section-gap: "24px"
  field-gap: "16px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "#FFFFFF"
    rounded: "{rounded.control}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.gold-bright}"
  section-card:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  section-card-header:
    backgroundColor: "{colors.gold-tint}"
    textColor: "{colors.ink}"
---

# Design System: Sagansa Order

## Overview

**Creative North Star: "Lumbung Emas"**

Sagansa adalah lumbung bermutu: rak kayu gelap yang elegan untuk menjelajah
barang, dan buku kas kuningan yang bersih untuk mencatat transaksi. Dua ruang,
satu rumah. Ruang gelap (katalog, hero, kartu produk `#141414` dengan aksen
gold) membangun selera dan atmosfer; ruang terang (checkout, transaksi, alamat)
meniadakan gesekan — form dibaca cepat, angka tidak bisa salah.

Kepadatan sedang-tinggi: pembeli B2B mengecek angka, bukan menikmati dekorasi.
Gaya kartu flat dengan border halus di permukaan terang; bayangan hanya muncul
sebagai respons (hover, CTA). Emas adalah suara utama merek dan dipakai hemat —
satu CTA, satu angka penting, satu status aktif per pandangan.

**Key Characteristics:**
- Dua ruang berprinsip: gelap = menjelajah, terang = bertransaksi.
- Figtree di semua bobot; tidak ada keluarga font lain.
- Angka uang selalu tampil sebagai Rupiah berpemisah ribuan, digit tabular,
  rata kanan.
- Kartu flat 1px border radius 16 di permukaan terang; lift hanya saat hover.
- Gold pada CTA utama dan aksen aktif; sisanya hitam-putih-abu.

## Colors

Palet dua nada: emas hangat di atas tinta pekat, di atas kertas putih.

### Primary
- **Emas Lumbung** (#C6A96B): identitas merek — CTA utama, harga/angka penting,
  status aktif, aksen header kartu (tint 5%).

### Secondary
- **Emas Terang** (#D4AF37): partner gradien CTA (`45deg, #C6A96B 30%, #D4AF37 90%`) dan warna hover CTA.
- **Arang Rak** (#141414): latar kartu & permukaan ruang gelap (katalog).

### Neutral
- **Tinta** (#0A0A0A): teks utama dan identitas hitam merek di ruang terang.
- **Kertas** (#FFFFFF): latar ruang terang dan isi kartu.
- **Abu Sekunder** (#757575): teks sekunder, label non-aktif.
- **Abu Redup** (#9E9E9E): placeholder, border input diam.

### Tertiary
- **Merah Peringatan** (#D32F2F): error, batas stok, peringatan validasi.

### Named Rules
**The Two Rooms Rule.** Gelap untuk menjelajah, terang untuk bertransaksi. Satu
permukaan tinggal di satu ruang; jangan mencampur kartu gelap ke halaman
transaksi terang atau sebaliknya.

**The Gold Ration Rule.** Emas ≤ 10% area permukaan terang. Kelangkaannya adalah
nilainya: satu CTA emas per layar, angka penting boleh emas, sisanya tinta.

## Typography

**Display Font:** Figtree (fallback: ui-sans-serif, system-ui, sans-serif)
**Body Font:** Figtree (fallback sama)

**Character:** Figtree tunggal — grotesk ramah yang tetap tegas di bobot 700–800;
tanpa serif, tanpa font kedua, kejelasan angka di atas segalanya.

### Hierarchy
- **Display** (800, 1.5rem): judul halaman & header layout.
- **Headline/Title** (700, 1.125rem): judul seksi kartu ("Ringkasan Belanja").
- **Body** (400, 0.875rem, lh 1.5): teks isi, deskripsi, radio label.
- **Label** (600, 0.75rem): label field, caption, chip.
- **Money** (800, tnum): angka Rupiah — selalu `toLocaleString('id-ID')`,
  digit tabular (`font-variant-numeric: tabular-nums`), rata kanan.

### Named Rules
**The Ledger Rule.** Setiap angka uang tampil `Rp 1.250.000` — pemisah ribuan
id-ID, tanpa desimal, digit tabular, rata kanan dalam kolom/baris jumlah. Input
uang mengetik angka mentah dan menampilkan format ribuan secara hidup.

## Layout

Satu pohon responsif — mobile dan desktop berbagi komponen, hanya container
yang berubah. Desktop checkout: dua kolom `1fr / 360px` (konten kiri, ringkasan
sticky kanan). Mobile: satu kolom vertikal, ringkasan di bawah. Padding halaman
16px (mobile) / 24px+. Ritme antar-kartu 24px; dalam kartu 16px.

## Elevation & Depth

**The Flat-Rest Rule.** Kartu flat di diam: border 1px abu divider, tanpa
bayangan. Kedalaman adalah respons: hover kartu produk mengangkat
(`translateY(-4px)` + bayangan lembut), CTA emas membawa bayangan emas
`0 8px 16px rgba(198,169,107,0.2)`. Di ruang gelap, kedalaman dari border
transparan putih 5% dan bayangan hitam pekat.

## Shapes

Bahasa form: sudut lembut konsisten — kartu 16px (`borderRadius: 4` MUI),
kontrol (tombol, input, chip) 8px (`borderRadius: 2` MUI). Tidak ada sudut
lancip; tidak ada pill penuh kecuali chip status.

## Components

### Buttons
- **Shape:** radius 8px.
- **Primary (CTA):** gradien emas `45deg #C6A96B 30% → #D4AF37 90%`, teks putih
  800, padding `16px 24px`, bayangan emas lembut; hover menggelap ke
  `#B0945A → #C6A96B`.
- **Sekunder:** teks/tint — tombol kecil di header kartu (mis. "Ubah Alamat")
  pakai warna default MUI di tint emas 5–10%.
- **WA:** outlined hijau `#25D366`, hover `#128C7E`.

### Cards / Containers (Section Card — pola inti)
- **Corner:** 16px; **Background:** putih; **Border:** 1px divider;
  **Elevation:** 0.
- **Header seksi:** tint emas 5%, title 700 1.125rem, border-bottom divider.
- **Isi:** padding 24px, jarak antar elemen 16px.

### Inputs / Fields
- **Style:** outlined, border abu redup (tema menonaktifkan perubahan warna
  border saat fokus — fokus dilihat dari label & ring MUI).
- **Input uang:** teks biasa + adornment `Rp`, format ribuan hidup, parser ke
  number mentah; **bukan** `type="number"`.

### Chips (status)
- **Style:** tint warna status 10–15%, teks 600, radius 8px. Status bayar:
  emas=proses/dibayar-verify, hijau=valid, merah=tidak valid, abu=belum bayar.

### Navigation
Header terang AuthenticatedLayout dengan brand hitam-gold; item aktif emas.

## Do's and Don'ts

### Do:
- **Do** pakai pemisah ribuan `id-ID` + digit tabular + rata kanan untuk semua
  angka uang (The Ledger Rule).
- **Do** bangun satu pohon komponen responsif; perbedaan mobile/desktop hanya
  pada layout container (`display`/`Grid` breakpoint), bukan duplikasi JSX.
- **Do** pakai Section Card (putih, border 1px, radius 16, header tint emas)
  untuk setiap kelompok form di ruang terang.
- **Do** satukan logika format/harga di util bersama (`Utils/`), bukan inline
  per komponen.

### Don't:
- **Don't** pakai `type="number"` untuk input uang — gunakan input teks
  terformat ribuan.
- **Don't** menaruh bayangan diam pada kartu ruang terang (The Flat-Rest Rule).
- **Don't** duplikasi pohon render mobile vs desktop.
- **Don't** perkenalkan keluarga font selain Figtree.
- **Don't** campur kartu gelap ke permukaan transaksi terang (The Two Rooms
  Rule).
