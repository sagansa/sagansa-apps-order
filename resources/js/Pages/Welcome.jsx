import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { primaryGreen, secondaryGreen } from '@/constants/colors';
import Footer from '@/Components/Footer';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function Welcome({ auth, products, categories }) {
    const filteredProducts = products.filter(product => product.online_category_id !== 4);
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    const theme = createTheme({
        palette: {
            mode: 'light',
            primary: {
                main: primaryGreen,
            },
            secondary: {
                main: secondaryGreen,
            },
            background: {
                default: '#ffffff',
                paper: '#ffffff',
            },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'background.paper',
                    },
                },
            },
        },
    });

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: primaryGreen,
            },
            secondary: {
                main: secondaryGreen,
            },
            background: {
                default: '#121212',
                paper: '#1e1e1e',
            },
            text: {
                primary: '#ffffff',
                secondary: 'rgba(255, 255, 255, 0.7)',
            },
        },
        components: {
            MuiCard: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'background.paper',
                    },
                },
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Layout
                auth={auth}
            >
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
                                <Grid item>
                                    <Card
                                        component={Link}
                                        href="/food"
                                        sx={{
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
                                <Grid item>
                                    <Card
                                        component={Link}
                                        href="/engineering"
                                        sx={{
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
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <Card sx={{
                p: 4,
                transition: 'transform 0.3s',
                '&:hover': {
                    transform: 'scale(1.05)',
                },
            }}>
                <Box sx={{ mb: 2, fontSize: '2.5rem' }}>🍽️</Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    Sagansa Food
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'primary.main', opacity: 0.9 }}>
                    Menyediakan bahan makanan berkualitas tinggi untuk restoran, hotel, dan katering. Dengan pengalaman lebih dari 10 tahun, kami menjamin kualitas dan kesegaran setiap produk.
                </Typography>
                <Button
                    component={Link}
                    href="/food"
                    variant="contained"
                    color="primary"
                    sx={{
                        px: 3,
                        py: 1,
                        '&:hover': { opacity: 0.9 },
                    }}
                >
                    Pelajari Lebih Lanjut
                </Button>
            </Card>
                            <Card sx={{
                p: 4,
                transition: 'transform 0.3s',
                '&:hover': {
                    transform: 'scale(1.05)',
                },
            }}>
                <Box sx={{ mb: 2, fontSize: '2.5rem' }}>⚙️</Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                    Sagansa Engineering
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: 'primary.main', opacity: 0.9 }}>
                    Menyediakan layanan engineering berkualitas tinggi untuk industri manufaktur dan konstruksi. Tim ahli kami siap membantu mengoptimalkan proses produksi Anda.
                </Typography>
                <Button
                    component={Link}
                    href="/engineering"
                    variant="contained"
                    color="primary"
                    sx={{
                        px: 3,
                        py: 1,
                        '&:hover': { opacity: 0.9 },
                    }}
                >
                    Pelajari Lebih Lanjut
                </Button>
            </Card>
                        </div>
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
                            <Grid item xs={12} md={6}>
                                <Typography variant="h3" sx={{ mb: 3, color: 'primary.main', fontWeight: 'bold' }}>
                                    Tentang Sagansa
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, color: 'primary.main', opacity: 0.9 }}>
                                    Sagansa adalah perusahaan yang berkomitmen untuk memberikan solusi terbaik
                                    dalam bidang food supply dan engineering untuk mendukung pertumbuhan bisnis Anda.
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'primary.main', opacity: 0.9 }}>
                                    Dengan pengalaman yang luas dan tim profesional, kami siap menjadi
                                    mitra terpercaya dalam mengembangkan bisnis Anda ke tingkat yang lebih tinggi.
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
                                <Grid item xs={12} sm={6} lg={3}>
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
                                        <Typography variant="body2" sx={{ color: 'primary.main', opacity: 0.9, textAlign: 'center' }}>
                                            Standar kualitas tinggi dalam setiap produk dan layanan
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
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
                                        <Typography variant="body2" sx={{ color: 'primary.main', opacity: 0.9, textAlign: 'center' }}>
                                            Tim ahli yang berpengalaman dan profesional
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
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
                                        <Typography variant="body2" sx={{ color: 'primary.main', opacity: 0.9, textAlign: 'center' }}>
                                            Pelayanan cepat dan solusi yang efektif
                                        </Typography>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} lg={3}>
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
                                        <Typography variant="body2" sx={{ color: 'primary.main', opacity: 0.9, textAlign: 'center' }}>
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
        </ThemeProvider>
    );
}
