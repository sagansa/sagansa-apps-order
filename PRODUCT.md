# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pembeli di aplikasi order Sagansa adalah campuran (dikonfirmasi pemilik):

- **B2B / reseller grosir** — membeli dalam jumlah besar, terbiasa dengan harga
  bertingkat (price tier per kuantitas) dan koordinasi biaya kirim via WhatsApp
  admin. Efisiensi dan kejelasan angka adalah prioritas utama mereka.
- **Konsumen akhir** — pembelian eceran; butuh alur yang jelas, mudah diikuti,
  dan membangun kepercayaan (bukti transfer, status pesanan).

## Product Purpose

Apps/order adalah storefront pemesanan online Sagansa: katalog produk fisik dan
grup produk (product online group) dengan harga grosir bertingkat, keranjang,
checkout dengan dua jalur pembayaran (Midtrans: VA/QRIS/kartu kredit; transfer
manual bank dengan upload bukti), riwayat transaksi, dan detail pesanan.
Sukses = pembeli menyelesaikan pesanan tanpa kebingungan dan data order yang
masuk ke backend lengkap & akurat.

## Positioning

Harga bertingkat per kuantitas untuk pembeli grosir dan konsumen dalam satu
etalase; ongkos kirim dikonfirmasi manual oleh admin (fleksibel untuk kargo /
luar pulau) alih-alih kalkulator ekspedisi otomatis.

## Operating Context

- Ongkir **tidak dihitung otomatis**: pembeli menghubungi admin via WhatsApp
  (tombol "Chat WA Admin" di checkout) untuk konfirmasi nominal, lalu meng-input
  nominal sendiri; atau memilih bayar ongkir langsung ke kurir.
- Opsi ambil sendiri (self-pickup) ada sebagai delivery service id 33.
- Pembayaran: Midtrans (bca_va, mandiri_va, bni_va, bri_va, permata_va, other_va,
  qris, credit_card) atau transfer manual ke rekening perusahaan + upload bukti.
- Status pesanan & upload bukti bisa dilanjutkan setelah checkout dari halaman
  detail transaksi.

## Capabilities and Constraints

- **Login hanya via Google (Gmail)** — update email & password sengaja tidak
  diizinkan (konfirmasi pemilik); halaman Profile direncanakan dihapus
  (task terpisah, belum dikerjakan).
- Kuantitas > stok ditolak di backend; harga per item dihitung ulang server dari
  price tier (harga client hanya display).
- Checkout backend memvalidasi: item wajib merujuk produk/grup, status "Dibayar"
  transfer manual wajib rekening + bukti (fix 2026-11, ada regression test).
- Midtrans sandbox dipakai di dev (`MIDTRANS_IS_PRODUCTION=false`).

## Brand Commitments

- Identitas Sagansa: **gold `#C6A96B`** dan **black `#0A0A0A`** di atas putih.
- Aplikasi memakai MUI; halaman lain (Order, ProductDetail) memakai kartu flat
  `elevation=0` dengan border divider radius 4 dan aksen gold — checkout wajib
  seru dengan dunia visual ini (keputusan pemilik: konsisten tema lama yang
  dimodernkan, 2026-11-12).

## Product Principles

1. Angka lebih penting dari dekorasi: harga, subtotal, ongkir, dan total harus
   langsung terbaca benar (termasuk pemisah ribuan Rupiah).
2. Satu alur untuk semua ukuran layar — mobile dan desktop berbagi komponen,
   bukan pohon render terpisah.
3. Jangan sembunyikan syarat: tombol konfirmasi pesanan hanya aktif ketika
   syarat terpenuhi, dan alasan mengapa belum aktif selalu tertulis.
4. Alur admin-assisted (WA konfirmasi ongkir) tetap first-class, bukan
   afterthought.
5. Kepercayaan lewat bukti: status pembayaran mencerminkan bukti nyata.

## Evidence on Hand

- Kode incumbent: `resources/js/Pages/Cart.jsx` (checkout ~1.450 baris, pohon
  mobile/desktop terduplikasi), `resources/js/Components/cart/*` (7 komponen
  dengan styling campuran), tema `resources/js/theme.js` + `constants/colors.js`.
- Test regression checkout: `tests/Feature/CheckoutValidationTest.php`.
- Tidak ada aset citra merek khusus di luar logo aplikasi.
