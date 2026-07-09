import ProductDetailView from '@/Components/product/ProductDetailView';

export default function ProductDetail({ auth, product }) {
    return (
        <ProductDetailView
            auth={auth}
            product={product}
            cartPayload={product ? { product_id: product.id } : {}}
            pageLabel="Detail Produk"
        />
    );
}
