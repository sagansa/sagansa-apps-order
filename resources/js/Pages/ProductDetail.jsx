import ProductDetailView from '@/Components/product/ProductDetailView';

export default function ProductDetail({ auth, product, soldCount = 0 }) {
    return (
        <ProductDetailView
            auth={auth}
            product={product}
            soldCount={soldCount}
            cartPayload={product ? { product_id: product.id } : {}}
            pageLabel="Detail Produk"
        />
    );
}
