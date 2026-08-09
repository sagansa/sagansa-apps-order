import { useEffect, useMemo, useState } from 'react';

/**
 * Komponen khusus untuk CETAK katalog (window.print() / Save as PDF).
 *
 * Markup bersih (bukan MUI Card) supaya tampilan cetak 100% dapat dipredict:
 * background putih, gambar statis (tidak collapse), grid 4 kolom A4.
 * Visibilitas diatur lewat class `.print-only` (disembunyikan di layar,
 * tampil hanya saat cetak).
 *
 * PENTING - ukuran PDF: gambar produk asli (full-res, bisa 2000px / ratusan KB)
 * TIDAK dimuat langsung. Setiap gambar di-downscale via <canvas> ke resolusi
 * cetak (~420px) sebagai JPEG berkualitas sedang. Pada kartu 4-kolom A4,
 * 420px sudah tajam; ini memperkecil ukuran PDF dari belasan-puluhan MB
 * menjadi ratusan KB - beberapa MB.
 */

// Resolusi cetak untuk satu kartu gambar di grid 4-kolom A4 (margin 10mm).
// ~42mm per kolom ~ 420px @ ~254dpi; cukup tajam untuk print.
const PRINT_IMAGE_SIZE = 420;

/**
 * Muat gambar dari URL lalu downscale ke JPEG data URL berukuran maxPx.
 * Mengembalikan Promise<string>. Bila gagal, resolve null (placeholder).
 */
function downscaleImage(url, maxPx = PRINT_IMAGE_SIZE) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            try {
                const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
                const w = Math.max(1, Math.round(img.width * scale));
                const h = Math.max(1, Math.round(img.height * scale));
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, w, h);
                ctx.drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            } catch {
                // canvas tainted (CORS) — fallback ke URL asli.
                resolve(url);
            }
        };
        img.onerror = () => resolve(null);
        img.src = url;
    });
}

export default function PrintCatalog({ products = [], categories = [], auth, className = '' }) {
    const showPrice = !!auth?.user;
    // Cache data URL per URL gambar supaya tidak re-downscale saat re-render.
    const [imageCache, setImageCache] = useState({});
    const [imagesReady, setImagesReady] = useState(false);

    // Kumpulkan URL gambar unik yang benar-benar dipakai.
    const imageUrls = useMemo(() => {
        const set = new Set();
        products.forEach((p) => {
            if (p.image_url) set.add(p.image_url);
        });
        return Array.from(set);
    }, [products]);

    // Downscale semua gambar sekali saat daftar URL berubah.
    useEffect(() => {
        let cancelled = false;
        setImagesReady(false);

        const pending = imageUrls.map(async (url) => {
            const scaled = await downscaleImage(url);
            return [url, scaled];
        });

        Promise.all(pending).then((entries) => {
            if (cancelled) return;
            const next = {};
            entries.forEach(([url, scaled]) => {
                next[url] = scaled;
            });
            setImageCache(next);
            setImagesReady(true);
        });

        return () => {
            cancelled = true;
        };
    }, [imageUrls]);

    const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

    // Deskripsi di DB bisa berupa HTML/rich-text; bersihkan jadi plain text
    // agar rapi di kartu cetak (4 kolom A4).
    const plainDescription = (raw) => {
        if (!raw) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = String(raw);
        const text = (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
        return text;
    };

    const resolvePrice = (product) => {
        const tierPrice =
            product.price_tiers?.length > 0 ? product.price_tiers[0].price : null;
        const hasDiscount =
            tierPrice !== null && Number(tierPrice) < Number(product.online_price);
        return {
            hasDiscount,
            oldPrice: hasDiscount ? product.online_price : null,
            price: hasDiscount ? tierPrice : product.online_price,
        };
    };

    const renderCard = (product) => {
        const { hasDiscount, oldPrice, price } = resolvePrice(product);
        const imgSrc = product.image_url ? imageCache[product.image_url] : null;
        const description = plainDescription(product.description);
        return (
            <div className="print-catalog-card" key={`${product.display_type}-${product.id}`}>
                <div className="print-catalog-card__img">
                    {imgSrc === undefined ? null : imgSrc ? (
                        <img src={imgSrc} alt={product.name} />
                    ) : (
                        <div className="print-catalog-card__placeholder">No Image</div>
                    )}
                </div>
                <div className="print-catalog-card__body">
                    <div className="print-catalog-card__name">{product.name}</div>
                    {description && (
                        <div className="print-catalog-card__desc">{description}</div>
                    )}
                    {showPrice && (
                        <div className="print-catalog-card__price-wrap">
                            {hasDiscount && (
                                <span className="print-catalog-card__price--old">
                                    {formatRupiah(oldPrice)}
                                </span>
                            )}
                            <span className="print-catalog-card__price">{formatRupiah(price)}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const categorized = categories.map((category) => ({
        title: category.name,
        items: products.filter((p) => p.online_category_id == category.id),
    }));
    const uncategorized = products.filter((p) => !p.online_category_id);
    const sections = [
        ...categorized.filter((s) => s.items.length > 0),
        ...(uncategorized.length > 0 ? [{ title: 'Lainnya', items: uncategorized }] : []),
    ];

    return (
        <div className={`print-catalog ${className}`} data-ready={imagesReady ? '1' : '0'}>
            {/* Header khusus cetak */}
            <div className="print-catalog-header">
                <div className="print-catalog-header__brand">SAGANSA ORDER</div>
                <div className="print-catalog-header__subtitle">
                    Katalog Produk &amp; Daftar Harga Resmi Sagansa
                </div>
                <div className="print-catalog-header__meta">
                    <span>Tanggal: {today}</span>
                    <span>order.sagansa.id | admin@sagansa.id</span>
                    <span>Kontak: +62 857-8200-4645</span>
                </div>
            </div>

            {/* Body: section per kategori */}
            {sections.map((section) => (
                <section className="print-catalog-section" key={section.title}>
                    <h2 className="print-catalog-section-title">{section.title}</h2>
                    <div className="print-catalog-grid">
                        {section.items.map(renderCard)}
                    </div>
                </section>
            ))}

            {sections.length === 0 && (
                <div className="print-catalog-empty">Tidak ada produk untuk dicetak.</div>
            )}
        </div>
    );
}
