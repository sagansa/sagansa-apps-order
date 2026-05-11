import { Head, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CustomerLayout from '@/Layouts/GuestLayout';
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
    InputAdornment,
    Divider,
    Grid,
    Paper,
    Tooltip,
    Chip,
    Tab,
    Tabs,
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    ShoppingCart as ShoppingCartIcon,
    Share as ShareIcon,
    ArrowBack as ArrowBackIcon,
    FavoriteBorder as FavoriteBorderIcon,
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

export default function ProductDetail({ auth, product }) {
    const [quantity, setQuantity] = useState(1);
    const [tabValue, setTabValue] = useState(0);

    const currentPrice = getPriceByQuantity(
        product?.price_tiers,
        quantity,
        product?.online_price || 0
    );

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
            product_id: product.id,
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

    const mainImage = (product.images && product.images.length > 0
        ? product.images[0].image_url
        : product.image_url) || '/images/no_image.png';

    const Layout = auth?.user ? AuthenticatedLayout : CustomerLayout;

    return (
        <Layout user={auth?.user}>
            <Head title={product.name} />
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
                            width: { xs: '100%', md: 280 }, 
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
                                        borderRadius: 2
                                    }}
                                />
                            </Paper>
                            
                            {product.images?.length > 1 && (
                                <Stack direction="row" spacing={1} sx={{ mt: 2, overflowX: 'auto', pb: 1 }}>
                                    {product.images.map((img, idx) => (
                                        <Box 
                                            key={idx}
                                            component="img"
                                            src={img.image_url}
                                            sx={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 1,
                                                border: '2px solid',
                                                borderColor: idx === 0 ? '#C6A96B' : 'transparent',
                                                cursor: 'pointer',
                                                objectFit: 'cover'
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
                                        Terjual <span style={{ color: '#fff', fontWeight: 'bold' }}>70+</span>
                                    </Typography>
                                    <Divider orientation="vertical" flexItem sx={{ height: 12, my: 'auto', bgcolor: 'rgba(255,255,255,0.1)' }} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        5 (5 rating)
                                    </Typography>
                                </Stack>

                                <Typography variant="h3" sx={{ fontWeight: '900', color: '#fff', mt: 1 }}>
                                    Rp {Number(currentPrice).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                </Typography>

                                {product.price_tiers && product.price_tiers.length > 0 && (
                                    <Box sx={{ mt: 1 }}>
                                        <Typography variant="subtitle2" sx={{ color: '#C6A96B', fontWeight: 'bold', mb: 1 }}>
                                            Grosir:
                                        </Typography>
                                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                                            {product.price_tiers.map((tier, idx) => (
                                                <Chip 
                                                    key={idx}
                                                    label={`${tier.min_quantity}${tier.max_quantity ? '-' + tier.max_quantity : '+'} : Rp ${Number(tier.price).toLocaleString('id-ID')}`}
                                                    size="small"
                                                    sx={{ 
                                                        bgcolor: quantity >= tier.min_quantity && (tier.max_quantity === null || quantity <= tier.max_quantity) 
                                                            ? '#C6A96B' 
                                                            : 'rgba(255,255,255,0.05)',
                                                        color: quantity >= tier.min_quantity && (tier.max_quantity === null || quantity <= tier.max_quantity) 
                                                            ? '#000' 
                                                            : 'text.secondary',
                                                        border: '1px solid',
                                                        borderColor: quantity >= tier.min_quantity && (tier.max_quantity === null || quantity <= tier.max_quantity) 
                                                            ? '#C6A96B' 
                                                            : 'rgba(255,255,255,0.1)',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            ))}
                                        </Stack>
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
                                        <Tab label="Spesifikasi" />
                                        <Tab label="Info Penting" />
                                    </Tabs>
                                    
                                    <TabPanel value={tabValue} index={0}>
                                        <Stack spacing={2}>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Kondisi: <span style={{ color: '#fff' }}>Baru</span>
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Min. Pemesanan: <span style={{ color: '#fff' }}>1 {product.unit?.unit || 'pcs'}</span>
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                Etalase: <Link href="#" style={{ color: '#C6A96B', textDecoration: 'none' }}>Semua Etalase</Link>
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap', mt: 2, lineHeight: 1.8 }}>
                                                {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                                            </Typography>
                                        </Stack>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={1}>
                                        <Typography variant="body2" color="text.secondary">
                                            Spesifikasi produk belum tersedia.
                                        </Typography>
                                    </TabPanel>
                                    <TabPanel value={tabValue} index={2}>
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
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Stok: <span style={{ fontWeight: 'bold', color: '#fff' }}>Tersedia</span>
                                        </Typography>
                                    </Stack>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: '900', color: '#fff' }}>
                                            Rp {Number(currentPrice * quantity).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                        </Typography>
                                    </Box>

                                    <Stack spacing={1.5}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            startIcon={<ShoppingCartIcon />}
                                            onClick={handleAddToCart}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontWeight: 'bold',
                                                bgcolor: '#C6A96B',
                                                color: '#000',
                                                '&:hover': { bgcolor: '#B0945A' }
                                            }}
                                        >
                                            + Keranjang
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            fullWidth
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 2,
                                                fontWeight: 'bold',
                                                borderColor: '#C6A96B',
                                                color: '#C6A96B',
                                                '&:hover': { borderColor: '#B0945A', bgcolor: 'rgba(198, 169, 107, 0.05)' }
                                            }}
                                        >
                                            Beli Langsung
                                        </Button>
                                    </Stack>

                                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }}>
                                        <Button startIcon={<FavoriteBorderIcon />} sx={{ color: 'text.secondary', textTransform: 'none', fontSize: '0.8rem' }}>Wishlist</Button>
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
