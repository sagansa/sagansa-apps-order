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
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    ShoppingCart as ShoppingCartIcon,
    Share as ShareIcon,
    LocalShipping as LocalShippingIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#f48fb1',
        },
        background: {
            default: '#121212',
            paper: '#1e1e1e',
        },
    },
});

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
                toast.error(errors.message || 'Gagal menambahkan ke keranjang');
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

    const images = product.images && product.images.length > 0
        ? product.images.map(img => img.image_url)
        : [product.image_url];

    const Layout = auth?.user ? AuthenticatedLayout : CustomerLayout;

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Layout
                user={auth?.user}
                header={<Typography variant="h4" component="h2" sx={{ color: 'text.primary' }}>
                    Detail Produk
                </Typography>}
            >
                <Head title={product.name} />

                <Box sx={{ py: 4, px: 2 }}>
                    <Card>
                        <CardContent>
                            <Grid container spacing={4}>
                                <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                                    <CardMedia
                                        component="img"
                                        image={images[0]}
                                        alt={product.name}
                                        sx={{
                                            height: 400,
                                            objectFit: 'cover',
                                            borderRadius: 1,
                                        }}
                                    />
                                </Grid>
                                <Grid sx={{ width: { xs: '100%', md: '50%' } }}>
                                    <Stack spacing={3}>
                                        <Typography variant="h4" component="h1" gutterBottom>
                                            {product.name}
                                        </Typography>

                                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper' }}>
                                            <Stack spacing={2}>
                                                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                                                    <Typography variant="h4" color="primary">
                                                        Rp {(product?.online_price || 0).toLocaleString()}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        /{product?.unit?.unit || 'pcs'}
                                                    </Typography>
                                                </Box>
                                                <Typography variant="body1" color="text.secondary">
                                                    Total: <Typography component="span" variant="h6" color="primary">
                                                        Rp {((product?.online_price || 0) * quantity).toLocaleString()}
                                                    </Typography>
                                                </Typography>
                                            </Stack>
                                        </Paper>

                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <TextField
                                                value={quantity}
                                                onChange={(e) => handleQuantityInput(e.target.value)}
                                                type="number"
                                                size="small"
                                                inputProps={{
                                                    min: 1,
                                                    style: { textAlign: 'center', width: '80px' }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleQuantityChange(-1)}
                                                            >
                                                                <RemoveIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleQuantityChange(1)}
                                                            >
                                                                <AddIcon />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                            <Button
                                                variant="contained"
                                                startIcon={<ShoppingCartIcon />}
                                                onClick={handleAddToCart}
                                                size="large"
                                            >
                                                Tambah ke Keranjang
                                            </Button>
                                            <Tooltip title="Bagikan">
                                                <IconButton onClick={handleShare}>
                                                    <ShareIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>

                                        <Divider />

                                        <Stack spacing={2}>
                                            <Typography variant="h6">Deskripsi Produk</Typography>
                                            <Typography variant="body1" color="text.secondary">
                                                {product.description}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" spacing={2}>
                                            <Chip
                                                icon={<LocalShippingIcon />}
                                                label="Pengiriman Cepat"
                                                variant="outlined"
                                            />
                                            <Chip
                                                icon={<SecurityIcon />}
                                                label="Garansi 100%"
                                                variant="outlined"
                                            />
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Box>
            </Layout>
        </ThemeProvider>
    );
}
