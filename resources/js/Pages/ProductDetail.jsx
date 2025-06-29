import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CustomerLayout from '@/Layouts/GuestLayout';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
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
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    ShoppingCart as ShoppingCartIcon,
    Share as ShareIcon,
    LocalShipping as LocalShippingIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';

export default function ProductDetail({ auth, product }) {
    const [quantity, setQuantity] = useState(1);

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
        <Layout
            user={auth?.user}
            header={<Typography variant="h4" component="h2" sx={{ color: 'text.primary' }}>
                Detail Produk
            </Typography>}
        >
            <Head title={product.name} />

            <Box sx={{ py: 4 }}>
                <Paper sx={{ p: 3 }}>
                    <Grid container spacing={4}>
                        {/* Image */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{
                                width: '100%',
                                pt: '75%', // 4:3 Aspect Ratio
                                position: 'relative',
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: 'divider'
                            }}>
                                <CardMedia
                                    component="img"
                                    image={mainImage}
                                    alt={product.name}
                                    sx={{
                                        objectFit: 'contain', // Use 'contain' to show the whole image
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        bgcolor: 'background.default' // Background for letterboxing
                                    }}
                                />
                            </Card>
                        </Grid>

                        {/* Product Details */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={3}>
                                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                                    {product.name}
                                </Typography>

                                <Paper elevation={0} variant="outlined" sx={{ p: 2 }}>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                                                Rp {(product?.online_price || 0).toLocaleString()}
                                            </Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                /{product?.unit?.unit || 'pcs'}
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" color="text.secondary">
                                            Total: <Typography component="span" variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                                Rp {((product?.online_price || 0) * quantity).toLocaleString()}
                                            </Typography>
                                        </Typography>
                                    </Stack>
                                </Paper>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'center' }}>
                                    <TextField
                                        value={quantity}
                                        onChange={(e) => handleQuantityInput(e.target.value)}
                                        type="number"
                                        size="small"
                                        InputProps={{
                                            inputProps: { min: 1, style: { textAlign: 'center' } },
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <IconButton size="small" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                                        <RemoveIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => handleQuantityChange(1)}>
                                                        <AddIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ width: { xs: '100%', sm: '150px' } }}
                                    />
                                    <Button
                                        variant="contained"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={handleAddToCart}
                                        size="large"
                                        sx={{ flexGrow: 1 }}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Tooltip title="Bagikan">
                                        <IconButton onClick={handleShare}>
                                            <ShareIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>

                                <Divider />

                                <Stack spacing={1}>
                                    <Typography variant="h6">Deskripsi Produk</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                        {product.description || 'Tidak ada deskripsi untuk produk ini.'}
                                    </Typography>
                                </Stack>

                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Layout>
    );
}
