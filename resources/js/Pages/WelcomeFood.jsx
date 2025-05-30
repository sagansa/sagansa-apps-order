import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { foodPrimaryBrown, foodSecondaryBrown } from '@/constants/colors';
import Footer from '@/Components/Footer';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function WelcomeFood({ auth, products = [], categories = [] }) {
    const filteredProducts = products?.filter(product => product.online_category_id !== 4) || [];
    const Layout = auth?.user ? AuthenticatedLayout : GuestLayout;

    const theme = createTheme({
        palette: {
            primary: {
                main: foodPrimaryBrown,
            },
            secondary: {
                main: foodSecondaryBrown,
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
            <section className="px-4 py-16 bg-white transition-colors duration-300 md:px-8 lg:px-16 dark:bg-gray-900">
                <div className="mx-auto">
                    <h2 style={{ color: foodPrimaryBrown }} className="mb-12 text-3xl font-bold text-center">
                        Kategori Produk Kami
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="p-6 bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105"
                            >
                                <div className="mb-4 text-4xl">{category.icon}</div>
                                <h3 style={{ color: foodPrimaryBrown }} className="mb-2 text-xl font-semibold">
                                    {category.name}
                                </h3>
                                <p style={{ color: foodPrimaryBrown }} className="opacity-90">
                                    {category.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="px-4 py-16 bg-white transition-colors duration-300 md:px-8 lg:px-16 dark:bg-gray-900">
                <div className="mx-auto">
                    <div className="grid grid-cols-1 gap-12 items-center md:grid-cols-2">
                        <div>
                            <h2 style={{ color: foodPrimaryBrown }} className="mb-6 text-3xl font-bold">
                                Tentang Sagansa Food
                            </h2>
                            <p style={{ color: foodPrimaryBrown }} className="mb-4 opacity-90">
                                Sagansa Food adalah supplier makanan terkemuka yang berkomitmen untuk
                                menyediakan bahan makanan berkualitas tinggi untuk bisnis kuliner Anda.
                            </p>
                            <p style={{ color: foodPrimaryBrown }} className="opacity-90">
                                Dengan pengalaman lebih dari 10 tahun dan jaringan pemasok yang luas,
                                kami menjamin kualitas dan kesegaran setiap produk yang kami kirimkan.
                            </p>
                        </div>
                        <div className="flex justify-center items-center p-6 h-64 rounded-lg backdrop-blur-sm bg-white/10 dark:bg-gray-800/10">
                            <div className="text-4xl">🏭 🚚 🏪</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products Section */}
            <section className="px-4 py-16 bg-white transition-colors duration-300 dark:bg-gray-900 md:px-8 lg:px-16">
                <div className="mx-auto">
                    <h2 style={{ color: foodPrimaryBrown }} className="mb-12 text-3xl font-bold text-center">
                        Produk Unggulan
                    </h2>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-5">
                        {filteredProducts.map((product) => (
                            <Link
                                key={product.id}
                                href={route('product.show', product.slug)}
                                className="overflow-hidden bg-white rounded-lg shadow-lg transition-transform duration-300 transform dark:bg-gray-900 hover:scale-105"
                            >
                                <div className="overflow-hidden aspect-square">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="object-cover object-center w-full h-full"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 style={{ color: foodPrimaryBrown }} className="mb-2 text-lg font-semibold line-clamp-1">
                                        {product.name}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <span style={{ color: foodPrimaryBrown }} className="text-xl font-bold">
                                            Rp {product.online_price?.toLocaleString()}/{product.unit}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <Footer />
        </Layout>
        </ThemeProvider>
    );
}
