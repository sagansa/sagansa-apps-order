import { Typography, Box, Button, Paper, Stack } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#90caf9' },
        secondary: { main: '#f48fb1' },
        background: { default: '#121212', paper: '#1e1e1e' },
    },
});

export default function CheckoutSuccess({ auth, deliveryType, message }) {
    const isSelfPickup = deliveryType === 'self_pickup';

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <AuthenticatedLayout
                user={auth.user}
                header={<Typography variant="h4" component="h2" sx={{ color: 'text.primary' }}>
                    Checkout Berhasil
                </Typography>}
            >
                <Box sx={{
                    minHeight: 'calc(100vh - 200px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 4
                }}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 4,
                            maxWidth: 600,
                            width: '100%',
                            textAlign: 'center',
                            bgcolor: 'background.paper'
                        }}
                    >
                        <CheckCircleIcon
                            sx={{
                                fontSize: 80,
                                color: 'success.main',
                                mb: 2
                            }}
                        />

                        <Typography variant="h4" gutterBottom>
                            Pesanan Berhasil Dibuat!
                        </Typography>

                        <Stack spacing={2} alignItems="center" sx={{ mb: 3 }}>
                            {isSelfPickup ? (
                                <StorefrontIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            ) : (
                                <LocalShippingIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            )}
                            <Typography variant="body1">
                                {message}
                            </Typography>
                            {isSelfPickup && (
                                <Typography variant="body2" color="text.secondary">
                                    Jangan lupa untuk menunjukkan bukti pemesanan saat pengambilan pesanan.
                                </Typography>
                            )}
                        </Stack>

                        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => router.visit('/transaction-history')}
                            >
                                Lihat Pesanan
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => router.visit('/')}
                            >
                                Kembali ke Beranda
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </AuthenticatedLayout>
        </ThemeProvider>
    );
}
