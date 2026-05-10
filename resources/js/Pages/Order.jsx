import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
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
    Button // Add Button import
} from '@mui/material';
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

export default function Order({ auth, products = [], categories = [], units = [] }) {
    const initialFilters = getInitialFilters();
    const isInitialRender = useRef(true);
    const [selectedCategory, setSelectedCategory] = useState(initialFilters.category);
    const [priceRange, setPriceRange] = useState({ min: initialFilters.minPrice, max: initialFilters.maxPrice });
    const [selectedUnit, setSelectedUnit] = useState(initialFilters.unit);
    const [searchQuery, setSearchQuery] = useState(initialFilters.search);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isInitialRender.current) {
            isInitialRender.current = false;
            return;
        }

        if (priceRange.min < 0) return;
        // Memungkinkan max_price 0 atau null untuk mengabaikan filter max
        if (priceRange.max !== 0 && priceRange.max !== null && priceRange.max < priceRange.min) return;

        const debounceTimeout = setTimeout(() => {
            const filters = {};

            if (selectedCategory !== 'all') filters.category = selectedCategory;
            if (priceRange.min > 0) filters.min_price = priceRange.min;
            if (priceRange.max > 0) filters.max_price = priceRange.max;
            if (selectedUnit !== 'all') filters.unit = selectedUnit;
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
    }, [selectedCategory, priceRange, selectedUnit, searchQuery]);

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                        Order
                    </Typography>
                </Box>
            }
        >
            <Head title="Order" />

            <Box sx={{ py: 2 }}> {/* Reduced vertical padding */}
                <Container maxWidth="xl"> {/* Increased maxWidth to xl */}
                    <Grid container spacing={2}> {/* Reduced spacing between main columns */}
                        {/* Sidebar Filter */}
                        <Grid size={{ xs: 12, md: 2.5 }}> {/* Reduced sidebar width */}
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    bgcolor: 'background.paper',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    Filter Products
                                </Typography>

                                {/* Filter options using Stack for spacing */}
                                <Stack spacing={3} sx={{ flexGrow: 1 }}>
                                    {/* Search Input */}
                                    <TextField
                                        label="Search Products"
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        disabled={isLoading}
                                    />
                                    {/* Category Filter */}
                                    <FormControl fullWidth size="small">
                                        <InputLabel id="category-select-label">Category</InputLabel>
                                        <Select
                                            labelId="category-select-label"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                            label="Category"
                                        disabled={isLoading}
                                    >
                                            <MenuItem value="all">All Categories</MenuItem>
                                        {categories.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                                </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>

                                {/* Price Range Filter */}
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'medium' }}>
                                            Price Range
                                        </Typography>
                                        {/* Grid container for price inputs */}
                                        <Grid container spacing={1}> {/* Spacing between price inputs */}
                                            <Grid size={6}>
                                                <TextField
                                            type="number"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
                                                    placeholder="Min"
                                                    fullWidth
                                                    size="small"
                                            disabled={isLoading}
                                                    InputProps={{ inputProps: { min: 0 } }}
                                        />
                                            </Grid>
                                            <Grid size={6}>
                                                <TextField
                                            type="number"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 0 })}
                                                    placeholder="Max"
                                                    fullWidth
                                                    size="small"
                                            disabled={isLoading}
                                                    InputProps={{ inputProps: { min: 0 } }}
                                        />
                                            </Grid>
                                        </Grid>
                                    </Box>

                                {/* Unit Filter */}
                                    <FormControl fullWidth size="small">
                                         <InputLabel id="unit-select-label">Unit</InputLabel>
                                        <Select
                                            labelId="unit-select-label"
                                        value={selectedUnit}
                                        onChange={(e) => setSelectedUnit(e.target.value)}
                                            label="Unit"
                                        disabled={isLoading}
                                    >
                                            <MenuItem value="all">All Units</MenuItem>
                                        {units.map((unit) => (
                                                <MenuItem key={unit.id} value={unit.id}>
                                                {unit.unit}
                                                </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Paper>
                        </Grid>

                        {/* Product Grid */}
                        <Grid size={{ xs: 12, md: 9.5 }}> {/* Increased product grid width */} 
                                {isLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <Grid container spacing={1.5}> {/* Tighter spacing between product cards */}
                                        {products.length > 0 ? products.map((product) => (
                                            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={product.id}> {/* 5 columns on lg screens (12/5 = 2.4) */}
                                                <Card
                                                    elevation={0}
                                                    sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        cursor: 'pointer',
                                                        border: '1px solid',
                                                        borderColor: 'divider',
                                                        borderRadius: 2,
                                                        transition: 'all 0.2s ease-in-out',
                                                        overflow: 'hidden',
                                                        position: 'relative',
                                                        '&:hover': {
                                                            borderColor: '#C6A96B',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)' // More subtle shadow
                                                        }
                                                    }}
                                                onClick={() => router.visit(route('product.show', product.slug))}
                                            >
                                                    {/* Aspect ratio container for image/placeholder */}
                                                    <Box sx={{ width: '100%', pt: '100%', position: 'relative', overflow: 'hidden' }}>
                                                        {product.image_url ? (
                                                            <CardMedia
                                                                component="img"
                                                                image={product.image_url}
                                                            alt={product.name}
                                                                sx={{
                                                                    objectFit: 'cover',
                                                                    position: 'absolute',
                                                                    top: 0,
                                                                    left: 0,
                                                                    width: '100%',
                                                                    height: '100%',
                                                                    transition: 'transform 0.5s ease',
                                                                    '.MuiCard-root:hover &': {
                                                                        transform: 'scale(1.1)'
                                                                    }
                                                                }}
                                                            />
                                                        ) : (
                                                              // Placeholder centered within the aspect ratio container
                                                             <Box sx={{
                                                                 position: 'absolute',
                                                                 top: 0,
                                                                 left: 0,
                                                                 width: '100%',
                                                                 height: '100%'
                                                             }}>
                                                                 <NoImagePlaceholder />
                                                             </Box>
                                                        )}
                                                    </Box>
                                                    <CardContent sx={{ flexGrow: 1, p: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}> {/* Reduced padding */}
                                                        <Box> {/* Wrapper for name to keep it separate from prices */}
                                                            <Typography
                                                                variant="subtitle2"
                                                                component="h3"
                                                                sx={{
                                                                    fontWeight: '600', // Slightly lighter weight for better readability at small size
                                                                    fontSize: '0.875rem', // Smaller font size
                                                                    mb: 0.5, // Reduced margin
                                                                    lineHeight: 1.2,
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                }}
                                                                title={product.name}
                                                            >
                                                                {product.name}
                                                            </Typography>
                                                        </Box>
                                                        {/* Container for prices */}
                                                        <Box sx={{ mt: 'auto' }}>
                                                            {product.price_tiers && product.price_tiers.length > 0 ? (
                                                                <Box sx={{ bgcolor: 'rgba(198, 169, 107, 0.05)', p: 0.75, borderRadius: 1 }}>
                                                                    {product.price_tiers.slice(0, 2).map((tier, index) => (
                                                                        <Box
                                                                            key={index}
                                                                            sx={{
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                alignItems: 'center',
                                                                                mb: index === 0 ? 0.25 : 0
                                                                            }}
                                                                        >
                                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                                                                {tier.min_quantity}+ {product.unit?.unit || 'unit'}
                                                                            </Typography>
                                                                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#C6A96B', fontSize: '0.7rem' }}>
                                                                                Rp {Number(tier.price).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                                                            </Typography>
                                                                        </Box>
                                                                    ))}
                                                                </Box>
                                                            ) : Number(product.online_price) > 0 ? (
                                                                <Box sx={{ display: 'flex', flexDirection: 'column', bgcolor: 'rgba(198, 169, 107, 0.05)', p: 0.75, borderRadius: 1 }}>
                                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                                                        Per {product.unit.unit}
                                                                    </Typography>
                                                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#C6A96B', fontSize: '0.9rem' }}>
                                                                        Rp {Number(product.online_price || 0).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                                                    </Typography>
                                                                </Box>
                                                            ) : null}
                                                        </Box>
                                                    </CardContent>
                                                    <Box sx={{ px: 0.75, pb: 1 }}>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            fullWidth
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleAddToCart(product);
                                                            }}
                                                            sx={{
                                                                borderRadius: 1,
                                                                py: 0.5,
                                                                fontWeight: 'bold',
                                                                fontSize: '0.7rem',
                                                                textTransform: 'none',
                                                                boxShadow: 'none',
                                                                background: 'linear-gradient(45deg, #C6A96B 30%, #D4AF37 90%)',
                                                                '&:hover': {
                                                                    background: 'linear-gradient(45deg, #B0945A 30%, #C6A96B 90%)',
                                                                    boxShadow: 'none',
                                                                }
                                                            }}
                                                        >
                                                            Add to Cart
                                                        </Button>
                                                    </Box>
                                                </Card>
                                            </Grid>
                                        )) : (
                                            <Grid size={12}>
                                                <Box sx={{ py: 8, textAlign: 'center' }}>
                                                    <Typography color="text.secondary" variant="h6">
                                                        Tidak ada produk yang tersedia
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Toaster /> {/* Add Toaster component here */}
        </Layout>
    );
}
