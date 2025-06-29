import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import Footer from '@/Components/Footer';
import { Container, Typography, Grid, Card, Button, Box } from '@mui/material';
import { foodPrimaryBrown, foodSecondaryBrown, primaryGreen, secondaryGreen } from '@/constants/colors';

export default function Welcome({ auth, products, categories }) {
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            auth={auth}
            primaryColor={primaryGreen}
            secondaryColor={secondaryGreen}
        >
            <Head title="Welcome" />
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
                                Selamat Datang di Sagansa
                            </Typography>
                            <Typography
                                variant="h4"
                                sx={{
                                    mb: 4,
                                    color: 'primary.main',
                                    opacity: 0.9,
                                }}
                            >
                                Solusi Terpercaya untuk Kebutuhan Bisnis Anda
                            </Typography>
                            <Grid container spacing={3} justifyContent="center">
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Card
                                        component={Link}
                                        href="/food"
                                        sx={{
                                            height: '100%', // Ensure card takes full height of grid item
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            p: 4,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            textDecoration: 'none',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                opacity: 0.9,
                                            },
                                        }}
                                    >
                                        <Typography variant="h2" sx={{ mb: 1 }}>🍽️</Typography>
                                        <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                                            Sagansa Food
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Supplier Makanan Berkualitas
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                                    <Card
                                        component={Link}
                                        href="/engineering"
                                        sx={{
                                            height: '100%', // Ensure card takes full height of grid item
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            p: 4,
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            textDecoration: 'none',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                                opacity: 0.9,
                                            },
                                        }}
                                    >
                                        <Typography variant="h2" sx={{ mb: 1 }}>⚙️</Typography>
                                        <Typography variant="h5" fontWeight="600" sx={{ mb: 1 }}>
                                            Sagansa Engineering
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Solusi Teknis Profesional
                                        </Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </Box>

                {/* Services Section */}
                <Box
                    sx={{
                        px: { xs: 2, md: 4, lg: 8 },
                        py: 8,
                        bgcolor: 'background.paper'
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
                                color: 'primary.main'
                            }}
                        >
                            Layanan Kami
                        </Typography>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{
                                    p: 4,
                                    height: '100%',
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'scale(1.05)' },
                                }}>
                                    <Box sx={{ mb: 2, fontSize: '2.5rem' }}>🍽️</Box>
                                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                        Sagansa Food
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                                        Menyediakan bahan makanan berkualitas tinggi untuk restoran, hotel, dan katering. Dengan pengalaman lebih dari 10 tahun, kami menjamin kualitas dan kesegaran setiap produk.
                                    </Typography>
                                    <Button
                                        component={Link}
                                        href="/food"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Pelajari Lebih Lanjut
                                    </Button>
                                </Card>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{
                                    p: 4,
                                    height: '100%',
                                    transition: 'transform 0.3s',
                                    '&:hover': { transform: 'scale(1.05)' },
                                }}>
                                    <Box sx={{ mb: 2, fontSize: '2.5rem' }}>⚙️</Box>
                                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                                        Sagansa Engineering
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                                        Menyediakan layanan engineering berkualitas tinggi untuk industri manufaktur dan konstruksi. Tim ahli kami siap membantu mengoptimalkan proses produksi Anda.
                                    </Typography>
                                    <Button
                                        component={Link}
                                        href="/engineering"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Pelajari Lebih Lanjut
                                    </Button>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Frequently Ordered Products Section */}
                <Box
                    sx={{
                        px: { xs: 2, md: 4, lg: 8 },
                        py: 8,
                        bgcolor: 'background.paper'
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
                                color: 'primary.main'
                            }}
                        >
                            Produk Sering Dipesan
                        </Typography>
                        <Grid container spacing={4}>
                            {products.slice(0, 4).map((product) => ( // Display up to 4 frequently ordered products
                                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                    <Card sx={{
                                        p: 2,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'scale(1.05)' },
                                    }}>
                                        <Box sx={{ width: '100%', height: 150, overflow: 'hidden', mb: 2 }}>
                                            <img
                                                src={product.product_images && product.product_images.length > 0 ? product.product_images[0].image_path : '/images/default-product.jpg'}
                                                alt={product.name}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </Box>
                                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                            {product.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {product.description ? product.description.substring(0, 70) + '...' : ''}
                                        </Typography>
                                        <Typography variant="h6" color="primary.main" sx={{ mt: 'auto', mb: 1 }}>
                                            Rp. {new Intl.NumberFormat('id-ID').format(product.price)}
                                        </Typography>
                                        <Button
                                            component={Link}
                                            href={`/product/${product.slug}`}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                        >
                                            Lihat Produk
                                        </Button>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Box sx={{ textAlign: 'center', mt: 6 }}>
                            <Button
                                component={Link}
                                href="/food" // Assuming /food or a general /products page
                                variant="outlined"
                                color="primary"
                                size="large"
                            >
                                Lihat Semua Produk
                            </Button>
                        </Box>
                    </Container>
                </Box>

                {/* About Section */}
                <Box
                    sx={{
                        px: { xs: 2, md: 4, lg: 8 },
                        py: 8,
                        bgcolor: 'background.paper'
                    }}
                >
                    <Container maxWidth="lg">
                        <Grid container spacing={6} alignItems="center">
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
                                    Tentang Sagansa
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, color: 'primary.main', opacity: 0.9 }}>
                                    Sagansa adalah perusahaan yang berkomitmen untuk memberikan solusi terbaik
                                    dalam bidang food supply dan engineering untuk mendukung pertumbuhan bisnis Anda.
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, color: 'primary.main', opacity: 0.9 }}>
                                    Dengan pengalaman yang luas dan tim profesional, kami siap menjadi
                                    mitra terpercaya dalam mengembangkan bisnis Anda ke tingkat yang lebih tinggi.
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Card sx={{
                                    height: '16rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bgcolor: 'background.paper',
                                    borderRadius: 2,
                                    boxShadow: 3
                                }}>
                                    <Typography variant="h2" sx={{ fontSize: '3rem' }}>🏢 🤝 📈</Typography>
                                </Card>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>


                {/* About Section */}
                <Box
                    sx={{
                        px: { xs: 2, md: 4, lg: 8 },
                        py: 8,
                        bgcolor: 'background.paper'
                    }}
                >
                    <Container maxWidth="lg">
                {/* Why Choose Us Section */}
                        <Box sx={{ py: 8 }}>
                            <Typography
                                variant="h3"
                                sx={{ mb: 6, textAlign: 'center', color: 'primary.main', fontWeight: 'bold' }}
                            >
                                Mengapa Memilih Kami
                            </Typography>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                    <Card sx={{
                                        p: 3,
                                        height: '100%',
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'scale(1.05)' }
                                    }}>
                                        <Box sx={{ mb: 2, fontSize: '2.5rem', textAlign: 'center' }}>🌟</Box>
                                        <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
                                            Kualitas Terjamin
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'center' }}>
                                            Standar kualitas tinggi dalam setiap produk dan layanan
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                    <Card sx={{
                                        p: 3,
                                        height: '100%',
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'scale(1.05)' }
                                    }}>
                                        <Box sx={{ mb: 2, fontSize: '2.5rem', textAlign: 'center' }}>🤝</Box>
                                        <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
                                            Layanan Profesional
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'center' }}>
                                            Tim ahli yang berpengalaman dan profesional
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                    <Card sx={{
                                        p: 3,
                                        height: '100%',
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'scale(1.05)' }
                                    }}>
                                        <Box sx={{ mb: 2, fontSize: '2.5rem', textAlign: 'center' }}>⚡</Box>
                                        <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
                                            Respons Cepat
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'center' }}>
                                            Pelayanan cepat dan solusi yang efektif
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                                    <Card sx={{
                                        p: 3,
                                        height: '100%',
                                        transition: 'transform 0.3s',
                                        '&:hover': { transform: 'scale(1.05)' }
                                    }}>
                                        <Box sx={{ mb: 2, fontSize: '2.5rem', textAlign: 'center' }}>💪</Box>
                                        <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 600, textAlign: 'center' }}>
                                            Dukungan Penuh
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9, textAlign: 'center' }}>
                                            Mendukung pertumbuhan bisnis Anda
                                        </Typography>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </Container>
                </Box>

                <Footer />
        </Layout>
    );
}
