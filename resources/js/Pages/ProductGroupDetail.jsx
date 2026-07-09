import ProductDetailView from '@/Components/product/ProductDetailView';

export default function ProductGroupDetail({ auth, group }) {
    return (
        <ProductDetailView
            auth={auth}
            product={group}
            cartPayload={{ product_online_group_id: group.id }}
            variantCount={group.items?.length}
            pageLabel="Detail Grup"
        />
    );
}
