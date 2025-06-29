import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { useState, useEffect } from 'react';
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
    Stack
} from '@mui/material';

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

export default function Order({ auth, products = [], categories = [], units = [] }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
    const [selectedUnit, setSelectedUnit] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (priceRange.min < 0) return;
        // Memungkinkan max_price 0 atau null untuk mengabaikan filter max
        if (priceRange.max !== 0 && priceRange.max !== null && priceRange.max < priceRange.min) return;

        const debounceTimeout = setTimeout(() => {
            setIsLoading(true);
            router.get(
                route('order.index'),
                {
                    category: selectedCategory,
                    min_price: priceRange.min || null,
                    max_price: (priceRange.max === 0 || priceRange.max === null) ? null : priceRange.max,
                    unit: selectedUnit
                },
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
    }, [selectedCategory, priceRange, selectedUnit]);

    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

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

            <Box sx={{ py: 4 }}> {/* Consistent vertical padding */}
                <Container maxWidth="lg">
                    <Grid container spacing={4}> {/* Spacing between main columns */}
                        {/* Sidebar Filter */}
                        <Grid size={{ xs: 12, md: 3 }}>
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
                        <Grid size={{ xs: 12, md: 9 }}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 3,
                                    bgcolor: 'background.paper',
                                    height: '100%'
                                }}
                            >
                                {isLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <Grid container spacing={2}> {/* Spacing between product cards */}
                                        {products.length > 0 ? products.map((product) => (
                                            <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }} key={product.id}>
                                                <Card
                                                    sx={{
                                                        height: '100%',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            boxShadow: 6
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
                                                    <CardContent sx={{ flexGrow: 1, p: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}> {/* Add display flex, column, justify between */}
                                                        <Box> {/* Wrapper for name to keep it separate from prices */}
                                                            <Typography
                                                                gutterBottom // Adds margin below the text
                                                                variant="subtitle2"
                                                                component="h3"
                                                                sx={{
                                                                    fontWeight: 'bold',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    display: '-webkit-box',
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: 'vertical',
                                                                }}
                                                                title={product.name} // Menambahkan atribut title untuk tooltip
                                                            >
                                                                {product.name}
                                                            </Typography>
                                                        </Box>
                                                        {/* Container for prices */}
                                                        <Box>
                                                            {product.multi_price && product.multi_price.length > 0 ? (
                                                                product.multi_price.map((price, index) => (
                                                                    <Box
                                                                        key={index}
                                                                        sx={{
                                                                            display: 'flex',
                                                                            justifyContent: 'space-between',
                                                                            alignItems: 'center',
                                                                            mb: index < product.multi_price.length - 1 ? 0.5 : 0 // Margin between price items
                                                                        }}
                                                                    >
                                                                        <Typography variant="caption" color="text.secondary">
                                                                            {price.min_quantity} {product.unit.unit}
                                                                        </Typography>
                                                                        <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                                                                            Rp {price.price.toLocaleString()}
                                                                        </Typography>
                                                                    </Box>
                                                                ))
                                                            ) : (
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        1 {product.unit.unit}
                                                                    </Typography>
                                                                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 'bold' }}>
                                                            Rp {(product.online_price || 0).toLocaleString()}
                                                                    </Typography>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )) : (
                                            <Grid xs={12}>
                                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                                    <Typography color="text.secondary">
                                                Tidak ada produk yang tersedia
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        )}
                                    </Grid>
                                )}
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Layout>
    );
}
