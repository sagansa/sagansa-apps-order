import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { engineeringPrimaryBlue, engineeringSecondaryBlue } from '@/constants/colors';
import Footer from '@/Components/Footer';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function WelcomeEngineering({ auth, products = [] }) {
    // Products are already filtered in the backend
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    const theme = createTheme({
        palette: {
            primary: {
                main: engineeringPrimaryBlue,
            },
            secondary: {
                main: engineeringSecondaryBlue,
            },
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Layout
                auth={auth}
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
            <section className="px-4 py-16 bg-white transition-colors duration-300 md:px-8 lg:px-16 dark:bg-gray-900">
                <div className="mx-auto">
                    <h2 style={{ color: engineeringPrimaryBlue }} className="mb-12 text-3xl font-bold text-center">
                        Layanan Kami
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="mb-4 text-4xl">⚡</div>
                            <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-xl font-semibold">
                                EV Charging
                            </h3>
                            <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                Solusi lengkap untuk instalasi dan perawatan charging station kendaraan listrik
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="mb-4 text-4xl">⚡</div>
                            <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-xl font-semibold">
                                Grounding System
                            </h3>
                            <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                Instalasi sistem grounding yang aman dan handal untuk charging station
                            </p>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="mb-4 text-4xl">💻</div>
                            <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-xl font-semibold">
                                Software Development
                            </h3>
                            <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                Pengembangan aplikasi web dan mobile untuk mendukung bisnis Anda
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="px-4 py-16 bg-white transition-colors duration-300 md:px-8 lg:px-16 dark:bg-gray-900">
                <div className="mx-auto">
                    <div className="grid grid-cols-1 gap-12 items-center md:grid-cols-2">
                        <div>
                            <h2 style={{ color: engineeringPrimaryBlue }} className="mb-6 text-3xl font-bold">
                                Tentang Sagansa Engineering
                            </h2>
                            <p style={{ color: engineeringPrimaryBlue }} className="mb-4 opacity-90">
                                Sagansa Engineering adalah penyedia solusi EV charging dan pengembangan software terkemuka
                                yang berkomitmen untuk memberikan layanan berkualitas tinggi untuk kebutuhan bisnis Anda.
                            </p>
                            <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                Dengan tim ahli berpengalaman dalam instalasi charging station dan pengembangan aplikasi,
                                kami siap membantu mengoptimalkan infrastruktur EV dan solusi digital Anda.
                            </p>
                        </div>
                        <div className="flex justify-center items-center p-6 h-64 rounded-lg backdrop-blur-sm bg-white/10 dark:bg-gray-800/10">
                            <div className="text-4xl">⚙️ 🔧 📊</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="px-4 py-16 bg-white transition-colors duration-300 dark:bg-gray-900 md:px-8 lg:px-16">
                <div className="mx-auto">
                    <h2 style={{ color: engineeringPrimaryBlue }} className="mb-12 text-3xl font-bold text-center">
                        Proyek Unggulan
                    </h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                        <div className="overflow-hidden bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="p-6">
                                <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-lg font-semibold">
                                    Instalasi EV Charging
                                </h3>
                                <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                    Pemasangan charging station dengan sistem grounding yang handal untuk berbagai lokasi
                                </p>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="p-6">
                                <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-lg font-semibold">
                                    Aplikasi Monitoring
                                </h3>
                                <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                    Pengembangan sistem monitoring charging station berbasis web dan mobile
                                </p>
                            </div>
                        </div>
                        <div className="overflow-hidden bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105">
                            <div className="p-6">
                                <h3 style={{ color: engineeringPrimaryBlue }} className="mb-2 text-lg font-semibold">
                                    Custom Software
                                </h3>
                                <p style={{ color: engineeringPrimaryBlue }} className="opacity-90">
                                    Pengembangan aplikasi khusus sesuai kebutuhan bisnis Anda
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </Layout>
        </ThemeProvider>
    );
}
