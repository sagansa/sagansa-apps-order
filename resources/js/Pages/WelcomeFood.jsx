import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { foodPrimaryBrown, foodSecondaryBrown } from '@/constants/colors';
import Footer from '@/Components/Footer';
import { Container, Typography, Grid, Card, Button, Box } from '@mui/material';

export default function WelcomeFood({ auth, products = [], categories = [] }) {
    const filteredProducts = products?.filter(product => product.online_category_id !== 4) || [];
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            auth={auth}
            primaryColor={foodPrimaryBrown}
            secondaryColor={foodSecondaryBrown}
            header={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight="600" color="text.primary">
                        Sagansa Food
                    </Typography>
                </Box>
            }
        >
            <Head title="Sagansa Food" />
            {/* Hero Section */}
            <Box
                sx={{
                    position: 'relative',
                    py: 12,
                    bgcolor: 'background.paper',
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.1,
                        bgcolor: 'background.paper',
                    }}
                    className="bg-pattern"
                />
                <Container maxWidth="lg">
                    <Box textAlign="center">
                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                mb: 3,
                                fontSize: { xs: '2.5rem', md: '4rem' },
                                fontWeight: 'bold',
                                color: 'primary.main',
                            }}
                        >
                            Supplier Makanan Terpercaya untuk Bisnis Anda
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 4,
                                color: 'primary.main',
                                opacity: 0.9,
                            }}
                        >
                            Menyediakan bahan makanan berkualitas tinggi untuk restoran, hotel, dan katering
                        </Typography>
                        <Button
                            component={Link}
                            href="/order"
                            variant="contained"
                            size="large"
                            color="primary"
                            sx={{
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                '&:hover': {
                                    opacity: 0.9,
                                },
                            }}
                        >
                            Order Now
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* Featured Section */}
            <Box
                component="section"
                sx={{
                    px: { xs: 2, md: 4, lg: 8 },
                    py: 8,
                    bgcolor: 'background.paper',
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        sx={{
                            mb: 6,
                            textAlign: 'center',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: 'primary.main',
                        }}
                    >
                        Kategori Produk Kami
                    </Typography>
                    <Grid container spacing={4}>
                        {categories.map((category) => (
                            <Grid item xs={12} md={4} key={category.id}>
                                <Card sx={{
                                    p: 3,
                                    height: '100%',
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'scale(1.05)' },
                                    bgcolor: 'background.paper',
                                }}>
                                    <Box sx={{ mb: 2, fontSize: '2.5rem' }}>{category.icon}</Box>
                                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                        {category.name}
                                    </Typography>
                                    <Typography variant="body1" sx={{ opacity: 0.9, color: 'text.primary' }}>
                                        {category.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* About Section */}
            <Box
                component="section"
                sx={{
                    px: { xs: 2, md: 4, lg: 8 },
                    py: 8,
                    bgcolor: 'background.paper',
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                                Tentang Sagansa Food
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9, color: 'text.primary' }}>
                                Sagansa Food adalah supplier makanan terkemuka yang berkomitmen untuk
                                menyediakan bahan makanan berkualitas tinggi untuk bisnis kuliner Anda.
                            </Typography>
                            <Typography variant="body1" sx={{ opacity: 0.9, color: 'text.primary' }}>
                                Dengan pengalaman lebih dari 10 tahun dan jaringan pemasok yang luas,
                                kami menjamin kualitas dan kesegaran setiap produk yang kami kirimkan.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card sx={{
                                height: '16rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: 3,
                            }}>
                                <Typography variant="h2" sx={{ fontSize: '3rem' }}>🏭 🚚 🏪</Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Featured Products Section */}
            <Box
                component="section"
                sx={{
                    px: { xs: 2, md: 4, lg: 8 },
                    py: 8,
                    bgcolor: 'background.paper',
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        variant="h2"
                        sx={{
                            mb: 6,
                            textAlign: 'center',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            color: 'primary.main',
                        }}
                    >
                        Produk Unggulan
                    </Typography>
                    <Grid container spacing={4}>
                        {filteredProducts.map((product) => (
                            <Grid item xs={12} sm={6} lg={3} key={product.id}>
                                <Card
                                    component={Link}
                                    href={route('product.show', product.slug)}
                                    sx={{
                                        p: 2,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'scale(1.05)' },
                                        bgcolor: 'background.paper',
                                        textDecoration: 'none',
                                    }}
                                >
                                    <Box sx={{ overflow: 'hidden', aspectRatio: '1/1', mb: 2 }}>
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        />
                                    </Box>
                                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600, color: 'primary.main', lineClamp: 1 }}>
                                        {product.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                            Rp {product.online_price?.toLocaleString()}/{product.unit}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>
            <Footer />
        </Layout>
    );
}
