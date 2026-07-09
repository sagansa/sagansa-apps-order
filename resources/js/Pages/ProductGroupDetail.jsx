import ProductDetailView from '@/Components/product/ProductDetailView';

export default function ProductGroupDetail({ auth, group, soldCount = 0 }) {
    return (
        <ProductDetailView
            auth={auth}
            product={group}
            soldCount={soldCount}
            cartPayload={{ product_online_group_id: group.id }}
            variantCount={group.items?.length}
            pageLabel="Detail Grup"
        />
    );
}
