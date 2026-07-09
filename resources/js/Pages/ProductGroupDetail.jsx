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
    InputAdornment,
    Divider,
    Grid,
    Paper,
    Tooltip,
    Chip,
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
    FavoriteBorder as FavoriteBorderIcon,
    Discount as DiscountIcon,
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

export default function ProductGroupDetail({ auth, group }) {
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;
    const [quantity, setQuantity] = useState(1);
    const [tabValue, setTabValue] = useState(0);
    const [selectedImage, setSelectedImage] = useState(0);

    const galleryImages = group.images?.length > 0
        ? group.images
        : group.image_url
            ? [{ image_url: group.image_url }]
            : [];

    const handleAddToCart = () => {
        if (!auth?.user) {
            router.visit(route('login'));
            return;
        }

        router.post(route('cart.store'), {
            product_online_group_id: group.id,
            quantity: quantity,
            user_id: auth.user.id
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${quantity} ${group.name} ditambahkan ke keranjang`);
            },
            onError: (errors) => {
                console.error(errors);
                toast.error(errors?.message || errors?.quantity || 'Gagal menambahkan ke keranjang');
            }
        });
    };

    const isOutOfStock = group.current_stock !== null && group.current_stock === 0;
    const currentPrice = getPriceByQuantity(group.price_tiers, quantity, group.online_price || 0);
    const hasDiscount = group.price_tiers?.length > 0 && Number(group.price_tiers[0].price) < Number(group.online_price);

    return (
        <Layout auth={auth}>
            <Head title={group.name} />
            <Toaster />

            <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh', py: 4 }}>
                <Container maxWidth="lg">
                    <Button
                        component={Link}
                        href={route('order.index')}
                        startIcon={<ArrowBackIcon />}
                        sx={{ color: '#C6A96B', mb: 2, textTransform: 'none' }}
                    >
                        Kembali ke katalog
                    </Button>

                    <Paper elevation={0} sx={{ bgcolor: '#141414', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Grid container>
                            <Grid size={{ xs: 12, md: 5 }}>
                                <Box sx={{ width: '100%', maxWidth: 450 }}>
                                    <Box sx={{ position: 'relative', width: '100%', pt: '100%', overflow: 'hidden', borderRadius: 2 }}>
                                        {galleryImages[selectedImage]?.image_url ? (
                                            <Box
                                                component="img"
                                                src={galleryImages[selectedImage].image_url}
                                                alt={group.name}
                                                sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#1a1a1a', color: 'text.secondary' }}>
                                                Gambar Tidak Tersedia
                                            </Box>
                                        )}
                                    </Box>
                                    {galleryImages.length > 1 && (
                                        <Stack direction="row" spacing={1} sx={{ mt: 1.5, overflowX: 'auto', pb: 1 }}>
                                            {galleryImages.map((img, idx) => (
                                                <Box
                                                    key={idx}
                                                    onClick={() => setSelectedImage(idx)}
                                                    sx={{
                                                        flexShrink: 0,
                                                        width: 64,
                                                        height: 64,
                                                        borderRadius: 1.5,
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                        border: idx === selectedImage ? '2px solid #C6A96B' : '2px solid transparent',
                                                        opacity: idx === selectedImage ? 1 : 0.5,
                                                        transition: 'all 0.2s',
                                                        '&:hover': { opacity: 1 },
                                                    }}
                                                >
                                                    <Box
                                                        component="img"
                                                        src={img.image_url}
                                                        alt=""
                                                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </Box>
                                            ))}
                                        </Stack>
                                    )}
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 7 }}>
                                <Box sx={{ p: { xs: 2, sm: 4 } }}>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                                        {group.name}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                        <Chip
                                            label={group.onlineCategory?.name || 'Tanpa Kategori'}
                                            size="small"
                                            sx={{ bgcolor: 'rgba(198,169,107,0.15)', color: '#C6A96B', fontWeight: 500 }}
                                        />
                                        {group.unit && (
                                            <Chip
                                                label={group.unit.unit}
                                                size="small"
                                                variant="outlined"
                                                sx={{ color: 'text.secondary', borderColor: 'divider' }}
                                            />
                                        )}
                                    </Stack>

                                    <Stack direction="row" spacing={2} alignItems="baseline" sx={{ mb: 3 }}>
                                        {hasDiscount ? (
                                            <>
                                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C6A96B' }}>
                                                    Rp {Number(currentPrice).toLocaleString('id-ID')}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: '#f44336', textDecoration: 'line-through' }}>
                                                    Rp {Number(group.online_price).toLocaleString('id-ID')}
                                                </Typography>
                                            </>
                                        ) : (
                                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C6A96B' }}>
                                                Rp {Number(group.online_price || 0).toLocaleString('id-ID')}
                                            </Typography>
                                        )}
                                    </Stack>

                                    <Typography variant="body2" sx={{ color: group.current_stock !== null ? (group.current_stock > 0 ? '#4CAF50' : '#f44336') : 'text.secondary', fontWeight: 'bold', mb: 2 }}>
                                        {group.current_stock !== null ? `Stok: ${group.current_stock} ${group.unit?.unit || ''}` : 'Stok tidak terpantau'}
                                    </Typography>

                                    {group.items?.length > 0 && (
                                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                                            Produk ini merupakan gabungan dari {group.items.length} varian produk.
                                        </Typography>
                                    )}

                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

                                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Kuantitas:
                                        </Typography>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, color: 'white' }}
                                            >
                                                <RemoveIcon fontSize="small" />
                                            </IconButton>
                                            <TextField
                                                value={quantity}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value, 10);
                                                    if (!isNaN(val) && val >= 1) setQuantity(val);
                                                }}
                                                type="number"
                                                size="small"
                                                sx={{ width: 80, '& .MuiOutlinedInput-root': { color: 'white' } }}
                                                inputProps={{ min: 1, style: { textAlign: 'center' } }}
                                                InputProps={{
                                                    endAdornment: <InputAdornment position="end"><Typography variant="caption" sx={{ color: 'text.secondary' }}>{group.unit?.unit || 'unit'}</Typography></InputAdornment>,
                                                }}
                                            />
                                            <IconButton
                                                size="small"
                                                onClick={() => setQuantity(quantity + 1)}
                                                sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, color: 'white' }}
                                            >
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </Stack>

                                    <Button
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        disabled={isOutOfStock}
                                        onClick={handleAddToCart}
                                        startIcon={<ShoppingCartIcon />}
                                        sx={{
                                            py: 1.5,
                                            bgcolor: isOutOfStock ? 'rgba(255,255,255,0.1)' : '#C6A96B',
                                            color: isOutOfStock ? 'text.secondary' : '#0a0a0a',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            '&:hover': isOutOfStock ? {} : { bgcolor: '#D4AF37' }
                                        }}
                                    >
                                        {isOutOfStock ? 'Stok Habis' : `Tambah ke Keranjang — Rp ${(quantity * currentPrice).toLocaleString('id-ID')}`}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </Paper>

                    {group.description && (
                        <Paper elevation={0} sx={{ bgcolor: '#141414', borderRadius: 3, p: 3, mt: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Typography variant="h6" sx={{ color: '#C6A96B', fontWeight: 'bold', mb: 2 }}>
                                Deskripsi
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
                                {group.description}
                            </Typography>
                        </Paper>
                    )}

                    {group.price_tiers?.length > 0 && (
                        <Paper elevation={0} sx={{ bgcolor: '#141414', borderRadius: 3, p: 3, mt: 3, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Typography variant="h6" sx={{ color: '#C6A96B', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DiscountIcon /> Harga Grosir
                            </Typography>
                            <TableContainer>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Min Qty</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Max Qty</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Harga/Unit</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {group.price_tiers.map((tier, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell sx={{ color: 'white' }}>{tier.min_quantity}</TableCell>
                                                <TableCell sx={{ color: 'white' }}>{tier.max_quantity ?? '∞'}</TableCell>
                                                <TableCell sx={{ color: '#C6A96B', fontWeight: 'bold' }}>Rp {Number(tier.price).toLocaleString('id-ID')}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}


                </Container>
            </Box>
        </Layout>
    );
}
