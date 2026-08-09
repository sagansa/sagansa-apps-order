// Komponen khusus untuk cetak / pratinjau katalog.
// Markup bersih (bukan MUI Card) supaya tampilan cetak 100% dapat diprediksi:
// background putih, gambar statis (tidak collapse), grid 4 kolom A4.
// Visibilitas diatur lewat class `.print-only` ( disembunyikan di layar, tampil saat cetak/pratinjau).
export default function PrintCatalog({ products = [], categories = [], auth, className = '' }) {
    const showPrice = !!auth?.user;

    const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const formatRupiah = (value) => `Rp ${Number(value || 0).toLocaleString('id-ID')}`;

    // Hitung harga yang ditampilkan: jika ada price_tier lebih murah, anggap diskon.
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
        return (
            <div className="print-catalog-card" key={`${product.display_type}-${product.id}`}>
                <div className="print-catalog-card__img">
                    {product.image_url ? (
                        <img src={product.image_url} alt={product.name} />
                    ) : (
                        <div className="print-catalog-card__placeholder">No Image</div>
                    )}
                </div>
                <div className="print-catalog-card__body">
                    <div className="print-catalog-card__name">{product.name}</div>
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
        <div className={`print-catalog ${className}`}>
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
