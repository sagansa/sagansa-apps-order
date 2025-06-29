import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { engineeringPrimaryBlue, engineeringSecondaryBlue } from '@/constants/colors';
import Footer from '@/Components/Footer';
import { Container, Typography, Grid, Card, Button, Box } from '@mui/material';

export default function WelcomeEngineering({ auth, products = [] }) {
    // Products are already filtered in the backend
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout
            auth={auth}
            primaryColor={engineeringPrimaryBlue}
            secondaryColor={engineeringSecondaryBlue}
            header={
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight="600" color="text.primary">
                        Sagansa Engineering
                    </Typography>
                </Box>
            }
        >
            <Head title="Sagansa Engineering" />
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
                            Solusi EV Charging & Software Development
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 4,
                                color: 'primary.main',
                                opacity: 0.9,
                            }}
                        >
                            Menyediakan layanan pemasangan EV charging, grounding, dan pengembangan aplikasi berkualitas tinggi
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
                            Konsultasi Sekarang
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
                        Layanan Kami
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{
                                p: 3,
                                height: '100%',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.05)' },
                                bgcolor: 'background.paper',
                            }}>
                                <Box sx={{ mb: 2, fontSize: '2.5rem' }}>⚡</Box>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                    EV Charging
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, color: 'text.primary' }}>
                                    Solusi lengkap untuk instalasi dan perawatan charging station kendaraan listrik
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{
                                p: 3,
                                height: '100%',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.05)' },
                                bgcolor: 'background.paper',
                            }}>
                                <Box sx={{ mb: 2, fontSize: '2.5rem' }}>⚡</Box>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                    Grounding System
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, color: 'text.primary' }}>
                                    Instalasi sistem grounding yang aman dan handal untuk charging station
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{
                                p: 3,
                                height: '100%',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.05)' },
                                bgcolor: 'background.paper',
                            }}>
                                <Box sx={{ mb: 2, fontSize: '2.5rem' }}>💻</Box>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                    Software Development
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, color: 'text.primary' }}>
                                    Pengembangan aplikasi web dan mobile untuk mendukung bisnis Anda
                                </Typography>
                            </Card>
                        </Grid>
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
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                                Tentang Sagansa Engineering
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9, color: 'text.primary' }}>
                                Sagansa Engineering adalah penyedia solusi EV charging dan pengembangan software terkemuka
                                yang berkomitmen to provide high-quality services for your business needs.
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 2, opacity: 0.9, color: 'text.primary' }}>
                                With an experienced team of experts in charging station installation and application development,
                                we are ready to help optimize your EV infrastructure and digital solutions.
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
                                boxShadow: 3,
                            }}>
                                <Typography variant="h2" sx={{ fontSize: '3rem' }}>⚙️ 🔧 📊</Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Featured Projects Section */}
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
                        Proyek Unggulan
                    </Typography>
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{
                                p: 3,
                                height: '100%',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.05)' },
                                bgcolor: 'background.paper',
                            }}>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                    Instalasi EV Charging
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, color: 'text.primary' }}>
                                    Pemasangan charging station dengan sistem grounding yang handal untuk berbagai lokasi
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{
                                p: 3,
                                height: '100%',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.05)' },
                                bgcolor: 'background.paper',
                            }}>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                    Aplikasi Monitoring
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, color: 'text.primary' }}>
                                    Pengembangan sistem monitoring charging station berbasis web dan mobile
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card sx={{
                                p: 3,
                                height: '100%',
                                transition: 'transform 0.3s',
                                '&:hover': { transform: 'scale(1.05)' },
                                bgcolor: 'background.paper',
                            }}>
                                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                                    Custom Software
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, color: 'text.primary' }}>
                                    Pengembangan aplikasi khusus sesuai kebutuhan bisnis Anda
                                </Typography>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
            <Footer />
        </Layout>
    );
}
