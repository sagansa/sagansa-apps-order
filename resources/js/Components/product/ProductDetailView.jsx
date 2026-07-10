import { Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import {
    Box,
    Container,
    Typography,
    Button,
    IconButton,
    Stack,
    TextField,
    Divider,
    Paper,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    ShoppingCart as ShoppingCartIcon,
    Share as ShareIcon,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { getPriceByQuantity } from '@/Utils/cartCalculations';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`product-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

/**
 * Komponen presentational bersama untuk halaman detail produk & product group.
 *
 * Bentuk `product` kompatibel untuk Product maupun ProductOnlineGroup:
 * { name, description, slug, images[].image_url, image_url, price_tiers[],
 *   online_price, current_stock, unit.unit, onlineCategory.name }
 *
 * Props:
 * - auth            : Inertia shared prop
 * - product         : object produk (Product atau ProductOnlineGroup)
 * - cartPayload     : partial key untuk cart.store, mis. { product_id } atau
 *                     { product_online_group_id }. Dicampur { quantity, user_id } saat POST.
 * - variantCount?   : jumlah anggota group (tidak ditampilkan; dipertahankan untuk masa depan).
 * - soldCount?      : jumlah terjual (SUM quantity, order delivery_status=3).
 * - pageLabel       : label fallback untuk <title>, mis. "Detail Produk" / "Detail Grup".
 */
export default function ProductDetailView({ auth, product, cartPayload = {}, variantCount = 0, soldCount = 0, pageLabel = 'Detail Produk' }) {
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    // Tanpa hooks: guard not-found (defensive). Controller group pakai firstOrFail,
    // controller product pakai firstOrFail; null hanya terjadi bila prop hilang.
    if (!product) {
        return (
            <Layout user={auth?.user}>
                <Head title="Produk tidak ditemukan" />
                <Container sx={{ py: 8, textAlign: 'center' }}>
                    <Typography variant="h4" color="white">Produk tidak ditemukan</Typography>
                    <Button component={Link} href={route('order.index')} sx={{ mt: 2, color: '#C6A96B' }}>
                        Kembali ke Katalog
                    </Button>
                </Container>
            </Layout>
        );
    }

    // Inner content component memastikan hook selalu dipanggil (tidak ada hook
    // setelah early-return), memperbaiki bug Rules of Hooks di ProductDetail lama.
    return <ProductDetailContent
        auth={auth}
        product={product}
        cartPayload={cartPayload}
        variantCount={variantCount}
        soldCount={soldCount}
        pageLabel={pageLabel}
        Layout={Layout}
    />;
}

function ProductDetailContent({ auth, product, cartPayload, variantCount, soldCount, pageLabel, Layout }) {
    const [quantity, setQuantity] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [selectedImage, setSelectedImage] = useState(0);

    const currentPrice = getPriceByQuantity(
        product?.price_tiers,
        quantity,
        product?.online_price || 0
    );

    // Gallery fallback disatukan: pakai product.images, atau sintesis dari image_url.
    const galleryImages = product.images?.length > 0
        ? product.images
        : product.image_url
            ? [{ image_url: product.image_url }]
            : [];
    const mainImage = galleryImages[selectedImage]?.image_url || '/images/no_image.png';

    const isOutOfStock = product.current_stock !== null && product.current_stock === 0;

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            toast.error('Sharing tidak didukung di browser ini');
        }
    };

    const handleAddToCart = () => {
        if (!auth?.user) {
            window.location.href = route('login');
            return;
        }

        const cartData = {
            ...cartPayload,
            quantity: quantity,
            user_id: auth.user.id
        };

        router.post(route('cart.store'), cartData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${quantity} ${product.name} ditambahkan ke keranjang`);
            },
            onError: (errors) => {
                console.error(errors);
                toast.error(errors?.message || errors?.quantity || 'Gagal menambahkan ke keranjang');
            }
        });
    };

    const handleQuantityChange = (change) => {
        setQuantity(prev => Math.max(1, prev + change));
    };

    const handleQuantityInput = (value) => {
        const newValue = parseInt(value) || 1;
        setQuantity(Math.max(1, newValue));
    };

    const hasPriceTiers = product.price_tiers?.length > 0;

    return (
        <Layout user={auth?.user}>
            <Head>
                <title>{product?.name ? `${product.name} - Sagansa` : `${pageLabel} - Sagansa`}</title>
                <meta name="description" content={product?.description ? product.description.substring(0, 160) : `Beli ${product?.name || 'produk'} berkualitas tinggi di Sagansa.`} />
                <meta name="keywords" content={`${product?.name || ''}, sagansa, supplier, grosir, bahan makanan, sparepart`} />
                <meta property="og:title" content={product?.name ? `${product.name} - Sagansa` : 'Sagansa'} />
                <meta property="og:description" content={product?.description ? product.description.substring(0, 160) : `Beli ${product?.name || 'produk'} berkualitas tinggi di Sagansa.`} />
                <meta property="og:image" content={mainImage} />
                <meta property="og:type" content="product" />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <Toaster />

            <Box sx={{ py: 4, bgcolor: '#0a0a0a', minHeight: '100vh' }}>
                <Container maxWidth="xl">
                    {/* Breadcrumbs / Back */}
                    <Button
                        component={Link}
                        href={route('order.index')}
                        startIcon={<ArrowBackIcon />}
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                            textTransform: 'none',
                            '&:hover': { color: '#C6A96B', bgcolor: 'transparent' }
                        }}
                    >
                        Kembali ke Produk
                    </Button>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        gap: 4,
                        alignItems: 'flex-start'
                    }}>
                        {/* LEFT: Image Gallery */}
                        <Box sx={{
                            width: { xs: '100%', md: 400 },
                            flexShrink: 0,
                            position: { md: 'sticky' },
                            top: 24
                        }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 4,
                                    overflow: 'hidden',
                                    border: '1px solid',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    bgcolor: '#141414',
                                    p: 2
                                }}
                            >
                                <Box
                                    component="img"
                                    src={mainImage}
                                    alt={product.name}
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        aspectRatio: '1/1',
                                        objectFit: 'contain',
                                        borderRadius: 2,
                                        transition: 'opacity 0.2s'
                                    }}
                                />
                            </Paper>

                            {galleryImages.length > 1 && (
                                <Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
                                    {galleryImages.map((img, idx) => (
                                        <Box
                                            key={idx}
                                            component="img"
                                            src={img.image_url}
                                            onClick={() => setSelectedImage(idx)}
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: 1,
                                                border: '2px solid',
                                                borderColor: idx === selectedImage ? '#C6A96B' : 'transparent',
                                                cursor: 'pointer',
                                                objectFit: 'cover',
                                                opacity: idx === selectedImage ? 1 : 0.5,
                                                transition: 'opacity 0.2s, border-color 0.2s',
                                                '&:hover': { opacity: 1 }
                                            }}
                                        />
                                    ))}
                                </Stack>
                            )}
                        </Box>

                        {/* MIDDLE: Product Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack spacing={2}>
                                <Typography variant="h4" sx={{ fontWeight: '900', color: '#fff', lineHeight: 1.2 }}>
                                    {product.name}
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Terjual <span style={{ color: '#fff', fontWeight: 'bold' }}>{Number(soldCount).toLocaleString('id-ID')}</span>
                                    </Typography>
                                </Stack>

                                {auth?.user ? (
                                    (() => {
                                        const basePrice = product?.online_price || 0;
                                        const hasDiscount = currentPrice < basePrice;
                                        return (
                                            <Box sx={{ mt: 1 }}>
                                                {hasDiscount && (
                                                    <Typography variant="body1" sx={{ color: '#f44336', textDecoration: 'line-through', fontWeight: 'bold', lineHeight: 1.2 }}>
                                                        Rp {Number(basePrice).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                                    </Typography>
                                                )}
                                                <Typography variant="h3" sx={{ fontWeight: '900', color: '#fff', lineHeight: 1.2 }}>
                                                    Rp {Number(currentPrice).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                                </Typography>
                                            </Box>
                                        );
                                    })()
                                ) : (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                                        <Typography variant="subtitle1" sx={{ color: '#C6A96B', fontWeight: 'bold' }}>
                                            Silakan login untuk melihat harga dan penawaran grosir.
                                        </Typography>
                                    </Box>
                                )}

                                <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                                <Box sx={{ width: '100%' }}>
                                    <Tabs
                                        value={tabValue}
                                        onChange={handleTabChange}
                                        sx={{
                                            borderBottom: 1,
                                            borderColor: 'rgba(255,255,255,0.1)',
                                            '& .MuiTab-root': {
                                                color: 'text.secondary',
                                                fontWeight: 'bold',
                                                textTransform: 'none',
                                                minWidth: 'auto',
                                                mr: 4,
                                                px: 0,
                                                '&.Mui-selected': { color: '#C6A96B' }
                                            },
                                            '& .MuiTabs-indicator': { bgcolor: '#C6A96B' }
                                        }}
                                    >
                                        <Tab label="Detail" />
                                        {auth?.user && hasPriceTiers && <Tab label="Harga Grosir" />}
                                        <Tab label="Info Penting" />
                                    </Tabs>

                                    <TabPanel value={tabValue} index={0}>
                                        {product.description ? (
                                            <Box
                                                className="product-description"
                                                dangerouslySetInnerHTML={{ __html: product.description }}
                                                sx={{
                                                    color: 'text.secondary',
                                                    lineHeight: 1.8,
                                                    fontSize: '0.95rem',
                                                    '& p': { my: 1 },
                                                    '& ul, & ol': { pl: 3, my: 1 },
                                                    '& li': { my: 0.5 },
                                                    '& h1, & h2, & h3, & h4': { color: '#fff', mt: 2, mb: 1 },
                                                    '& a': { color: '#C6A96B' },
                                                    '& img': { maxWidth: '100%', borderRadius: 1, my: 1 },
                                                    '& table': { borderCollapse: 'collapse', width: '100%', my: 1 },
                                                    '& th, & td': { border: '1px solid rgba(255,255,255,0.15)', p: 1 },
                                                    '& blockquote': { borderLeft: '3px solid #C6A96B', pl: 2, my: 1, opacity: 0.8 },
                                                    '& hr': { borderColor: 'rgba(255,255,255,0.15)', my: 2 },
                                                    '& code, & pre': { bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1, p: 0.5 },
                                                }}
                                            />
                                        ) : (
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Tidak ada deskripsi untuk produk ini.
                                            </Typography>
                                        )}
                                    </TabPanel>

                                    {auth?.user && hasPriceTiers && (
                                        <TabPanel value={tabValue} index={1}>
                                            <Typography variant="subtitle1" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                                                Daftar Harga Bertingkat
                                            </Typography>
                                            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2 }}>
                                                <Table size="small">
                                                    <TableHead sx={{ bgcolor: 'rgba(255,255,255,0.02)' }}>
                                                        <TableRow>
                                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Min. Jumlah</TableCell>
                                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Max. Jumlah</TableCell>
                                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Harga per Unit</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {product.price_tiers.map((tier, idx) => (
                                                            <TableRow
                                                                key={idx}
                                                                sx={{
                                                                    bgcolor: quantity >= tier.min_quantity && (tier.max_quantity === null || quantity <= tier.max_quantity)
                                                                        ? 'rgba(198, 169, 107, 0.1)'
                                                                        : 'transparent'
                                                                }}
                                                            >
                                                                <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{tier.min_quantity}</TableCell>
                                                                <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{tier.max_quantity || '∞'}</TableCell>
                                                                <TableCell sx={{ color: '#C6A96B', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                                    Rp {Number(tier.price).toLocaleString('id-ID')}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 2, display: 'block' }}>
                                                * Harga akan otomatis berubah di keranjang sesuai dengan jumlah yang Anda beli.
                                            </Typography>
                                        </TabPanel>
                                    )}

                                    <TabPanel value={tabValue} index={hasPriceTiers ? 2 : 1}>
                                        <Typography variant="body2" color="text.secondary">
                                            Informasi penting terkait pengiriman dan kebijakan pengembalian.
                                        </Typography>
                                    </TabPanel>
                                </Box>
                            </Stack>
                        </Box>

                        {/* RIGHT: Purchase Card (Sticky) */}
                        <Box sx={{
                            width: { xs: '100%', md: 350 },
                            flexShrink: 0,
                            position: { md: 'sticky' },
                            top: 24
                        }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    borderRadius: 4,
                                    border: '1px solid',
                                    borderColor: 'rgba(255,255,255,0.1)',
                                    bgcolor: '#141414',
                                }}
                            >
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#fff' }}>
                                    Atur jumlah dan catatan
                                </Typography>

                                <Stack spacing={3}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1px solid',
                                            borderColor: 'rgba(255,255,255,0.2)',
                                            borderRadius: 2,
                                            p: 0.5
                                        }}>
                                            <IconButton size="small" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} sx={{ color: '#fff' }}>
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <TextField
                                                variant="standard"
                                                value={quantity}
                                                onChange={(e) => handleQuantityInput(e.target.value)}
                                                InputProps={{
                                                    disableUnderline: true,
                                                    style: { textAlign: 'center', width: 40, color: '#fff', fontWeight: 'bold' }
                                                }}
                                                sx={{ '& input': { textAlign: 'center' } }}
                                            />
                                            <IconButton size="small" onClick={() => handleQuantityChange(1)} sx={{ color: '#fff' }}>
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                        {product.current_stock !== null && (
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Stok: <span style={{ fontWeight: 'bold', color: product.current_stock > 0 ? '#4CAF50' : '#f44336' }}>
                                                    {product.current_stock} {product.unit?.unit || ''}
                                                </span>
                                            </Typography>
                                        )}
                                    </Stack>

                                    {auth?.user && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: '900', color: '#fff' }}>
                                                Rp {Number(currentPrice * quantity).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Stack spacing={1.5}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            disabled={isOutOfStock}
                                            startIcon={<ShoppingCartIcon />}
                                            onClick={handleAddToCart}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontWeight: 'bold',
                                                bgcolor: isOutOfStock ? 'rgba(255,255,255,0.1)' : '#C6A96B',
                                                color: isOutOfStock ? 'text.secondary' : '#000',
                                                '&:hover': isOutOfStock ? {} : { bgcolor: '#B0945A' }
                                            }}
                                        >
                                            {isOutOfStock ? 'Stok Habis' : '+ Keranjang'}
                                        </Button>
                                    </Stack>

                                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                                        <Button startIcon={<ShareIcon />} onClick={handleShare} sx={{ color: 'text.secondary', textTransform: 'none', fontSize: '0.8rem' }}>Share</Button>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Layout>
    );
}
