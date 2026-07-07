import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import Footer from '@/Components/Footer';
import { useState, useEffect, useRef } from 'react';
import { router } from '@inertiajs/react';
import {
    Box,
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Select,
    MenuItem,
    TextField,
    CircularProgress,
    FormControl,
    InputLabel,
    Paper,
    Stack,
    Snackbar,
    Alert,

    Button,
    InputAdornment
} from '@mui/material';
import { 
    Search as SearchIcon 
} from '@mui/icons-material';
import { toast, Toaster } from 'react-hot-toast'; // Import toast and Toaster for notifications

// Placeholder untuk gambar jika tidak tersedia
const NoImagePlaceholder = () => (
    <Box
        sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'background.default', // Use theme-aware color
            color: 'text.secondary',
            height: '100%',
            width: '100%',
            fontSize: '0.9rem',
            textAlign: 'center',
            p: 2,
            border: '1px dashed',
            borderColor: 'divider' // Use theme-aware border color
        }}
    >
        Gambar Tidak Tersedia
    </Box>
);

const getInitialFilters = () => {
    if (typeof window === 'undefined') {
        return {
            category: 'all',
            minPrice: 0,
            maxPrice: 0,
            unit: 'all',
            search: '',
        };
    }

    const params = new URLSearchParams(window.location.search);

    return {
        category: params.get('category') || 'all',
        minPrice: parseInt(params.get('min_price'), 10) || 0,
        maxPrice: parseInt(params.get('max_price'), 10) || 0,
        unit: params.get('unit') || 'all',
        search: params.get('search') || '',
    };
};

export default function Order({ auth, products = [], categories = [], units = [], lastOrderedProducts = [] }) {
    const initialFilters = getInitialFilters();
    const isInitialRender = useRef(true);
    const [searchQuery, setSearchQuery] = useState(initialFilters.search);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        const debounceTimeout = setTimeout(() => {
            const filters = {};

            if (searchQuery.trim()) filters.search = searchQuery.trim();

            setIsLoading(true);
            router.get(
                route('order.index'),
                filters,
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onSuccess: () => setIsLoading(false),
                    onError: () => setIsLoading(false)
                }
            );
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [searchQuery]);

    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    const handleAddToCart = (product, quantity = 1) => {
        if (!auth?.user) {
            router.visit(route('login'));
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

    return (
        <Layout
            auth={auth}
            header={
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between', 
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2
                }}>
                    <Box>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
                            Sagansa Order
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, color: 'rgba(255, 255, 255, 0.72)' }}>
                            Katalog produk dan pemesanan online Sagansa
                        </Typography>
                    </Box>
                    <TextField
                        placeholder="Cari produk..."
                        variant="outlined"
                        size="small"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ 
                            width: { xs: '100%', sm: '300px' },
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                                '&:hover fieldset': { borderColor: '#C6A96B' },
                                '&.Mui-focused fieldset': { borderColor: '#C6A96B' },
                            }
                        }}
                    />
                </Box>
            }
        >
            <Head>
                <title>Sagansa Order - Katalog Produk Sagansa</title>
                <meta name="description" content="Sagansa Order adalah aplikasi pemesanan online Sagansa untuk katalog produk makanan dan layanan engineering berkualitas." />
                <meta name="keywords" content="sagansa order, sagansa, katalog sagansa, produk sagansa, beli bahan makanan, peralatan engineering" />
                <meta property="og:title" content="Sagansa Order - Katalog Produk Sagansa" />
                <meta property="og:description" content="Sagansa Order adalah aplikasi pemesanan online Sagansa untuk katalog produk makanan dan layanan engineering berkualitas." />
            </Head>

            <Box sx={{ py: 4, bgcolor: '#0a0a0a', minHeight: '100vh' }}>
                <Container maxWidth="xl">
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress sx={{ color: '#C6A96B' }} />
                        </Box>
                    ) : (
                        <Box>
                            {lastOrderedProducts.length > 0 && (
                                <Box sx={{ mb: 5 }}>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            mb: 2, 
                                            color: '#C6A96B', 
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1
                                        }}
                                    >
                                        <Box component="span" sx={{ fontSize: '1.2rem' }}>&#x1F3C6;</Box>
                                        Pesanan Terakhir
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 2,
                                            overflowX: 'auto',
                                            pb: 1,
                                            scrollSnapType: 'x mandatory',
                                            '&::-webkit-scrollbar': { height: 6 },
                                            '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(198, 169, 107, 0.3)', borderRadius: 3 },
                                            '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
                                        }}
                                    >
                                        {lastOrderedProducts.map((product) => (
                                            <Card
                                                key={product.id}
                                                elevation={0}
                                                sx={{
                                                    flex: '0 0 auto',
                                                    width: 140,
                                                    scrollSnapAlign: 'start',
                                                    cursor: 'pointer',
                                                    bgcolor: '#141414',
                                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                                    borderRadius: 2,
                                                    transition: 'all 0.3s ease',
                                                    overflow: 'hidden',
                                                    '&:hover': {
                                                        borderColor: '#C6A96B',
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                                                    }
                                                }}
                                                onClick={() => {
                                                    handleAddToCart(product);
                                                    router.visit(route('cart.index'));
                                                }}
                                            >
                                                <Box sx={{ width: '100%', height: 100, overflow: 'hidden' }}>
                                                    {product.image_url ? (
                                                        <Box
                                                            component="img"
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <NoImagePlaceholder />
                                                    )}
                                                </Box>
                                                <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: 'white',
                                                            fontWeight: 'bold',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            lineHeight: 1.2,
                                                            mb: 0.5,
                                                        }}
                                                    >
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: '#C6A96B', fontWeight: 'bold' }}>
                                                        Rp {Number(product.online_price || 0).toLocaleString('id-ID')}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                </Box>
                            )}
                            {categories.map((category) => {
                                const categoryProducts = products.filter(p => p.online_category_id == category.id);
                                if (categoryProducts.length === 0) return null;

                                return (
                                    <Box key={category.id} sx={{ mb: 6 }}>
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                mb: 3, 
                                                color: '#C6A96B', 
                                                fontWeight: 'bold',
                                                borderBottom: '2px solid rgba(198, 169, 107, 0.2)',
                                                pb: 1,
                                                display: 'inline-block'
                                            }}
                                        >
                                            {category.name}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {categoryProducts.map((product) => (
                                                <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 2 }} key={product.id}>
                                                    <Card
                                                        elevation={0}
                                                        sx={{
                                                            height: '100%',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            cursor: 'pointer',
                                                            bgcolor: '#141414',
                                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                                            borderRadius: 2,
                                                            transition: 'all 0.3s ease',
                                                            overflow: 'hidden',
                                                            '&:hover': {
                                                                borderColor: '#C6A96B',
                                                                transform: 'translateY(-4px)',
                                                                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                                                            }
                                                        }}
                                                        onClick={() => router.visit(route('product.show', product.slug))}
                                                    >
                                                        <Box sx={{ width: '100%', pt: '100%', position: 'relative', overflow: 'hidden' }}>
                                                            {product.image_url ? (
                                                                <CardMedia
                                                                    component="img"
                                                                    image={product.image_url}
                                                                    alt={product.name}
                                                                    sx={{
                                                                        objectFit: 'cover',
                                                                        position: 'absolute',
                                                                        top: 0, left: 0, width: '100%', height: '100%',
                                                                        transition: 'transform 0.5s ease',
                                                                        '.MuiCard-root:hover &': { transform: 'scale(1.1)' }
                                                                    }}
                                                                />
                                                            ) : (
                                                                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                                                                    <NoImagePlaceholder />
                                                                </Box>
                                                            )}
                                                        </Box>
                                                        <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                                                            <Typography
                                                                variant="subtitle2"
                                                                sx={{
                                                                    fontWeight: 'bold',
                                                                    color: 'white',
                                                                    fontSize: '0.9rem',
                                                                    mb: 1,
                                                                    lineHeight: 1.2,
                                                                    height: '2.4em',
                                                                    overflow: 'hidden',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                }}
                                                            >
                                                            {product.name}
                                                        </Typography>

                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: product.current_stock !== null ? (product.current_stock > 0 ? '#4CAF50' : '#f44336') : 'transparent',
                                                                fontWeight: 'bold',
                                                                display: 'block',
                                                                mb: 0.5,
                                                                fontSize: '0.7rem',
                                                                lineHeight: '0.7rem'
                                                            }}
                                                        >
                                                            {product.current_stock !== null ? `Stok: ${product.current_stock} ${product.unit?.unit || ''}` : '\u00A0'}
                                                        </Typography>
                                                        
                                                        <Box sx={{ mt: 'auto' }}>
                                                                {!auth?.user ? (
                                                                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                                                                        Login untuk harga
                                                                    </Typography>
                                                                ) : (
                                                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#C6A96B', mb: 1 }}>
                                                                        Rp {Number(product.online_price || 0).toLocaleString('id-ID')}
                                                                    </Typography>
                                                                )}
                                                                <Button
                                                                    variant="contained"
                                                                    size="small"
                                                                    fullWidth
                                                                    disabled={product.current_stock === 0}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleAddToCart(product);
                                                                    }}
                                                                    sx={{
                                                                        bgcolor: product.current_stock === 0 ? 'rgba(255,255,255,0.1)' : '#C6A96B',
                                                                        color: product.current_stock === 0 ? 'text.secondary' : '#0a0a0a',
                                                                        fontWeight: 'bold',
                                                                        textTransform: 'none',
                                                                        '&:hover': product.current_stock === 0 ? {} : { bgcolor: '#D4AF37' }
                                                                    }}
                                                                >
                                                                    {product.current_stock === 0 ? 'Stok Habis' : 'Add'}
                                                                </Button>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                );
                            })}

                            {/* Section for products without a category */}
                            {products.filter(p => !p.online_category_id).length > 0 && (
                                <Box sx={{ mb: 6 }}>
                                    <Typography variant="h5" sx={{ mb: 3, color: '#C6A96B', fontWeight: 'bold', borderBottom: '2px solid rgba(198, 169, 107, 0.2)', pb: 1, display: 'inline-block' }}>
                                        Lainnya
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {products.filter(p => !p.online_category_id).map((product) => (
                                            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 2 }} key={product.id}>
                                                <Card elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', bgcolor: '#141414', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: 2, transition: 'all 0.3s ease', overflow: 'hidden', '&:hover': { borderColor: '#C6A96B', transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' } }} onClick={() => router.visit(route('product.show', product.slug))}>
                                                    <Box sx={{ width: '100%', pt: '100%', position: 'relative', overflow: 'hidden' }}>
                                                        {product.image_url ? (
                                                            <CardMedia component="img" image={product.image_url} alt={product.name} sx={{ objectFit: 'cover', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transition: 'transform 0.5s ease', '.MuiCard-root:hover &': { transform: 'scale(1.1)' } }} />
                                                        ) : (
                                                            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                                                                <NoImagePlaceholder />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                    <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white', fontSize: '0.9rem', mb: 1, lineHeight: 1.2, height: '2.4em', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                            {product.name}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            sx={{
                                                                color: product.current_stock !== null ? (product.current_stock > 0 ? '#4CAF50' : '#f44336') : 'transparent',
                                                                fontWeight: 'bold',
                                                                display: 'block',
                                                                mb: 0.5,
                                                                fontSize: '0.7rem',
                                                                lineHeight: '0.7rem'
                                                            }}
                                                        >
                                                            {product.current_stock !== null ? `Stok: ${product.current_stock} ${product.unit?.unit || ''}` : '\u00A0'}
                                                        </Typography>
                                                        <Box sx={{ mt: 'auto' }}>
                                                            {!auth?.user ? ( <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}> Login untuk harga </Typography> ) : ( <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#C6A96B', mb: 1 }}> Rp {Number(product.online_price || 0).toLocaleString('id-ID')} </Typography> )}
                                                            <Button variant="contained" size="small" fullWidth disabled={product.current_stock === 0} onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }} sx={{ bgcolor: product.current_stock === 0 ? 'rgba(255,255,255,0.1)' : '#C6A96B', color: product.current_stock === 0 ? 'text.secondary' : '#0a0a0a', fontWeight: 'bold', textTransform: 'none', '&:hover': product.current_stock === 0 ? {} : { bgcolor: '#D4AF37' } }}> {product.current_stock === 0 ? 'Stok Habis' : 'Add'} </Button>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}

                            {products.length === 0 && (
                                <Box sx={{ py: 12, textAlign: 'center' }}>
                                    <Typography color="text.secondary" variant="h5">
                                        Tidak ada produk ditemukan
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </Container>
            </Box>
            <Footer />
            <Toaster /> {/* Add Toaster component here */}
        </Layout>
    );
}
